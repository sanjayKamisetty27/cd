import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

export default function ButtonAppBar() {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        sx={{ 
          backgroundColor: '#ffffff', // Set background color to white
          color: '#333333', // Dark text color for contrast
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
          height: '64px', // Fixed height for consistent layout
          transition: 'background-color 0.3s ease', // Smooth transition for background
          width: '100%' ,
        }}
      >
        <Toolbar>
          {/* Logo and home link */}
          <Box 
            sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, cursor: 'pointer' }} 
            onClick={() => window.location.href = '/'}
          >
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                color: '#00bfff', // Sky blue color
                fontWeight: 'bold', 
                fontSize: '1.5rem',
                marginRight: '8px' // Margin for spacing
              }} 
            >
              Protien Pro
            </Typography>
          </Box>

          {/* About Us link (styled like Sign In button) */}
          <Button
            sx={{
              color: '#ffffff', // Text color white to match Sign In button
              backgroundColor: '#00bfff', // Sky blue color
              '&:hover': {
                backgroundColor: '#0095e8', // Darker blue on hover
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Add shadow on hover
              },
              marginRight: 2, // Add margin between About Us and Sign In
              textTransform: 'none', // Prevent capitalization of button text
              fontSize: '1rem',
              padding: '10px 20px', // Increased padding for a better button size
              borderRadius: '20px', // Rounded corners
              transition: 'background-color 0.3s ease, box-shadow 0.3s ease', // Smooth transition
            }}
            onClick={() => window.location.href = '/about'}
          >
            About Us
          </Button>

          {/* Sign In Button with Dropdown */}
          <Button
            sx={{ 
              color: '#ffffff', // Text color white
              backgroundColor: '#00bfff', // Sky blue color
              '&:hover': {
                backgroundColor: '#0095e8', // Darker blue on hover
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Add shadow on hover
              },
              display: 'flex', 
              alignItems: 'center',
              padding: '10px 20px', // Increased padding for a better button size
              borderRadius: '20px', // Rounded corners
              transition: 'background-color 0.3s ease, box-shadow 0.3s ease', // Smooth transition
              textTransform: 'none', // Prevent capitalization of button text
              fontSize: '1rem',
            }}
            onClick={handleMenuClick}
          >
            Sign In
            <ArrowDropDownIcon sx={{ ml: 0.5 }} /> {/* Arrow icon next to Sign In */}
          </Button>
          
          {/* Dropdown Menu aligned to the right of the button */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            disableScrollLock={true} // Prevent scroll lock
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right', // Aligns the dropdown to the right side of the button
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right', // Ensures the menu aligns with the right side
            }}
            sx={{
              mt: 1, // Margin top to space from the button
              '& .MuiMenuItem-root': {
                transition: 'background-color 0.3s ease', // Smooth transition
                '&:hover': {
                  backgroundColor: '#f0f0f0', // Light gray on hover
                },
              },
            }}
          >
            <MenuItem onClick={() => { window.location.href = '/signin'; handleClose(); }}>
              User Sign In
            </MenuItem>
            <MenuItem onClick={() => { window.location.href = '/admin-signin'; handleClose(); }}>
              Admin Sign In
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
