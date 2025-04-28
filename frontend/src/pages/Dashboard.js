import React, { useEffect, useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddIcon from '@mui/icons-material/Add';
import LogoutIcon from '@mui/icons-material/Logout';
import StatisticsIcon from '@mui/icons-material/QueryStats';
import AddExerciseIcon from '@mui/icons-material/FitnessCenter';
import { useNavigate } from 'react-router-dom';
import AccountCircle from '@mui/icons-material/AccountCircle'; // Add this line
import axios from 'axios';
import { Card, CardContent, Avatar } from '@mui/material';
import img1 from '../images/pic2.jpg';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LocalDiningIcon from '@mui/icons-material/LocalDining'; // Icon for Food Stats
import SportsMartialArtsIcon from '@mui/icons-material/SportsMartialArts';
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import CircularProgress from '@mui/material/CircularProgress';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';




const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
  backgroundColor: '#87CEEB',  // Sky blue color for the opened drawer
  borderBottomRightRadius: '50px',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  backgroundColor: '#87CEEB',  // Sky blue color for the closed drawer
  borderBottomRightRadius: '50px',
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: '#87CEEB',
  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  })
);

export default function MiniDrawer() {
  const theme = useTheme();
  const [openStats, setOpenStats] = useState(false);
  const [open, setOpen] = useState(false);
  const [userName, setName] = useState("");
  const [userData, setUserData] = useState({
    email: "",
    weight: "",
    heightFeet: "",
    heightInches: "",
    gender: "",
    birthDate: "",
    bio: "",
  });
  const [profilePic, setProfilePic] = useState(""); // Store Base64 profile picture
  const [stats, setStats] = useState(null); // For stats section
  const [exerciseStats, setExerciseStats] = useState(null); // For exercise stats
  const navigate = useNavigate();

  useEffect(() => {
    const email = sessionStorage.getItem("email");
    const authToken = sessionStorage.getItem("authToken");

    if (!authToken || !email) {
      navigate("/"); // Redirect to login if no token or email
    } else {
      // Fetch user details
      axios
        .get(`http://localhost:8081/users?email=${email}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        })
        .then((response) => {
          if (response.data.user) {
            setName(response.data.user.name);
            setUserData({
              email: response.data.user.email,
              weight: response.data.user.weight,
              heightFeet: response.data.user.heightFeet,
              heightInches: response.data.user.heightInches,
              gender: response.data.user.gender,
              birthDate: response.data.user.birthDate,
              bio: response.data.user.bio,
            });
            sessionStorage.setItem("userName", response.data.user.name);

            // Fetch profile image if it exists
            axios
              .get(`http://localhost:8081/imageconverter/${email}`, {
                headers: {
                  Authorization: `Bearer ${authToken}`,
                },
              })
              .then((imageResponse) => {
                if (imageResponse.data.image) {
                  setProfilePic(imageResponse.data.image); // Set Base64 image
                }
              })
              .catch((imageError) => {
                console.warn(
                  "Profile image not found:",
                  imageError.response?.data.message || imageError.message
                );
              });
          }
        })
        .catch((error) => {
          console.error(
            "Error fetching user data:",
            error.response ? error.response.data : error.message
          );
        });

      // Fetch stats
      const fetchStats = async () => {
        try {
          const statsResponse = await axios.get(
            `http://localhost:8081/fooddiary/foodstats`, // Updated endpoint
            { headers: { email } } // Pass only the email in headers
          );
          setStats(statsResponse.data || {}); // Set an empty object if response is null or undefined
        } catch (statsError) {
          console.error("Error fetching stats:", statsError);
          setStats({}); // Handle error by setting an empty object
        }
      };

      fetchStats(); // Fetch stats immediately


      // Fetch exercise stats
      const fetchExerciseStats = async () => {
        try {
          const statsResponse = await axios.get(
            `http://localhost:8081/exercisediary/exercisestats`, // Updated endpoint for exercise stats
            { headers: { email } } // Pass only the email in headers
          );
          setExerciseStats(statsResponse.data || {}); // Set an empty object if response is null or undefined
        } catch (statsError) {
          console.error("Error fetching exercise stats:", statsError);
          setExerciseStats({}); // Handle error by setting an empty object
        }
      };

      fetchExerciseStats(); // Fetch exercise stats immediately



    }
  }, [navigate]);

  const [foodTargetKcal] = useState(10000); // Initial target for food
  const [exerciseTargetKcal] = useState(10000); // Initial target for exercise
  const [targetKcal, setTargetKcal] = useState(1500); // Initial target for total burn

  // Prepare chart data for food
  const chartData = {
    labels: ["Total Energy", "Total Protein", "Total Fat", "Total Net Carbs"],
    datasets: [
      {
        data: [
          stats?.totalEnergy || 0,
          stats?.totalProtein || 0,
          stats?.totalFat || 0,
          stats?.totalNetCarbs || 0,
        ],
        backgroundColor: ["#4CAF50", "#2196F3", "#FFC107", "#FF5722"],
        hoverBackgroundColor: ["#66BB6A", "#42A5F5", "#FFD54F", "#FF7043"],
        borderWidth: 1,
      },
    ],
  };

  // Prepare chart data for exercise stats
  const exerciseChartData = {
    labels: ["Total Energy", "Total Protein", "Total Fat", "Total Net Carbs"],
    datasets: [
      {
        data: [
          exerciseStats?.totalEnergy || 0, // Use exercise stats values
          exerciseStats?.totalProtein || 0,
          exerciseStats?.totalFat || 0,
          exerciseStats?.totalNetCarbs || 0,
        ],
        backgroundColor: ["#4CAF50", "#2196F3", "#FFC107", "#FF5722"], // Colors for each stat
        hoverBackgroundColor: ["#66BB6A", "#42A5F5", "#FFD54F", "#FF7043"], // Hover colors
        borderWidth: 1,
      },
    ],
  };

  // Load target value from localStorage when component mounts
  useEffect(() => {
    const storedTarget = localStorage.getItem("targetKcal");
    if (storedTarget) {
      setTargetKcal(Number(storedTarget));
    }
  }, []);

  // Update target value and save it to localStorage
  const handleTargetChange = (e) => {
    const newTarget = Number(e.target.value);
    setTargetKcal(newTarget);
    localStorage.setItem("targetKcal", newTarget);
  };
  // Register the required components
  ChartJS.register(ArcElement, Tooltip, Legend);



  const formatToDDMMYYYY = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) return "Invalid Date"; // Handle invalid dates gracefully

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };






  const handleLogout = () => {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('userName');
    navigate('/'); // Redirect to login page after logout
    window.location.reload();
  };

  const handleDashboard = () => {
    navigate('/dashboard');
  };

  const handleFood = () => {
    navigate('/addfood');
  };

  const handleExercise = () => {
    navigate('/addexercise');
  };

  const handleAccount = () => {
    navigate('/account');
  };

  const handleFoodStats = () => {
    navigate('/foodstats');
    window.location.reload();
  };

  const handleExerciseStats = () => {
    navigate('/exercisestats');
    window.location.reload();
  };

  const handleRecommendations = () => {
    navigate('/Recommendations');
    window.location.reload();
  };

  const toggleStatsDropdown = () => {
    setOpenStats(!openStats); // Toggle dropdown visibility
  };


  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={[{ marginRight: 5 }, open && { display: 'none' }]}
          >
            <MenuIcon sx={{ color: 'black', fontSize: '32px' }} />
          </IconButton>
          <Typography variant="h6" noWrap component="div" color="black">
            Dashboard
          </Typography>
          {/* Logout Button in the Right Corner */}
          <Box sx={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
            <Typography variant="body1" sx={{ color: 'black', marginRight: 2 }}>
              Welcome, {userName}
            </Typography>
            <IconButton color="inherit" onClick={handleLogout}>
              <LogoutIcon sx={{ color: 'black' }} />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
          {open && (
            <Typography
              variant="h6"
              sx={{
                color: 'Black',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                textAlign: 'center',
                flexGrow: 1,
                marginLeft: open ? '-30px' : '0px',
              }}
            >
              Menu
            </Typography>
          )}
        </DrawerHeader>
        <Divider />
        <Box sx={{ flexGrow: 1 }}>
          <List>
            <ListItem disablePadding sx={{ display: 'block' }}>
              <ListItemButton onClick={handleDashboard}>
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Dashboard" sx={{ opacity: 1 }} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding sx={{ display: 'block' }}>
              <ListItemButton onClick={handleFood}>
                <ListItemIcon>
                  <AddIcon />
                </ListItemIcon>
                <ListItemText primary="Food" sx={{ opacity: 1 }} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding sx={{ display: 'block' }}>
              <ListItemButton onClick={handleExercise}>
                <ListItemIcon>
                  <AddExerciseIcon />
                </ListItemIcon>
                <ListItemText primary="Add Exercise" sx={{ opacity: 1 }} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding sx={{ display: 'block' }}>
              <ListItemButton onClick={handleRecommendations}>
                <ListItemIcon>
                  <TipsAndUpdatesIcon />
                </ListItemIcon>
                <ListItemText primary="Recommendation" sx={{ opacity: 1 }} />
              </ListItemButton>
            </ListItem>

            {/* Statistics with dropdown for Food Stats and Exercise Stats */}
            <ListItem disablePadding sx={{ display: 'block' }}>
              <ListItemButton onClick={toggleStatsDropdown}>
                <ListItemIcon>
                  <StatisticsIcon />
                </ListItemIcon>
                <ListItemText primary="Statistics" sx={{ opacity: 1 }} />
                <ExpandMoreIcon sx={{ transform: openStats ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }} />
              </ListItemButton>

              {/* Dropdown for Food Stats and Exercise Stats */}
              {openStats && (
                <List component="div" disablePadding>
                  <ListItem disablePadding sx={{ display: 'block' }}>
                    <ListItemButton onClick={handleFoodStats}>
                      <ListItemIcon>
                        <LocalDiningIcon /> {/* Food Stats icon */}
                      </ListItemIcon>
                      <ListItemText primary="Food Stats" sx={{ opacity: 1 }} />
                    </ListItemButton>
                  </ListItem>
                  <ListItem disablePadding sx={{ display: 'block' }}>
                    <ListItemButton onClick={handleExerciseStats}>
                      <ListItemIcon>
                        <SportsMartialArtsIcon /> {/* Exercise Stats icon */}
                      </ListItemIcon>
                      <ListItemText primary="Exercise Stats" sx={{ opacity: 1 }} />
                    </ListItemButton>
                  </ListItem>
                </List>
              )}
            </ListItem>
            <ListItem disablePadding sx={{ display: 'block' }}>
              <ListItemButton onClick={handleAccount}>
                <ListItemIcon>
                  <AccountCircle />
                </ListItemIcon>
                <ListItemText primary="Account" sx={{ opacity: 1 }} />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>


      {/* main content  */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, marginTop: '64px' }}>
        <DrawerHeader />
        <Card
          sx={{
            maxWidth: '100%',
            margin: 'auto',
            position: 'relative',
            backgroundColor: '#f9f9f9',
            borderRadius: '16px',
            padding: '24px',
            marginTop: '-40px',
            boxShadow: '0 8px 20px rgba(0, 191, 255, 0.3)',
            '&:hover': {
              transform: 'scale(1.01)',
              boxShadow: '0px 4px 15px 5px rgba(0, 191, 255, 0.5)', // Sky blue box shadow
            },
            transition: 'transform 0.3s ease, box-shadow 0.3s ease', // Smooth transition effect
          }}
        >

          {/* Profile Top Section with Background Image */}
          <Box
            sx={{
              width: '100%',
              height: '200px',
              backgroundImage: `url(${img1})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'left',
              alignItems: 'center',
              position: 'relative',
            }}
          >
            {/* Profile Picture with White Circular Background */}
            <Avatar
              src={profilePic || "default-profile-pic.jpg"} // Fallback to a default image
              alt="Profile"
              sx={{
                width: '170px',
                height: '170px',
                borderRadius: '50%',
                border: '4px solid #fff', // Optional: border for better visibility
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                left: '10px',
              }}
            />
          </Box>
          {/* Profile Details Section */}
          <CardContent
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'left', // Align content to the left for details
              width: '100%',
            }}
          >
            {/* User Info */}
            <Box sx={{ width: '100%' }}>
              <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', marginBottom: '4px' }}>
                {userName}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 'bold', marginBottom: '12px' }}>
                Email: {userData.email}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 'bold', marginBottom: '12px' }}>
                Bio: {userData.bio}
              </Typography>

              <Box sx={{ display: 'flex', justifyContent: 'left', width: '100%' }}>

                <Typography variant="body1" component="div" sx={{ fontWeight: 'bold', marginRight: 4 }}>
                  Gender: {userData.gender}
                </Typography>
                {/* Divider */}
                <Box
                  sx={{
                    width: '1px',
                    height: '16px',
                    backgroundColor: '#ccc',
                    marginX: 1,
                  }}
                />

                <Typography variant="body1" component="div" sx={{ fontWeight: 'bold', marginRight: 4 }}>
                  DOB: {userData.birthDate ? formatToDDMMYYYY(userData.birthDate) : 'N/A'}
                </Typography>


                {/* Divider */}
                <Box
                  sx={{
                    width: '1px',
                    height: '16px',
                    backgroundColor: '#ccc',
                    marginX: 1,
                  }}
                />

                {/* Weight */}
                <Typography variant="body1" component="div" sx={{ fontWeight: 'bold', marginRight: 4 }}>
                  Weight: {userData.weight} kg
                </Typography>

                {/* Divider */}
                <Box
                  sx={{
                    width: '1px',
                    height: '16px',
                    backgroundColor: '#ccc',
                    marginX: 1,
                  }}
                />

                {/* Height Feet */}
                <Typography variant="body1" component="div" sx={{ fontWeight: 'bold', marginRight: 4 }}>
                  HeightFeet: {userData.heightFeet} cm
                </Typography>

                {/* Divider */}
                <Box
                  sx={{
                    width: '1px',
                    height: '16px',
                    backgroundColor: '#ccc',
                    marginX: 1,
                  }}
                />

                {/* Height Inches */}
                <Typography variant="body1" component="div" sx={{ fontWeight: 'bold' }}>
                  HeightInches: {userData.heightInches} in
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
        {/* Stats */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            gap: "20px",
            marginTop: "30px",
            marginBottom: "30px",
            alignItems: "center",
          }}
        >
          {/* Food Energy Consumed */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "30%",
            }}
          >
            <Typography variant="h6" sx={{ marginBottom: "10px", fontWeight: "bold" }}>
              Energy from Food
            </Typography>
            {/* <TextField
          label="Set Target (kcal)"
          type="number"
          value={foodTargetKcal}
          onChange={(e) => setFoodTargetKcal(Number(e.target.value))}
          sx={{ marginBottom: "10px" }}
        /> */}
            <Box sx={{ position: "relative", width: "150px", height: "150px" }}>
              {/* Gray background circle */}
              <CircularProgress
                variant="determinate"
                value={100} // Full circle as gray background
                size={150}
                thickness={8}
                sx={{ color: "#d3d3d3" }} // Light gray for the background
              />
              <CircularProgress
                variant="determinate"
                value={(chartData.datasets[0].data[0] / foodTargetKcal) * 100}
                size={150}
                thickness={8}
                sx={{ color: "#00bfff", position: "absolute", top: 0, left: 0 }}
              />
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  textAlign: "center",
                }}
              >
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  {chartData.datasets[0].data[0]} kcal
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Consumed
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Exercise Energy Burned */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "30%",
            }}
          >
            <Typography variant="h6" sx={{ marginBottom: "10px", fontWeight: "bold" }}>
              Exercise Energy Burned
            </Typography>
            {/* <TextField
          label="Set Target (kcal)"
          type="number"
          value={exerciseTargetKcal}
          onChange={(e) => setExerciseTargetKcal(Number(e.target.value))}
          sx={{ marginBottom: "10px" }}
        /> */}
            <Box sx={{ position: "relative", width: "150px", height: "150px" }}>
              {/* Gray background circle */}
              <CircularProgress
                variant="determinate"
                value={100} // Full circle as gray background
                size={150}
                thickness={8}
                sx={{ color: "#d3d3d3" }} // Light gray for the background
              />
              <CircularProgress
                variant="determinate"
                value={(exerciseChartData.datasets[0].data[0] / exerciseTargetKcal) * 100}
                size={150}
                thickness={8}
                sx={{ color: "#ff6347", position: "absolute", top: 0, left: 0 }}
              />
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  textAlign: "center",
                }}
              >
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  {exerciseChartData.datasets[0].data[0]} kcal
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Burned
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "30%",
            }}
          >
            <Typography variant="h6" sx={{ marginBottom: "10px", fontWeight: "bold" }}>
              Target Burn
            </Typography>
            <Box sx={{ position: "relative", width: "150px", height: "150px" }}>
              {/* Gray background circle */}
              <CircularProgress
                variant="determinate"
                value={100} // Full circle as gray background
                size={150}
                thickness={8}
                sx={{ color: "#d3d3d3" }} // Light gray for the background
              />
              <CircularProgress
                variant="determinate"
                value={(exerciseChartData.datasets[0].data[0] / targetKcal) * 100}
                size={150}
                thickness={8}
                sx={{ color: "#32cd32", position: "absolute", top: 0, left: 0 }}
              />
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  textAlign: "center",
                }}
              >
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  {targetKcal - exerciseChartData.datasets[0].data[0]} kcal
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Remaining
                </Typography>
              </Box>
              {/* Bash style input for setting target */}
              <Box
                sx={{
                  position: "absolute",
                  bottom: "-30px", // Positioned below the circle
                  right: "-15px", // Positioned on the right side
                  width: "120px",
                  padding: "5px 10px",
                  color: "#fff", // White text color
                  borderRadius: "5px",
                  fontFamily: "'Courier New', monospace", // Terminal-like font
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    marginLeft: "-20px", // Move it to the left by 5px
                    fontSize: "14px",
                    color: "black",
                  }}
                >
                  Target:
                </Typography>
                <input
                  type="number"
                  value={targetKcal}
                  onChange={handleTargetChange}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      // Handle "Enter" key press (optional logic)
                      console.log("Target set to:", targetKcal);
                    }
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: "14px",
                    width: "50px",
                    outline: "none",
                    textAlign: "right",
                  }}
                />
              </Box>
            </Box>
          </Box>
        </Box>

        {/* statistics */}
        <Box
          sx={{
            display: 'flex', // Flexbox to display cards side by side
            justifyContent: 'space-between', // Ensure cards are spaced out evenly
            gap: '20px', // Adds space between the cards
            marginTop: "50px",
          }}
        >
          {/* Nutritional Breakdown Card */}
          <Card
            sx={{
              padding: "24px",
              borderRadius: "16px",
              backgroundColor: "#f9f9f9",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "48%", // Adjusted width for better spacing
              boxShadow: '0 8px 20px rgba(0, 191, 255, 0.3)',
              '&:hover': {
                transform: 'scale(1.02)', // Slightly increased scale for hover effect
                boxShadow: '0px 8px 20px rgba(0, 191, 255, 0.5)', // Enhanced sky blue box shadow
              },
              transition: 'transform 0.3s ease, box-shadow 0.3s ease', // Smooth transition effect
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: 2 }}>
              Nutritional Breakdown
            </Typography>
            <Box
              sx={{
                position: "relative",
                width: "100%",
                height: "300px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Doughnut
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: true,
                }}
              />
              <Box
                sx={{
                  bottom: "8px",
                  right: "16px",
                  backgroundColor: "rgba(255, 255, 255, 0.8)", // Slightly more transparent for better visibility
                  padding: "12px",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", // Subtle shadow for popup effect
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: "bold", marginBottom: "4px" }}>
                  Total Energy: {chartData.datasets[0].data[0]} kcal
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: "bold", marginBottom: "4px" }}>
                  Protein: {chartData.datasets[0].data[1]} g
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: "bold", marginBottom: "4px" }}>
                  Fat: {chartData.datasets[0].data[2]} g
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                  Net Carbs: {chartData.datasets[0].data[3]} g
                </Typography>
              </Box>
            </Box>
          </Card>

          {/* Exercise Breakdown Card */}
          <Card
            sx={{
              padding: "24px",
              borderRadius: "16px",
              backgroundColor: "#f9f9f9",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "48%", // Adjusted width for better spacing
              boxShadow: '0 8px 20px rgba(0, 191, 255, 0.3)',
              '&:hover': {
                transform: 'scale(1.02)', // Slightly increased scale for hover effect
                boxShadow: '0px 8px 20px rgba(0, 191, 255, 0.5)', // Enhanced sky blue box shadow
              },
              transition: 'transform 0.3s ease, box-shadow 0.3s ease', // Smooth transition effect
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: 2 }}>
              Exercise Breakdown
            </Typography>
            <Box
              sx={{
                position: "relative",
                width: "100%",
                height: "300px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Doughnut
                data={exerciseChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: true,
                }}
              />
              <Box
                sx={{
                  // position: "absolute",
                  bottom: "8px",
                  right: "16px",
                  backgroundColor: "rgba(255, 255, 255, 0.8)", // Slightly more transparent for better visibility
                  padding: "12px",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", // Subtle shadow for popup effect
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: "bold", marginBottom: "4px" }}>
                  Total Energy Burned: {exerciseChartData.datasets[0].data[0]} kcal
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: "bold", marginBottom: "4px" }}>
                  Protein Burned: {exerciseChartData.datasets[0].data[1]} g
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: "bold", marginBottom: "4px" }}>
                  Fat Burned: {exerciseChartData.datasets[0].data[2]} g
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                  Net Carbs Burned: {exerciseChartData.datasets[0].data[3]} g
                </Typography>
              </Box>
            </Box>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}

