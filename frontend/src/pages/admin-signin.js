import React, { useState} from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import CardMedia from '@mui/material/CardMedia';
import img from '../images/bowl.png';
import Snackbar from '@mui/material/Snackbar'; // For showing success/error messages
import Alert from '@mui/material/Alert'; // For success/error alerts
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

// Updated color theme to sky blue
const skyBlueTheme = createTheme({
  palette: {
    primary: {
      main: '#00bfff', // Sky Blue
    },
    secondary: {
      main: '#00bfff', // Sky Blue
    },
    text: {
      primary: '#000',
    },
    background: {
      default: '#fff',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          color: '#fff',
          backgroundColor: '#00bfff', // Sky Blue
          '&:hover': {
            backgroundColor: '#0095e8', // Darker Blue on hover
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-root': {
            color: '#000',
          },
          '& .MuiInputLabel-root': {
            color: '#000',
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#000',
            },
            '&:hover fieldset': {
              borderColor: '#000',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#000',
            },
          },
        },
      },
    },
  },
});

export default function AdminSignIn() {
  const [formData, setFormData] = React.useState({ username: '', password: '' });
  const [errors, setErrors] = React.useState({});
  const [snackbar, setSnackbar] = React.useState({ open: false, message: '', severity: '' });
  const navigate = useNavigate(); // Initialize navigate
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ open: false, message: '', severity: '' });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.username) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } 
    return newErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSnackbar({ open: true, message: 'Please fix the errors', severity: 'error' });
      return;
    }

    try {
      const response = await fetch('http://localhost:8081/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const result = await response.json();

      if (response.ok) {
        // Create a session with admin data
        sessionStorage.setItem('authToken', result.token); // Assuming the backend sends a token on successful login
        sessionStorage.setItem('username', formData.username); // Store the username in session storage
        sessionStorage.setItem('admin', JSON.stringify(result.admin)); // Store admin data if returned
        
        setSnackbar({ open: true, message: 'Login successful', severity: 'success' });
        
        // Navigate to dashboard
        navigate('/admin-dashboard');
      } else {
        setSnackbar({ open: true, message: result.message, severity: 'error' });
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Error logging in, please try again later.', severity: 'error' });
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  React.useEffect(() => {
    // Apply overflow-x: hidden to the body when the component mounts
    document.body.style.overflowX = 'hidden';
    
    // Cleanup the style when the component unmounts
    return () => {
      document.body.style.overflowX = 'auto';
    };
  }, []);

  return (
    <ThemeProvider theme={skyBlueTheme}>
      <div style={{ overflowX: 'hidden', width: '100vw' }}> {/* Apply full width */}
        <Navbar />

        {/* Circles on the left bottom corner */}
        <div style={{ position: 'absolute', bottom: '0', left: '0', zIndex: '-1', top: '-50px' }}>
          <div style={{
            width: '300px',
            height: '300px',
            backgroundColor: 'skyblue',
            borderRadius: '50%',
            position: 'absolute',
            left: '-150px',
            bottom: '50px',
            zIndex: '-1',
          }} />
          <div style={{
            width: '400px',
            height: '400px',
            backgroundColor: 'skyblue',
            borderRadius: '50%',
            position: 'absolute',
            left: '-200px',
            top: '100px',
            bottom: '250px',
            zIndex: '-1',
          }} />
        </div>

        {/* Circles on the right bottom corner */}
        <div style={{ position: 'absolute', bottom: '0', right: '0', zIndex: '-1', top: '0' }}>
          <div style={{
            width: '300px',
            height: '300px',
            backgroundColor: 'skyblue',
            right: '-150px',
            borderRadius: '50%',
            position: 'absolute',
            bottom: '50px',
            zIndex: '-1',
            clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)', // Cuts right half
          }} />
          <div style={{
            width: '400px',
            height: '400px',
            backgroundColor: 'skyblue',
            borderRadius: '50%',
            position: 'absolute',
            bottom: '250px',
            right: '-200px',
            top: '60px',
            zIndex: '-1',
            clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)', // Cuts right half
          }} />
        </div>

        <div style={{ minHeight: 'calc(100vh - 100px)', paddingBottom: '10px', marginTop: '100px' }}>
          <Container component="main" maxWidth="md">
            <CssBaseline />
            <Card 
              sx={{ 
                display: 'flex',
                boxShadow: 3, 
                borderRadius: 2, 
                transition: 'transform 0.3s, box-shadow 0.3s',
                marginLeft:'40px',
                height: '500px',  // Increased height
                maxWidth: '1000px', // Set a maximum width for larger screens
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: '0px 0px 20px 5px rgba(0, 191, 255, 0.5)',
                }
              }}
            >
              {/* Left part of the card for the image */}
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <CardMedia
                    component="img"
                    image={img}
                    alt="Sign In Image"
                    sx={{ objectFit: 'cover', height: '100%' }}
                  />
                </Grid>

                {/* Right part of the card for the form */}
                <Grid item xs={12} sm={6}>
                  <CardContent>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        marginTop: 13,
                      }}
                    >
                      <Typography component="h1" variant="h5" color="primary">
                        Admin Sign In
                      </Typography>
                      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                          margin="normal"
                          required
                          fullWidth
                          id="username"
                          label="Username"
                          name="username"
                          autoComplete="username"
                          autoFocus
                          value={formData.username}
                          onChange={handleChange}
                          error={!!errors.username}
                          helperText={errors.username}
                        />
                        <TextField
                          fullWidth
                          label="Password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={handleChange}
                          required
                          margin="normal"
                          error={!!errors.password}
                          helperText={errors.password}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={handleClickShowPassword}
                                  edge="end"
                                >
                                  {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                        <Button
                          type="submit"
                          fullWidth
                          variant="contained"
                          sx={{ mt: 3, mb: 2 }}
                        >
                          Sign In
                        </Button>
                      </Box>
                    </Box>
                  </CardContent>
                </Grid>
              </Grid>
            </Card>
          </Container>
        </div>
        <Footer />
      </div>

      {/* Snackbar for success and error messages */}
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}
