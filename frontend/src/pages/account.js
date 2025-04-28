import React, { useEffect, useState, useRef } from 'react';
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
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { Avatar, Snackbar } from '@mui/material';
import { MenuItem } from '@mui/material';
import Alert from '@mui/material/Alert';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LocalDiningIcon from '@mui/icons-material/LocalDining'; // Icon for Food Stats
import SportsMartialArtsIcon from '@mui/icons-material/SportsMartialArts';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
// import { Password } from '@mui/icons-material';


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


export default function Account() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [openStats, setOpenStats] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState({
    name: '',
    gender: '',
    birthDate: '',
    heightFeet: '',
    heightInches: '',
    weight: '',
    phoneNumber: '',
    address: '',
    bio: '',
    Password: '',
    profileImage: null,
  });
  const [imagePreview, setImagePreview] = useState(null);

  const handleCloseSnackbar = () => {
    setSnackbar({ open: false, message: '', severity: '' });
  };

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  useEffect(() => {
    const email = sessionStorage.getItem('email');
    const authToken = sessionStorage.getItem('authToken');

    if (!authToken || !email) {
      navigate('/'); // Redirect to login if no token or email
    } else {
      axios
        .get(`http://localhost:8081/users?email=${email}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        })
        .then((response) => {
          if (response.data.user) {
            setUser(response.data.user);
            if (response.data.user.profileImage) {
              setImagePreview(`data:image/jpeg;base64,${response.data.user.profileImage}`);
            }
          }
        })
        .catch((error) => {
          console.error('Error fetching user details:', error);
          setSnackbar({ open: true, message: 'Failed to fetch user details. Please try again.', severity: 'error' });
        });
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const fileInputRef = useRef(null);

  const handleUploadClick = () => {
    fileInputRef.current.click(); // Trigger file input click
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();

      // Preview the image
      reader.onload = () => {
        setImagePreview(reader.result);
      };

      reader.readAsDataURL(file); // For preview

      // Store the file as a blob in the user object
      setUser({ ...user, profileImage: file });
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
  
    // Check if passwords match
    if (user.newPassword !== user.confirmPassword) {
      setSnackbar({ open: true, message: 'Passwords do not match!', severity: 'error' });
      return;
    }
  
    // Check if the new password is at least 8 characters
    if (user.newPassword && user.newPassword.length < 8) {
      setSnackbar({ open: true, message: 'New password must be at least 8 characters long!', severity: 'error' });
      return;
    }
  
    // First, check if the current password is valid
    const email = sessionStorage.getItem('email');
    if (user.Password) {
      axios
        .post(`http://localhost:8081/verify-password`, { email, password: user.Password }) // Assume a backend endpoint to verify password
        .then((response) => {
          // If current password is correct, proceed with the update
          const formData = new FormData();
  
          // Append user details
          formData.append('name', user.name);
          formData.append('gender', user.gender);
          formData.append('birthDate', user.birthDate);
          formData.append('heightFeet', user.heightFeet);
          formData.append('heightInches', user.heightInches);
          formData.append('weight', user.weight);
          formData.append('phoneNumber', user.phoneNumber);
          formData.append('address', user.address);
          formData.append('bio', user.bio);
  
          // Append new password if provided
          if (user.newPassword) formData.append('newPassword', user.newPassword);
  
          // Append profile image if provided
          if (user.profileImage) {
            formData.append('profileImage', user.profileImage);
          }
  
          // Send request to update user data
          axios
            .put(`http://localhost:8081/edit/${email}`, formData, {
              headers: { 'Content-Type': 'multipart/form-data' },
            })
            .then((response) => {
              setSnackbar({ open: true, message: 'User details updated successfully!', severity: 'success' });
              setUser(response.data);  // Update user state with the response
            })
            .catch((error) => {
              console.error('Error updating user details:', error);
              setSnackbar({ open: true, message: 'Failed to update user details.', severity: 'error' });
            });
        })
        .catch((error) => {
          // If password is incorrect
          setSnackbar({ open: true, message: 'Invalid current password', severity: 'error' });
        });
    } else {
      // If no current password is provided, proceed with the update
      const formData = new FormData();
  
      // Append user details
      formData.append('name', user.name);
      formData.append('gender', user.gender);
      formData.append('birthDate', user.birthDate);
      formData.append('heightFeet', user.heightFeet);
      formData.append('heightInches', user.heightInches);
      formData.append('weight', user.weight);
      formData.append('phoneNumber', user.phoneNumber);
      formData.append('address', user.address);
      formData.append('bio', user.bio);
  
      // Append new password if provided
      if (user.newPassword) formData.append('newPassword', user.newPassword);
  
      // Append profile image if provided
      if (user.profileImage) {
        formData.append('profileImage', user.profileImage);
      }
  
      // Send request to update user data
      axios
        .put(`http://localhost:8081/edit/${email}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        .then((response) => {
          setSnackbar({ open: true, message: 'User details updated successfully!', severity: 'success' });
          setUser(response.data);  // Update user state with the response
        })
        .catch((error) => {
          console.error('Error updating user details:', error);
          setSnackbar({ open: true, message: 'Failed to update user details.', severity: 'error' });
        });
    }
  };
  



  const handleCancel = () => {
    window.location.reload(); // Reload the page to reset the form
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
            Account
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

      {/* main content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Typography variant="h5" component="div" gutterBottom>
          Edit Profile
        </Typography>
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          {/* Profile Image */}
          <Grid container spacing={2} sx={{ justifyContent: 'left', alignItems: 'center', marginBottom: '20px' }}>

            <Grid item>
              <label htmlFor="profileImage">
                <Avatar
                  sx={{
                    width: 100,
                    height: 100,
                    bgcolor: 'skyblue',
                    cursor: 'pointer',
                    border: '2px solid #fff',
                  }}
                  src={imagePreview}
                  alt="Profile Image"
                />
              </label>
              <input
                id="profileImage"
                type="file"
                ref={fileInputRef} // Attach the ref here
                onChange={handleImageUpload}
                style={{ display: 'none' }} // Hide the default file input
              />
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                component="span"
                sx={{ bgcolor: 'skyblue', color: '#fff', '&:hover': { bgcolor: '#76c7f4' } }}
                onClick={handleUploadClick} // Trigger the file input click on button click
              >
                Upload Image
              </Button>
            </Grid>
          </Grid>

          {/* User Info Fields */}
          <Grid container spacing={2} sx={{ width: '100%' }}>

            <Grid item xs={12} md={6}>
              <Typography variant="body1" sx={{ marginBottom: 1 }}>
                Name
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                name="name"
                value={user.name}
                onChange={handleInputChange}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: 'skyblue', // Border color becomes sky blue on focus
                    },
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="body1" sx={{ marginBottom: 1 }}>Gender</Typography>
              <TextField
                fullWidth
                variant="outlined"
                select
                name="gender"
                value={user.gender}
                onChange={handleInputChange}
                SelectProps={{
                  MenuProps: {
                    disableScrollLock: true,  // Prevents scroll lock on the body
                    anchorOrigin: {
                      vertical: "bottom",
                      horizontal: "left",
                    },
                    transformOrigin: {
                      vertical: "top",
                      horizontal: "left",
                    },
                    PaperProps: {
                      style: {
                        maxHeight: 48 * 4.5 + 8,  // Set max height for dropdown
                        alignContent: 'right',
                        overflowX: 'hidden',
                        zIndex: 1300,  // Adjust z-index to ensure it's above card but below other overlays
                      },
                    },
                    getContentAnchorEl: null,  // Prevents centering the menu with TextField
                  },
                  disablePortal: true,  // Keeps the dropdown within the form's flow instead of attaching to body
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: 'skyblue', // Border color becomes sky blue on focus
                    },
                  },
                }}
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="preferNotToSay">Prefer Not to Say</MenuItem>
              </TextField>
            </Grid>


            <Grid item xs={12} md={6}>
              <Typography variant="body1" sx={{ marginBottom: 1 }}>Birth Date</Typography>
              <TextField
                fullWidth
                type="date"
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                name="birthDate"
                value={user.birthDate}
                onChange={handleInputChange}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: 'skyblue', // Border color becomes sky blue on focus
                    },
                  },
                }}
                inputProps={{
                  max: new Date().toISOString().split('T')[0], // Sets max date to today
                  min: '1900-01-01', // Optional: restricts the minimum date (you can adjust this based on your needs)
                }}
              />
            </Grid>


            <Grid item xs={12} md={6}>
              <Typography variant="body1" sx={{ marginBottom: 1 }}>Height (Feet)</Typography>
              <TextField
                fullWidth
                type="number"
                variant="outlined"
                name="heightFeet"
                value={user.heightFeet}
                onChange={handleInputChange}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: 'skyblue', // Border color becomes sky blue on focus
                    },
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="body1" sx={{ marginBottom: 1 }}>Height (Inches)</Typography>
              <TextField
                fullWidth
                type="number"
                variant="outlined"
                name="heightInches"
                value={user.heightInches}
                onChange={handleInputChange}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: 'skyblue', // Border color becomes sky blue on focus
                    },
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="body1" sx={{ marginBottom: 1 }}>Weight</Typography>
              <TextField
                fullWidth
                type="number"
                variant="outlined"
                name="weight"
                value={user.weight}
                onChange={handleInputChange}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: 'skyblue', // Border color becomes sky blue on focus
                    },
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="body1" sx={{ marginBottom: 1 }}>Phone Number</Typography>
              <TextField
                fullWidth
                type="tel"
                variant="outlined"
                name="phoneNumber"
                value={user.phoneNumber}
                onChange={handleInputChange}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: 'skyblue', // Border color becomes sky blue on focus
                    },
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="body1" sx={{ marginBottom: 1 }}>Address</Typography>
              <TextField
                fullWidth
                variant="outlined"
                name="address"
                value={user.address}
                onChange={handleInputChange}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: 'skyblue', // Border color becomes sky blue on focus
                    },
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="body1" sx={{ marginBottom: 1 }}>Current Password</Typography>
              <TextField
                fullWidth
                type="password"
                variant="outlined"
                name="Password"
                value={user.Password || ''}
                onChange={handleInputChange}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: 'skyblue', // Border color becomes sky blue on focus
                    },
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="body1" sx={{ marginBottom: 1 }}>New Password</Typography>
              <TextField
                fullWidth
                type="password"
                variant="outlined"
                name="newPassword"
                value={user.newPassword || ''}
                onChange={handleInputChange}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: 'skyblue', // Border color becomes sky blue on focus
                    },
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="body1" sx={{ marginBottom: 1 }}>Re-enter New Password</Typography>
              <TextField
                fullWidth
                type="password"
                variant="outlined"
                name="confirmPassword"
                value={user.confirmPassword || ''}
                onChange={handleInputChange}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: 'skyblue', // Border color becomes sky blue on focus
                    },
                  },
                }}
              />
            </Grid>







            <Grid item xs={12}>
              <Typography variant="body1" sx={{ marginBottom: 1 }}>Bio</Typography>
              <TextField
                fullWidth
                variant="outlined"
                multiline
                rows={4}
                name="bio"
                value={user.bio}
                onChange={handleInputChange}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: 'skyblue', // Border color becomes sky blue on focus
                    },
                  },
                }}
              />
            </Grid>
          </Grid>

          {/* Save/Cancel Buttons */}
          <Grid
            item
            xs={12}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '20px',
              gap: '10px', // Adds space between buttons
            }}
          >
            <Button
              variant="contained"
              color="primary"
              type="submit"
              sx={{
                borderRadius: '30px', // Makes the button corners rounded
                backgroundColor: 'skyblue', // Sky blue background color
                color: '#fff', // Text color
              }}
            >
              Save
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleCancel}
              sx={{
                borderRadius: '30px', // Makes the button corners rounded
                borderColor: 'skyblue', // Sky blue border color
                color: 'skyblue', // Sky blue text color
                '&:hover': {
                  borderColor: '#00bcd4', // Sky blue hover effect for border
                  color: '#00bcd4', // Change text color on hover
                },
              }}
            >
              Cancel
            </Button>
          </Grid>
        </form>
        {/* Snackbar for notifications */}
        <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
}