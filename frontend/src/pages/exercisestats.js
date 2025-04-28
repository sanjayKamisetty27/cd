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
import { useNavigate } from 'react-router-dom';
import AccountCircle from '@mui/icons-material/AccountCircle'; // Add this line
import StatisticsIcon from '@mui/icons-material/QueryStats';
import AddExerciseIcon from '@mui/icons-material/FitnessCenter';
import axios from 'axios';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LocalDiningIcon from '@mui/icons-material/LocalDining'; // Icon for Food Stats
import SportsMartialArtsIcon from '@mui/icons-material/SportsMartialArts';
import Calendar from "react-calendar";
import '../Styles/Enhanced.css';
import TablePagination from '@mui/material/TablePagination';
import TableFooter from '@mui/material/TableFooter';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LineElement, LinearScale, PointElement, BarElement } from "chart.js";
import CircularProgress from '@mui/material/CircularProgress';
import { faAppleAlt, faHeartbeat, faCarrot, faBiking } from "@fortawesome/free-solid-svg-icons"; // FontAwesome icons
// import WaterGlassIcon from "@mui/icons-material/LocalDrink"; // Import MUI icon
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Line } from "react-chartjs-2";
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import { Title } from "chart.js";
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Modal,
  Snackbar,
  TextField,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';


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

export default function ExerciseStatistics() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [openStats, setOpenStats] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [foodItems, setFoodItems] = useState([]);
  const [popupDetails, setPopupDetails] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newFood, setNewFood] = useState({
    name: "",
    protein: "",
    fat: "",
    energy: "",
    netCarbs: "",
    category: "",
    duration: "",
  });

  const textFieldStyle = {
    '& .MuiInputLabel-root': {
      color: '#87CEEB', // Sky blue label color
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#87CEEB', // Sky blue border color
      },
      '&:hover fieldset': {
        borderColor: '#87CEEB', // Sky blue on hover
      },
      '&.Mui-focused fieldset': {
        borderColor: '#87CEEB', // Sky blue when focused
      },
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: '#87CEEB', // Sky blue when focused
    },
  };


  const navigate = useNavigate();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };


  const email = sessionStorage.getItem("email");
  const authToken = sessionStorage.getItem("authToken");

  // Redirect to login if no token or email
  useEffect(() => {
    if (!authToken || !email) {
      navigate("/"); // Redirect to login
    }
  }, [authToken, email, navigate]);

  // Fetch food items based on the selected date
  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        // Adjust date for timezone offset before formatting
        const formattedDate = new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000)
          .toISOString()
          .split("T")[0];

        const response = await axios.get(
          `http://localhost:8080/exercisediary/list/${formattedDate}`,
          {
            headers: {
              email: email,
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        setFoodItems(response.data);
      } catch (error) {
        console.error("Error fetching exercise:", error.response?.data || error.message);
      }
    };

    if (email && authToken) {
      fetchFoodItems();
    }
  }, [selectedDate, email, authToken]);

  // Delete a food item
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/exercisediary/delete/${id}`, {
        headers: {
          email: email,
          Authorization: `Bearer ${authToken}`,

        },
      });
      setFoodItems(foodItems.filter((item) => item.id !== id));
      window.location.reload();
    } catch (error) {
      console.error("Error deleting exercise:", error.response?.data || error.message);
    }
  };

  // Show details of a food item
  const handleShowDetails = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/exercisediary/details/${id}`,
        {
          headers: {
            email: email,
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setPopupDetails(response.data);
      setShowPopup(true);
    } catch (error) {
      console.error("Error fetching exercise:", error.response?.data || error.message);
    }
  };

  // Handle logout
  const handleLogout = () => {
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("email");
    navigate("/"); // Redirect to login
    window.location.reload();
  };


  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewFood({ ...newFood, [name]: value });
  };

  // Add new food item
  const handleAddFood = async () => {
    const email = sessionStorage.getItem("email");

    if (!email) {
      setSnackbar({
        open: true,
        severity: "error",
        message: "Email not found. Please log in again.",
      });
      return;
    }

    if (!newFood.name || newFood.name.trim() === "") {
      setSnackbar({
        open: true,
        severity: "error",
        message: "Name cannot be null or empty.",
      });
      return;
    }

    if (!newFood.duration || newFood.duration <= 0) {
      setSnackbar({
        open: true,
        severity: "error",
        message: "duration must be greater than 30.",
      });
      return;
    }

    // Adjust nutritional values based on duration
    const adjustedFoodItem = {
      name: newFood.name,
      protein: (newFood.protein * newFood.duration) / 30,
      fat: (newFood.fat * newFood.duration) / 30,
      energy: (newFood.energy * newFood.duration) / 30,
      netCarbs: (newFood.netCarbs * newFood.duration) / 30,
      category: newFood.category,
      duration: newFood.duration, // Keep the duration for reference
    };


    try {
      const response = await axios.post(
        "http://localhost:8080/exercisediary/add",
        adjustedFoodItem,
        { headers: { email } }
      );

      if (response.status === 200) {
        setSnackbar({
          open: true,
          severity: "success",
          message: "exercise added successfully!",
        });
        handleClose(); // Close the modal
        window.location.reload(); // Reload the page
      } else {
        setSnackbar({
          open: true,
          severity: "error",
          message: "Failed to add exercise. Please try again.",
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        severity: "error",
        message: `Error: ${error.response ? error.response.data : error.message}`,
      });
    }
  };


  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "",
    message: "",
  });

  // Handle modal open and close
  const handleClose = () => {
    setOpen(false);
    setNewFood({ name: "", protein: "", fat: "", energy: "", netCarbs: "", category: "", duration: "" });
  };

  const handleDashboard = () => {
    navigate('/dashboard');
  };

  const handleFood = () => {
    navigate('/addfood');
  };

  const handleFoodStats = () => {
    navigate('/foodstats');
    window.location.reload();
  };

  const handleExerciseStats = () => {
    navigate('/exercisestats');
    window.location.reload();
  };

  const toggleStatsDropdown = () => {
    setOpenStats(!openStats); // Toggle dropdown visibility
  };

  const handleExercise = () => {
    navigate('/addexercise');
  };

  const handleAccount = () => {
    navigate('/account');
  };

  const handleRecommendations = () => {
    navigate('/Recommendations');
    window.location.reload();
  };

  const [page, setPage] = useState(0); // Current page
  const rowsPerPage = 2; // Rows per page (fixed to 5)

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0); // Reset to the first page
  };


  const [stats, setStats] = useState(null); // For stats section 
  // Fetch stats for selected date
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Adjust date for timezone offset before formatting
        const formattedDate = new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000)
          .toISOString()
          .split("T")[0];
        const response = await axios.get(
          `http://localhost:8080/exercisediary/stats/${formattedDate}`,
          { headers: { email } }
        );
        setStats(response.data || {});  // Set an empty object if response is null or undefined
      } catch (error) {
        console.error("Error fetching stats:", error);
        setStats({});  // Handle error by setting an empty object
      }
    };

    if (selectedDate) {
      fetchStats();
    }
  }, [selectedDate, email]);

  // Fetch graph data grouped by category for the selected date
  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        setLoading(true);
        // Format date to `YYYY-MM-DD`
        const formattedDate = new Date(
          selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000
        )
          .toISOString()
          .split("T")[0];

        const response = await axios.get(
          `http://localhost:8080/exercisediary/exercisestats/graph/${formattedDate}`,
          { headers: { email } }
        );
        setGraphData(response.data || {}); // Set empty object if response is null or undefined
      } catch (error) {
        console.error("Error fetching graph data:", error);
        setGraphData({});
      } finally {
        setLoading(false);
      }
    };

    if (selectedDate && email) {
      fetchGraphData();
    }
  }, [selectedDate, email]);

  const getExerciseLineChartData = (nutrient) => {
    if (!graphData) return { labels: [], datasets: [] };

    // Fixed meal labels
    const mealLabels = ["Breakfast", "Lunch", "Snacks", "Dinner"];

    // Map fixed meal labels to graph data
    const values = mealLabels.map((meal) => {
      const mealData = graphData[meal] || {}; // Get meal data or default to an empty object
      return mealData[nutrient] || 0; // Get the nutrient value or default to 0
    });

    return {
      labels: mealLabels, // Use fixed labels
      datasets: [
        {
          label: `${nutrient.charAt(0).toUpperCase() + nutrient.slice(1)} Burned`,
          data: values, // Use mapped nutrient values
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
        },
      ],
    };
  };






  const [graphData, setGraphData] = useState(null); // For graph data
  const [loading, setLoading] = useState(false);
  ChartJS.register(
    CategoryScale, // Register CategoryScale
    ArcElement,
    Tooltip,
    Legend,
    LineElement,
    LinearScale,
    PointElement,
    BarElement,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

  // const [waterCount, setWaterCount] = useState(0);
  // const [waterTarget, setWaterTarget] = useState(8); // Default target is 8 glasses


  // // Format the selected date once for consistent use
  // const formattedDate = new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000)
  //   .toISOString()
  //   .split("T")[0];

  // // Initialize waterCount from sessionStorage or reset if the date changes
  // useEffect(() => {
  //   const storedDate = sessionStorage.getItem("waterDate");
  //   const storedCount = sessionStorage.getItem("waterCount");

  //   if (storedDate === formattedDate) {
  //     setWaterCount(parseInt(storedCount, 10) || 0);
  //   } else {
  //     sessionStorage.setItem("waterDate", formattedDate);
  //     sessionStorage.setItem("waterCount", 0);
  //     setWaterCount(0);
  //   }
  // }, [formattedDate]);

  // // Update waterCount in sessionStorage whenever it changes
  // useEffect(() => {
  //   sessionStorage.setItem("waterCount", waterCount);
  // }, [waterCount]);

  // // Increment water count
  // const incrementWater = () => {
  //   if (waterCount < waterTarget) {
  //     setWaterCount((prevCount) => prevCount + 1);
  //   }
  // };

  // // Decrement water count
  // const decrementWater = () => {
  //   if (waterCount > 0) {
  //     setWaterCount((prevCount) => prevCount - 1);
  //   }
  // };





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
            Exercise Statistics
          </Typography>
          {/* Logout Button in the Right Corner */}
          <Box sx={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
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
      <Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: "center",
            alignItems: 'flex-start',
            padding: '16px',
            marginTop: '60px',
            marginLeft: '20px',
          }}
        >
          {/* Food Items Table */}
          <Box
            sx={{
              flex: 2,
              padding: 2,
              borderRadius: '10px',
              width: '1000px',
            }}
          >
            <TableContainer component={Paper}
              sx={{
                borderRadius: '8px',
                overflowY: 'auto',
                boxShadow: '0 8px 20px rgba(0, 191, 255, 0.3)',
                '&:hover': {
                  transform: 'scale(1.01)',
                  boxShadow: '0px 4px 15px 5px rgba(0, 191, 255, 0.5)', // Sky blue box shadow
                },
                transition: 'transform 0.3s ease, box-shadow 0.3s ease', // Smooth transition effect
              }}
            >
              <Table padding="dense">
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#87ceeb' }}>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Name</TableCell>
                    <TableCell
                      sx={{
                        color: 'white',
                        fontWeight: 'bold',
                        textAlign: 'right',
                        padding: '20px',
                      }}
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {/* Pagination logic */}
                  {rowsPerPage > 0
                    ? foodItems
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell
                            sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}
                          >
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => handleShowDetails(item.id)}
                              sx={{
                                borderColor: '#00bfff',
                                color: '#00bfff',
                                '&:hover': { backgroundColor: '#e0f7ff' },
                              }}
                            >
                              Details
                            </Button>
                            <Button
                              variant="contained"
                              size="small"
                              color="error"
                              onClick={() => handleDelete(item.id)}
                              sx={{ color: 'white' }}
                            >
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    : null}
                </TableBody>
                <TableFooter
                  sx={{
                    position: 'sticky', // Makes the footer stick to its parent
                    marginBottom: 0, // Aligns the footer to the bottom
                    backgroundColor: '#f9f9f9', // Background to visually separate it
                    borderTop: '1px solid #e0e0e0', // Optional: Divider above footer
                    zIndex: 1, // Ensures it appears above scrollable content
                  }}
                >
                  <TableRow>
                    <TablePagination
                      rowsPerPageOptions={[2]}
                      colSpan={2}
                      count={foodItems.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                  </TableRow>
                </TableFooter>
              </Table>
            </TableContainer>
          </Box>
        </Box>

        {/* Create Food Box */}
        <Box
          sx={{
            flex: 2,
            padding: 2,
            borderRadius: '10px',
            width: '970px',
            bgcolor: 'white',
            display: 'flex',
            justifyContent: 'space-between', // Space between text and icon
            alignItems: 'center', // Vertically center items
            boxShadow: '0 8px 20px rgba(0, 191, 255, 0.3)',
            '&:hover': {
              transform: 'scale(1.01)',
              boxShadow: '0px 4px 15px 5px rgba(0, 191, 255, 0.5)', // Sky blue box shadow
            },
            transition: 'transform 0.3s ease, box-shadow 0.3s ease', // Smooth transition effect
            marginLeft: 6, // Add space from the drawer
          }}
        >
          <Typography variant="h6" sx={{ color: 'black' }}>
            Add Your Own Exercise
          </Typography>
          <IconButton
            onClick={() => setIsModalOpen(true)}
            sx={{ ml: 2 }}
          >
            <AddCircleOutlineIcon fontSize="large" sx={{ color: '#87CEEB' }} /> {/* Sky blue icon */}
          </IconButton>
        </Box>

        {/* Modal for Adding Food */}
        <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "white",
              p: 4,
              borderRadius: 2,
              boxShadow: 24,
            }}
          >
            <Typography variant="h6" mb={2}>
              Add Exercise
            </Typography>

            {/* Name */}
            <TextField
              label="Name(Per 30 min)"
              name="name"
              value={newFood.name}
              onChange={handleChange}
              fullWidth
              margin="normal"
              sx={textFieldStyle}
            />

            {/* Protein */}
            <TextField
              label="Burns Protein (g)"
              name="protein"
              value={newFood.protein}
              onChange={handleChange}
              fullWidth
              margin="normal"
              sx={textFieldStyle}
            />

            {/* Fat */}
            <TextField
              label="Burns Fat (g)"
              name="fat"
              value={newFood.fat}
              onChange={handleChange}
              fullWidth
              margin="normal"
              sx={textFieldStyle}
            />

            {/* Energy */}
            <TextField
              label="Required Energy (kcal)"
              name="energy"
              value={newFood.energy}
              onChange={handleChange}
              fullWidth
              margin="normal"
              sx={textFieldStyle}
            />

            {/* Net Carbs */}
            <TextField
              label="Burns Net Carbs (g)"
              name="netCarbs"
              value={newFood.netCarbs}
              onChange={handleChange}
              fullWidth
              margin="normal"
              sx={textFieldStyle}
            />
            {/* Duration */}
            <TextField
              label="Duration (min)"
              name="duration"
              type="number"
              value={newFood.duration}
              onChange={(e) => {
                const value = Math.max(30, parseInt(e.target.value, 10) || 0); // Ensure minimum of 30
                handleChange({ target: { name: 'duration', value } });
              }}
              fullWidth
              margin="normal"
              sx={textFieldStyle}
            />

            {/* Category Dropdown */}
            <FormControl fullWidth variant="outlined" margin="normal">
              <InputLabel
                sx={{
                  color: '#87CEEB', // Sky blue label color by default
                  '&.Mui-focused': {
                    color: '#87CEEB', // Sky blue when the field is focused
                  },
                }}
              >
                Category
              </InputLabel> {/* Apply color directly here */}
              <Select
                value={newFood.category || ''} // Ensure a default empty string if category is not set
                onChange={handleChange}
                name="category"
                label="Category"
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#87CEEB', // Sky blue border color
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#87CEEB', // Sky blue on hover
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#87CEEB', // Sky blue when focused
                  },
                  '& .MuiInputLabel-root': {
                    color: '#87CEEB', // Sky blue label color by default
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#87CEEB', // Sky blue border color
                    },
                    '&:hover fieldset': {
                      borderColor: '#87CEEB', // Sky blue on hover
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#87CEEB', // Sky blue when focused
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#87CEEB', // Sky blue when focused
                  },
                }}
              >
                <MenuItem value="Breakfast">Breakfast</MenuItem>
                <MenuItem value="Lunch">Lunch</MenuItem>
                <MenuItem value="Dinner">Dinner</MenuItem>
                <MenuItem value="Snacks">Snacks</MenuItem>
              </Select>
            </FormControl>

            {/* Submit Button */}
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{
                mt: 2,
                bgcolor: '#87CEEB', // Sky blue background
                '&:hover': {
                  bgcolor: '#00BFFF', // Lighter sky blue on hover
                },
              }}
              onClick={handleAddFood}
            >
              Submit
            </Button>
          </Box>
        </Modal>
        {/* Category graph */}
        <Box sx={{ width: '100%', padding: '20px', marginTop: 4 }}>
          <Typography
            variant="h2"
            sx={{
              textAlign: "center",
              fontSize: "2.5rem",
              marginBottom: "30px",
              color: "#00aaff",
              textShadow: "0 2px 5px rgba(0, 170, 255, 0.5)",
            }}
          >
            Exercise Graphs by Category
          </Typography>
          {loading ? (
            <Typography
              sx={{
                textAlign: "center",
                fontSize: "1.2rem",
                color: "#00aaff",
              }}
            >
              Loading graph data...
            </Typography>
          ) : graphData && Object.keys(graphData).length > 0 ? (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "30px",
                width: "100%",
                boxSizing: "border-box",
              }}
            >
              {["energy", "protein", "fat", "netCarbs"].map((nutrient) => (
                <Box
                  key={nutrient}
                  sx={{
                    background: "#f0faff",
                    borderRadius: "15px",
                    padding: "20px",
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                    transition: "transform 0.2s, boxShadow 0.2s",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    '&:hover': {
                      transform: "scale(1.02)",
                      boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
                    },
                  }}
                >
                  <Typography
                    variant="h3"
                    sx={{
                      fontSize: "1.5rem",
                      color: "#00aaff",
                      textAlign: "center",
                      marginBottom: "15px",
                    }}
                  >
                    {nutrient.charAt(0).toUpperCase() + nutrient.slice(1)}
                  </Typography>
                  <Line
                    data={getExerciseLineChartData(nutrient)}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          display: true,
                          labels: {
                            color: "#00aaff",
                          },
                        },
                      },
                      scales: {
                        x: {
                          ticks: {
                            color: "#00aaff",
                          },
                        },
                        y: {
                          ticks: {
                            color: "#00aaff",
                          },
                        },
                      },
                      elements: {
                        line: {
                          tension: 0.4, // Smooth curved lines
                        },
                      },
                    }}
                  />
                </Box>
              ))}
            </Box>
          ) : (
            <Typography
              sx={{
                textAlign: "center",
                fontSize: "1.2rem",
                color: "#00aaff",
              }}
            >
              No data available for the selected date.
            </Typography>
          )}
        </Box>
      </Box>
      <div className="container mt-5 d-flex flex-column align-items-center">
        {/* Calendar Component */}
        <div
          className="calendar-container p-4 shadow-lg rounded mb-4"
          style={{
            width: "100%", // Ensures consistent width
            maxWidth: "500px", // Optional: Limit max width for better alignment
          }}
        >
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            className="custom-calendar"
            tileClassName={({ date }) =>
              date.toDateString() === selectedDate.toDateString()
                ? "selected-date"
                : date.toDateString() === new Date().toDateString()
                  ? "today-date"
                  : ""
            }
          />
          <div className="text-center mt-3">
            <strong className="text-primary">{selectedDate.toDateString()}</strong>
          </div>
        </div>
        <Box
          sx={{
            marginTop: 13,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 2, // Reduced vertical gap
            ml: "15px",
            marginBottom: 4,
            width: "100%",
          }}
        >
          {/* Title Section */}
          <Typography
            variant="h5"
            align="center"
            gutterBottom
            fontWeight="bold"
            sx={{
              fontSize: "1.5rem",
              mr: 10,
              marginBottom: "30px",
              color: "#00aaff",
              textShadow: "0 2px 5px rgba(0, 170, 255, 0.5)",
            }}
          >
            Exercise Statistics for {selectedDate.toDateString()}
          </Typography>
          {/* Info Box with Circular Progress Indicators */}
          {stats ? (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)", // 2 cards per row
                gap: 3, // Increased horizontal gap
                width: "100%",
                marginBottom: 3,
              }}
            >
              {/* Protein Burned Card */}
              <Box
                sx={{
                  padding: 2, // Reduced padding
                  borderRadius: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  width: "200px", // Reduced width
                  backgroundColor: "white",
                  boxShadow: '0 8px 20px rgba(0, 191, 255, 0.3)',
                  '&:hover': {
                    transform: 'scale(1.01)',
                    boxShadow: '0px 4px 15px 5px rgba(0, 191, 255, 0.5)', // Sky blue box shadow
                  },
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease', // Smooth transition effect
                }}
              >
                <Box sx={{ position: "relative", display: "inline-block" }}>
                  {/* Background Circle (Gray) */}
                  <CircularProgress
                    variant="determinate"
                    value={100}
                    size={100} // Reduced size
                    thickness={5}
                    sx={{
                      color: "#f0f0f0", // Gray background circle
                    }}
                  />
                  {/* Colored Progress Circle (Protein Burned) */}
                  <CircularProgress
                    variant="determinate"
                    value={(stats.totalProtein / 2000) * 100} // Protein burned progress
                    size={100} // Reduced size
                    thickness={5}
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      color: "#ff6347", // Colored section (Protein)
                    }}
                  />
                  {/* Icon in the center of the circle */}
                  <IconButton
                    sx={{
                      position: "absolute",
                      top: "50%", // Center vertically
                      left: "50%", // Center horizontally
                      transform: "translate(-50%, -50%)", // Perfectly center the icon
                      zIndex: 1,
                    }}
                  >
                    <FontAwesomeIcon icon={faAppleAlt} style={{ color: "#ff6347", fontSize: "30px" }} />
                  </IconButton>
                </Box>
                <Typography variant="h6" sx={{ color: "#ff6347", fontWeight: "bold", marginTop: 2 }}>
                  Protein Burned
                </Typography>
                <Typography variant="h4" sx={{ color: "#ff6347", fontWeight: "bold", fontSize: "1rem" }}>
                  {stats.totalProtein} g / 2000 g
                </Typography>
              </Box>

              {/* Energy Burned Card */}
              <Box
                sx={{
                  padding: 2, // Reduced padding
                  borderRadius: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  width: "200px", // Reduced width
                  backgroundColor: "white",
                  boxShadow: '0 8px 20px rgba(0, 191, 255, 0.3)',
                  '&:hover': {
                    transform: 'scale(1.01)',
                    boxShadow: '0px 4px 15px 5px rgba(0, 191, 255, 0.5)', // Sky blue box shadow
                  },
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease', // Smooth transition effect
                }}
              >
                <Box sx={{ position: "relative", display: "inline-block" }}>
                  {/* Background Circle (Gray) */}
                  <CircularProgress
                    variant="determinate"
                    value={100}
                    size={100} // Reduced size
                    thickness={5}
                    sx={{
                      color: "#f0f0f0", // Gray background circle
                    }}
                  />
                  {/* Colored Progress Circle (Energy Burned) */}
                  <CircularProgress
                    variant="determinate"
                    value={(stats.totalEnergy / 2000) * 100} // Energy burned progress
                    size={100} // Reduced size
                    thickness={5}
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      color: "#00bfff", // Colored section (Energy)
                    }}
                  />
                  {/* Icon in the center of the circle */}
                  <IconButton
                    sx={{
                      position: "absolute",
                      top: "50%", // Center vertically
                      left: "50%", // Center horizontally
                      transform: "translate(-50%, -50%)", // Perfectly center the icon
                      zIndex: 1,
                    }}
                  >
                    <FontAwesomeIcon icon={faHeartbeat} style={{ color: "#00bfff", fontSize: "30px" }} />
                  </IconButton>
                </Box>
                <Typography variant="h6" sx={{ color: "#00bfff", fontWeight: "bold", marginTop: 2 }}>
                  Energy Taken
                </Typography>
                <Typography variant="h4" sx={{ color: "#00bfff", fontWeight: "bold", fontSize: "1rem" }}>
                  {stats.totalEnergy} kcal / 2000 kcal
                </Typography>
              </Box>

              {/* Carbs Burned Card */}
              <Box
                sx={{
                  padding: 2, // Reduced padding
                  borderRadius: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  width: "200px", // Reduced width
                  backgroundColor: "white",
                  boxShadow: '0 8px 20px rgba(0, 191, 255, 0.3)',
                  '&:hover': {
                    transform: 'scale(1.01)',
                    boxShadow: '0px 4px 15px 5px rgba(0, 191, 255, 0.5)', // Sky blue box shadow
                  },
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease', // Smooth transition effect
                }}
              >
                <Box sx={{ position: "relative", display: "inline-block" }}>
                  {/* Background Circle (Gray) */}
                  <CircularProgress
                    variant="determinate"
                    value={100}
                    size={100} // Reduced size
                    thickness={5}
                    sx={{
                      color: "#f0f0f0", // Gray background circle
                    }}
                  />
                  {/* Colored Progress Circle (Carbs Burned) */}
                  <CircularProgress
                    variant="determinate"
                    value={(stats.totalNetCarbs / 1000) * 100} // Carbs burned progress
                    size={100} // Reduced size
                    thickness={5}
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      color: "#ffeb3b", // Colored section (Carbs)
                    }}
                  />
                  {/* Icon in the center of the circle */}
                  <IconButton
                    sx={{
                      position: "absolute",
                      top: "50%", // Center vertically
                      left: "50%", // Center horizontally
                      transform: "translate(-50%, -50%)", // Perfectly center the icon
                      zIndex: 1,
                    }}
                  >
                    <FontAwesomeIcon icon={faCarrot} style={{ color: "#ffeb3b", fontSize: "30px" }} />
                  </IconButton>
                </Box>
                <Typography variant="h6" sx={{ color: "#ffeb3b", fontWeight: "bold", marginTop: 2 }}>
                  Carbs Burned
                </Typography>
                <Typography variant="h4" sx={{ color: "#ffeb3b", fontWeight: "bold", fontSize: "1rem" }}>
                  {stats.totalNetCarbs} g / 1000 g
                </Typography>
              </Box>

              {/* Fat Burned Card */}
              <Box
                sx={{
                  padding: 2, // Reduced padding
                  borderRadius: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  width: "200px", // Reduced width
                  backgroundColor: "white",
                  boxShadow: '0 8px 20px rgba(0, 191, 255, 0.3)',
                  '&:hover': {
                    transform: 'scale(1.01)',
                    boxShadow: '0px 4px 15px 5px rgba(0, 191, 255, 0.5)', // Sky blue box shadow
                  },
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease', // Smooth transition effect
                }}
              >
                <Box sx={{ position: "relative", display: "inline-block" }}>
                  {/* Background Circle (Gray) */}
                  <CircularProgress
                    variant="determinate"
                    value={100}
                    size={100} // Reduced size
                    thickness={5}
                    sx={{
                      color: "#f0f0f0", // Gray background circle
                    }}
                  />
                  {/* Colored Progress Circle (Fat Burned) */}
                  <CircularProgress
                    variant="determinate"
                    value={(stats.totalFat / 1000) * 100} // Fat burned progress
                    size={100} // Reduced size
                    thickness={5}
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      color: "#f44336", // Colored section (Fat)
                    }}
                  />
                  {/* Icon in the center of the circle */}
                  <IconButton
                    sx={{
                      position: "absolute",
                      top: "50%", // Center vertically
                      left: "50%", // Center horizontally
                      transform: "translate(-50%, -50%)", // Perfectly center the icon
                      zIndex: 1,
                    }}
                  >
                    <FontAwesomeIcon icon={faBiking} style={{ color: "#f44336", fontSize: "30px" }} />
                  </IconButton>
                </Box>
                <Typography variant="h6" sx={{ color: "#f44336", fontWeight: "bold", marginTop: 2 }}>
                  Fat Burned
                </Typography>
                <Typography variant="h4" sx={{ color: "#f44336", fontWeight: "bold", fontSize: "1rem" }}>
                  {stats.totalFat} g / 1000 g
                </Typography>
              </Box>
            </Box>
          ) : (
            <CircularProgress />
          )}
        </Box>
        {/* Popup for Food Details */}
        <Modal
          open={showPopup && popupDetails}
          onClose={() => setShowPopup(false)}
          aria-labelledby="food-details-modal"
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              width: 500,
              backgroundColor: '#f0f8ff', // Light sky blue background
              padding: 4,
              borderRadius: '12px',
              boxShadow: '0 4px 15px rgba(0, 191, 255, 0.2)', // Sky blue shadow
              textAlign: 'left', // Align text to the left
              overflowY: 'auto',
            }}
          >
            {popupDetails ? (
              <>
                <Typography
                  variant="h5"
                  sx={{
                    marginBottom: 2,
                    color: '#0077b6', // Darker blue for the title
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}
                >
                  {popupDetails.name || 'No Name Available'}
                </Typography>

                {/* Display the food details inside a form-like structure */}
                <Box
                  sx={{
                    backgroundColor: '#b0e0e6', // Slightly darker sky blue background for the details
                    padding: 3,
                    borderRadius: '8px',
                    color: 'black', // Text color is black
                    fontSize: '1rem',
                    marginBottom: 2,
                  }}
                >
                  <Typography sx={{ marginBottom: 1 }}>
                    <strong>Required Energy:</strong> {popupDetails.energy || 'N/A'} kcal
                  </Typography>
                  <Typography sx={{ marginBottom: 1 }}>
                    <strong>Burns Protein:</strong> {popupDetails.protein || 'N/A'} g
                  </Typography>
                  <Typography sx={{ marginBottom: 1 }}>
                    <strong>Burns Fat:</strong> {popupDetails.fat || 'N/A'} g
                  </Typography>
                  <Typography sx={{ marginBottom: 1 }}>
                    <strong>Burns Net Carbs:</strong> {popupDetails.netCarbs || 'N/A'} g
                  </Typography>
                  <Typography sx={{ marginBottom: 1 }}>
                    <strong>Category:</strong> {popupDetails.category || 'N/A'}
                  </Typography>
                  <Typography sx={{ marginBottom: 2 }}>
                    <strong>Duration:</strong> {popupDetails.duration || 'N/A'} min
                  </Typography>
                </Box>

                {/* Close Button */}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setShowPopup(false)}
                  sx={{
                    backgroundColor: '#00bfff', // Sky blue button
                    '&:hover': {
                      backgroundColor: '#0077b6', // Darker blue on hover
                    },
                    marginTop: 2,
                    padding: '8px 20px',
                    borderRadius: '5px',
                    fontWeight: 'bold',
                    textTransform: 'none',
                    display: 'block', // Center button
                    marginLeft: 'auto',
                    marginRight: 'auto',
                  }}
                >
                  Close
                </Button>
              </>
            ) : (
              <Typography sx={{ fontSize: '1.2rem', color: '#0077b6' }}>No details available</Typography>
            )}
          </Box>
        </Modal>

      </div>
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}