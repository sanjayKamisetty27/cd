import React, { useState, useEffect } from 'react';
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
import AccountCircle from '@mui/icons-material/AccountCircle';
import {
  Grid, Card, CardMedia, CardContent, Button, Pagination, Snackbar,
  Alert, Dialog, DialogActions, DialogContent, DialogTitle, Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import axios from 'axios';
import StatisticsIcon from '@mui/icons-material/QueryStats';
import AddExerciseIcon from '@mui/icons-material/FitnessCenter';
import TextField from '@mui/material/TextField';
import { Search } from '@mui/icons-material'; // Import icons
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LocalDiningIcon from '@mui/icons-material/LocalDining'; // Icon for Food Stats
import SportsMartialArtsIcon from '@mui/icons-material/SportsMartialArts';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';



const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
  backgroundColor: '#87CEEB',
  borderBottomRightRadius: '50px',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  backgroundColor: '#87CEEB',
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

export default function AddFood() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const [, setFoodItems] = useState([]);
  const [filteredFoodItems, setFilteredFoodItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [openStats, setOpenStats] = useState(false);
  const [openDialog, setOpenDialog] = useState(false); // Dialog state
  const itemsPerPage = 3; // Show 3 items per page
  const [selectedCategory, setSelectedCategory] = useState('');
  const [foodItem, setFoodItem] = useState(null); // Store the selected item

  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        const response = await axios.get('http://localhost:8081/food/all'); // Adjust this URL as per your backend API
        setFoodItems(response.data);
        setFilteredFoodItems(response.data); // Initially set filtered items to all food items
      } catch (error) {
        console.error('Error fetching food items:', error);
      }
    };

    fetchFoodItems();
  }, []);

  const [buttonClicked, setButtonClicked] = useState(false);

  const handleButtonClick = () => {
    setButtonClicked(!buttonClicked);
  };



  const handlePageChange = (event, value) => {
    setPage(value); // Change the current page
  };

  const paginatedFoodItems = filteredFoodItems.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleSearch = async (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    try {
      // Fetch food items based on the search query
      const response = await axios.get(`http://localhost:8081/food/search?name=${query}`);
      setFilteredFoodItems(response.data); // Update the filtered items based on the search result
    } catch (error) {
      console.error('Error fetching food items:', error);
    }
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const email = sessionStorage.getItem('email');
    const authToken = sessionStorage.getItem('authToken');

    if (!authToken || !email) {
      navigate('/'); // Redirect to login if no token or email
    } else {
      axios.get(`http://localhost:8081/users?email=${email}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      })
        .then(response => {
          if (response.data.user && response.data.user.name) {
            sessionStorage.setItem('userName', response.data.user.name); // Store name in session
          }
        })
        .catch(error => {
          console.error('Error fetching user data:', error.response ? error.response.data : error.message);
        });
    }
  }, [navigate]);


  const handleLogout = () => {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('userName');
    navigate('/'); // Redirect to login page after logout
    window.location.reload();
  };

  const handleAddFood = async (item, category, totalEnergy, totalProtein, totalFat, totalCarbs) => {
    // Retrieve the email from session storage
    const email = sessionStorage.getItem('email');

    if (!email) {
      console.error('Email not found in session. Please log in again.');
      setSnackbar({
        open: true,
        severity: 'error',
        message: 'Email not found. Please log in again.'
      });
      return;
    }

    // Create the food diary entry object with the selected category and calculated values
    const foodDiaryEntry = {
      name: item.name,         // Name of the food item
      energy: totalEnergy,     // Total Energy in kcal based on quantity
      protein: totalProtein,   // Total Protein in grams based on quantity
      fat: totalFat,           // Total Fat in grams based on quantity
      netCarbs: totalCarbs,    // Total Net Carbs in grams based on quantity
      category: category,      // Category of the food item (Breakfast, Lunch, Dinner, Snacks)
      quantity: quantity       // The quantity entered by the user
    };

    // Validate the Name field (ensure it is not empty)
    if (!foodDiaryEntry.name || foodDiaryEntry.name.trim() === '') {
      console.error('Name cannot be null or empty');
      setSnackbar({
        open: true,
        severity: 'error',
        message: 'Name cannot be null or empty.'
      });
      return;
    }

    try {
      // Send the food diary entry to the server via POST request
      const response = await axios.post(
        'http://localhost:8081/fooddiary/add',
        foodDiaryEntry, // The data to send to the backend
        {
          headers: {
            email, // Include the email in the headers
          },
        }
      );

      if (response.status === 200) {
        // Show success message if food item added successfully
        setSnackbar({
          open: true,
          severity: 'success',
          message: 'Food Item added successfully!'
        });
      } else {
        console.error('Failed to add Food Item:', response.data);
        setSnackbar({
          open: true,
          severity: 'error',
          message: 'Failed to add Food Item. Please try again.'
        });
      }
    } catch (error) {
      // Handle any errors from the request
      console.error('Error adding food item:', error.response ? error.response.data : error.message);
      setSnackbar({
        open: true,
        severity: 'error',
        message: `Error: ${error.response ? error.response.data : error.message}`
      });
    }
  };



  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: 'success', // success or error
    message: ''
  });

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
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

  const handleDialogClose = () => {
    setOpenDialog(false); // Close the dialog
  };

  // Function to handle category selection change
  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const [quantity, setQuantity] = useState(1); // Initialize quantity to 1

  // Function to handle the Save button click
  const handleSave = () => {
    if (selectedCategory && foodItem && quantity > 0) {
      // Calculate the nutritional values based on the quantity
      const totalEnergy = foodItem.energy * quantity;
      const totalProtein = foodItem.protein * quantity;
      const totalFat = foodItem.fat * quantity;
      const totalCarbs = foodItem.netCarbs * quantity;

      // Call the method to add food with updated values
      handleAddFood(foodItem, selectedCategory, totalEnergy, totalProtein, totalFat, totalCarbs);
      setOpenDialog(false); // Close the dialog
      setSelectedCategory(''); // Reset the selected category
      setQuantity(1); // Reset the quantity
    }
  };
  // Function to open the pop-up
  const handleAddFoodClick = (item) => {
    setFoodItem(item); // Store the selected food item
    setOpenDialog(true); // Open the pop-up
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
            Add Food
          </Typography>
          {/* Logout Button in the Right Corner */}
          <Box sx={{ marginLeft: 'auto' }}>
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
      {/* main Content */}
      {/* Food Cards */}
      <Box
        sx={{
          width: '100%', // Ensure the parent Box spans the full width
          maxWidth: '100%',
          padding: '16px', // Add padding around the entire content
          margin: '0 auto', // Center content if there's horizontal margin
          backgroundColor: 'white', // Optional background color for testing
        }}
      >
        <Grid
          container
          spacing={4}
          sx={{
            paddingTop: '32px',
            width: '100%', // Ensure the Grid container spans the full width
            margin: 0, // Remove any default margins
            paddingBottom: '32px', // Add space at the bottom for the last card
          }}
        >
          <TextField
            label="Search Food Items"
            variant="outlined"
            value={searchQuery}
            onChange={handleSearch}
            sx={{
              width: '300px',
              marginTop: '40px', // Adds space to the top
              marginLeft: '30px',
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused fieldset': {
                  borderColor: '#00bfff', // Sky blue color on focus
                },
              },
            }}
            InputProps={{
              endAdornment: (
                <IconButton
                  onClick={() => handleButtonClick()}
                  sx={{
                    backgroundColor: buttonClicked ? '#00bfff' : 'transparent', // Sky blue color on click
                    '&:hover': {
                      backgroundColor: '#87CEEB', // Darker blue on hover
                    },
                    borderRadius: '50%', // Makes it round
                  }}
                >
                  <Search sx={{ color: buttonClicked ? 'white' : 'black' }} />
                </IconButton>
              ),
            }}
          />
          {paginatedFoodItems.length > 0 ? (
            paginatedFoodItems.map((item, index) => (
              <Grid item xs={12} key={index}>
                <Card
                  sx={{
                    display: 'flex',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    borderRadius: '8px',
                    width: '100%', // Make Card span the full width of its container
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease', // Hover animation
                    '&:hover': {
                      transform: 'scale(1.01)', // Slight enlargement
                      boxShadow: '0 8px 16px rgba(0, 191, 255, 0.6)', // Sky blue shadow
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    sx={{
                      width: 150,
                      height: '200px',
                      objectFit: 'cover',
                      borderTopLeftRadius: '8px',
                      borderBottomLeftRadius: '8px',
                    }}
                    image={`data:image/jpeg;base64,${item.image}`}
                    alt={item.name}
                  />
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      width: '100%',
                      alignItems: 'stretch', // Stretch children to fill available space
                      backgroundColor: 'white',
                      overflow: 'hidden',
                    }}
                  >
                    <CardContent
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        height: 'auto', // Dynamic height
                        flex: 1, // Stretch content
                      }}
                    >
                      <Typography
                        component="div"
                        variant="h5"
                        sx={{
                          fontWeight: 'bold',
                          color: '#333',
                          marginBottom: 0.5,
                        }}
                      >
                        {item.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          marginBottom: 0.5,
                          wordBreak: 'break-word',
                          whiteSpace: 'normal',
                          color: '#333',
                        }}
                      >
                        <strong>Description:</strong> {item.description}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#333', marginBottom: 0.2 }}>
                        <strong>Energy:</strong> {item.energy} kcal
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#333', marginBottom: 0.2 }}>
                        <strong>Protein:</strong> {item.protein} grams
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#333', marginBottom: 0.2 }}>
                        <strong>Fat:</strong> {item.fat} grams
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#333', marginBottom: 0.2 }}>
                        <strong>Net Carbs:</strong> {item.netCarbs} grams
                      </Typography>
                    </CardContent>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: 1.5,
                      padding: 2,
                    }}
                  >
                    {/* Trigger button */}
                    <Button
                      variant="contained"
                      size="medium"
                      startIcon={<AddIcon />}
                      onClick={() => handleAddFoodClick(item)} // Open dialog when clicked, passing the item
                      sx={{
                        width: '120px',
                        backgroundColor: '#00bfff',
                        color: 'black',
                        borderRadius: '20px',
                        fontWeight: 'bold',
                        fontSize: '14px',
                        '&:hover': { backgroundColor: '#0099cc' },
                      }}
                    >
                      Add
                    </Button>
                    {/* Pop-up dialog */}
                    <Dialog open={openDialog} onClose={handleDialogClose} sx={{ borderRadius: '10px' }}>
                      <DialogTitle sx={{ backgroundColor: '#00bfff', color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
                        Select Category
                      </DialogTitle>
                      <DialogContent sx={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <FormControl fullWidth variant="outlined" sx={{ marginTop: '20px' }}>
                          <InputLabel>Category</InputLabel>
                          <Select
                            value={selectedCategory}
                            onChange={handleCategoryChange}
                            label="Category"
                            sx={{
                              '& .MuiSelect-root': {
                                backgroundColor: '#e6f7ff', // Light blue background for the select
                                borderRadius: '8px',
                              },
                              '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#00bfff', // Sky blue border for the select input
                              },
                              '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#0099cc', // Darker blue when hovered
                              },
                            }}
                          >
                            <MenuItem value="Breakfast">Breakfast</MenuItem>
                            <MenuItem value="Lunch">Lunch</MenuItem>
                            <MenuItem value="Dinner">Dinner</MenuItem>
                            <MenuItem value="Snacks">Snacks</MenuItem>
                          </Select>
                        </FormControl>
                        {/* Quantity input */}
                        <TextField
                          label="Quantity"
                          type="number"
                          value={quantity}
                          onChange={(e) => setQuantity(e.target.value)}
                          sx={{
                            marginTop: '20px',
                            '& .MuiInputBase-root': {
                              backgroundColor: '#e6f7ff',
                              borderRadius: '8px',
                            },
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#00bfff',
                            },
                            width: '100%', // Make the TextField take full width
                            marginBottom: '20px', // Add some spacing below the Quantity field
                          }}
                        />
                      </DialogContent>
                      <DialogActions sx={{ padding: '16px', display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <Button onClick={handleDialogClose} color="secondary" sx={{ fontWeight: 'bold', color: '#00bfff' }}>
                          Cancel
                        </Button>
                        <Button
                          onClick={handleSave} // Trigger save action
                          color="primary"
                          sx={{
                            backgroundColor: '#00bfff',
                            color: 'white',
                            '&:hover': { backgroundColor: '#0099cc' },
                            fontWeight: 'bold',
                            borderRadius: '20px',
                            padding: '10px 20px',
                            width: 'auto', // Let the button maintain its natural width
                          }}
                        >
                          Save
                        </Button>
                      </DialogActions>
                    </Dialog>

                  </Box>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography variant="h6" color="text.secondary">
                No food items available
              </Typography>
            </Grid>
          )}
        </Grid>
        {/* Pagination */}
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          <Pagination
            count={Math.ceil(filteredFoodItems.length / itemsPerPage)} // Calculate the total pages
            page={page}
            onChange={handlePageChange}
            sx={{
              '& .MuiPaginationItem-root': {
                color: '#87CEEB', // Sky blue color
              },
              '& .MuiPaginationItem-root.Mui-selected': {
                backgroundColor: '#87CEEB', // Sky blue background when selected
                color: '#fff', // White text when selected
              },
            }}
            size="large"
          />
        </Box>
        {/* Snackbar for displaying messages */}
        <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
}
