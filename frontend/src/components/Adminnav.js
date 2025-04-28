import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AddIcon from '@mui/icons-material/Add';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import PeopleIcon from '@mui/icons-material/People'; // Icon for View All Users
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import SportsMartialArtsIcon from '@mui/icons-material/SportsMartialArts';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import AssistantIcon from '@mui/icons-material/Assistant';
import { useNavigate } from 'react-router-dom';

export default function ButtonAppBar({ handleLogout }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const navigate = useNavigate();

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAddRecomClick = () => {
    setAnchorEl(null);
    navigate('/AdminRecom');
  };

  const handleViewRecomClick = () => {
    setAnchorEl(null);
    navigate('/AdminViewRecom');
  };

  const handleFoodClick = () => {
    setAnchorEl(null);
    navigate('/admin-addfood');
  };

  const handleExerciseClick = () => {
    setAnchorEl(null);
    navigate('/admin-exercise');
  };

  const handleViewExercisesClick = () => {
    setAnchorEl(null);
    navigate('/admin-viewexercise');
  };

  const handleViewUsersClick = () => {
    setAnchorEl(null);
    navigate('/admin-viewusers');
    window.location.reload();
  };

  const handleLogoutClick = () => {
    setAnchorEl(null);
    handleLogout();
  };

  return (
    <Box sx={{ width: '100%', overflowX: 'hidden' }}>
      <AppBar
        position="static"
        sx={{
          backgroundColor: '#ffffff',
          color: '#333333',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)',
          width: '100%',
          maxWidth: '100vw',
          margin: '0 auto',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box
            sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
            onClick={() => navigate('/admin-dashboard')}
          >
            <Typography
              variant="h6"
              component="div"
              sx={{
                color: '#00bfff',
                fontWeight: 'bold',
                fontSize: '1.5rem',
              }}
            >
              Protein Pro
            </Typography>
          </Box>

          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleMenuClick}
            sx={{
              marginRight: 2,
              color: '#00bfff',
            }}
          >
            <MenuIcon />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            disableScrollLock={true}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            sx={{
              mt: 1,
              '& .MuiMenuItem-root': {
                transition: 'background-color 0.3s ease',
                '&:hover': {
                  backgroundColor: '#f0f0f0',
                  borderRadius: '8px',
                },
              },
            }}
          >
            <MenuItem onClick={handleAddRecomClick} sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ mr: 2 }}>Add Recom</Typography>
              <Box
                sx={{
                  ml: 'auto',
                  backgroundColor: '#00bfff',
                  borderRadius: '50%',
                  width: '30px',
                  height: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <TipsAndUpdatesIcon sx={{ color: '#ffffff', fontSize: '20px' }} />
              </Box>
            </MenuItem>

            <MenuItem onClick={handleViewRecomClick} sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ mr: 2 }}>View Recomm</Typography>
              <Box
                sx={{
                  ml: 'auto',
                  backgroundColor: '#00bfff',
                  borderRadius: '50%',
                  width: '30px',
                  height: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <AssistantIcon sx={{ color: '#ffffff', fontSize: '20px' }} />
              </Box>
            </MenuItem>

            <MenuItem onClick={handleFoodClick} sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ mr: 2 }}>Add Food</Typography>
              <Box
                sx={{
                  ml: 'auto',
                  backgroundColor: '#00bfff',
                  borderRadius: '50%',
                  width: '30px',
                  height: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <AddIcon sx={{ color: '#ffffff', fontSize: '20px' }} />
              </Box>
            </MenuItem>

            <MenuItem onClick={handleExerciseClick} sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ mr: 2 }}>Add Exercise</Typography>
              <Box
                sx={{
                  ml: 'auto',
                  backgroundColor: '#00bfff',
                  borderRadius: '50%',
                  width: '30px',
                  height: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <FitnessCenterIcon sx={{ color: '#ffffff', fontSize: '20px' }} />
              </Box>
            </MenuItem>

            <MenuItem onClick={handleViewExercisesClick} sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ mr: 2 }}>View Exercises</Typography>
              <Box
                sx={{
                  ml: 'auto',
                  backgroundColor: '#00bfff',
                  borderRadius: '50%',
                  width: '30px',
                  height: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <SportsMartialArtsIcon sx={{ color: '#ffffff', fontSize: '20px' }} />
              </Box>
            </MenuItem>

            <MenuItem onClick={handleViewUsersClick} sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ mr: 2 }}>View All Users</Typography>
              <Box
                sx={{
                  ml: 'auto',
                  backgroundColor: '#00bfff',
                  borderRadius: '50%',
                  width: '30px',
                  height: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <PeopleIcon sx={{ color: '#ffffff', fontSize: '20px' }} />
              </Box>
            </MenuItem>

            <MenuItem onClick={handleLogoutClick} sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ mr: 2 }}>Logout</Typography>
              <Box
                sx={{
                  ml: 'auto',
                  backgroundColor: '#ff4d4d',
                  borderRadius: '50%',
                  width: '30px',
                  height: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ExitToAppIcon sx={{ color: '#ffffff', fontSize: '20px' }} />
              </Box>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
