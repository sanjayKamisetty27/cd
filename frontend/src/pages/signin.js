import * as React from 'react';
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
import img from '../images/heart.png';
import Link from '@mui/material/Link';
import Snackbar from '@mui/material/Snackbar'; // For showing success/error messages
import Alert from '@mui/material/Alert'; // For success/error alerts
import { useNavigate } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';

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

export default function SignIn() {
  const [formData, setFormData] = React.useState({ email: '', password: '', enteredCaptcha: '' });
  const [errors, setErrors] = React.useState({});
  const [snackbar, setSnackbar] = React.useState({ open: false, message: '', severity: '' });
  const [showPassword, setShowPassword] = React.useState(false);
  const [captcha, setCaptcha] = React.useState('');
  const navigate = useNavigate();

  const handleCloseSnackbar = () => setSnackbar({ open: false, message: '', severity: '' });

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  // Fetch Captcha from Backend
  const generateCaptcha = async () => {
    try {
      const response = await fetch('http://localhost:8080/captcha/generate');
      const data = await response.json();
      setCaptcha(data.captcha);
      
    } catch (error) {
      setSnackbar({ open: true, message: 'Error generating captcha', severity: 'error' });
    }
  };

  // Initialize Captcha on Component Mount
  React.useEffect(() => {
    generateCaptcha();
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    if (!formData.enteredCaptcha) {
      newErrors.captcha = 'Enter the captcha';
    } else if (formData.enteredCaptcha !== captcha) {
      newErrors.captcha = 'Captcha is incorrect';
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
      const response = await fetch('http://localhost:8080/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });
      const result = await response.json();

      if (response.ok) {
        sessionStorage.setItem('authToken', result.token);
        sessionStorage.setItem('email', formData.email);
        navigate('/Dashboard');
        window.location.reload();
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
    document.body.style.overflowX = 'hidden';
    return () => {
      document.body.style.overflowX = 'auto';
    };
  }, []);

  return (
    <ThemeProvider theme={skyBlueTheme}>
      <div style={{ overflowX: 'hidden', width: '100vw' }}>
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
            clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)',
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
            clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)',
          }} />
        </div>

        <div style={{ minHeight: 'calc(100vh - 100px)', paddingBottom: '10px', marginTop: '100px' }}>
          <Container component="main" maxWidth="lg">
            <CssBaseline />
            <Card
              sx={{
                boxShadow: 3,
                borderRadius: 2,
                display: 'flex',
                height: '570px',
                maxWidth: '900px',
                transition: 'transform 0.3s, box-shadow 0.3s',
                marginLeft: '140px',
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: '0px 0px 20px 5px rgba(0, 191, 255, 0.5)',
                }
              }}
            >
              <Grid container>
                <Grid item xs={6} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 3 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <Typography component="h1" variant="h5" color="primary">
                        Sign In
                      </Typography>
                      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                          margin="normal"
                          required
                          fullWidth
                          id="email"
                          label="Email Address"
                          name="email"
                          autoComplete="email"
                          autoFocus
                          value={formData.email}
                          onChange={handleChange}
                          error={!!errors.email}
                          helperText={errors.email}
                          sx={{ backgroundColor: 'white', borderRadius: '10px' }}
                        />
                        <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        value={formData.password}
                        onChange={handleChange}
                        error={!!errors.password}
                        helperText={errors.password}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={togglePasswordVisibility}
                                edge="end"
                              >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                        <Box display="flex" flexDirection="column" alignItems="center" mt={2} sx={{ width: '100%' }}>
                          <Box display="flex" alignItems="center" sx={{ width: '100%' }}>
                            <Typography 
                              sx={{
                                display: 'inline-block',
                                padding: '10px',
                                backgroundColor: '#e0f7ff', // Light sky blue background
                                color: '#007acc', // Darker sky blue text
                                fontWeight: 'bold',
                                borderRadius: '5px',
                                border: '1px solid #007acc',
                                fontSize: '18px',
                                letterSpacing: '2px',
                                marginRight: '10px', // Spacing between captcha and button
                                textAlign: 'center',
                                flex: '1', // Allow captcha to take up available space
                              }}
                            >
                              {captcha}
                            </Typography>
                            <Button
                              onClick={generateCaptcha}
                              variant="contained"
                              sx={{
                                backgroundColor: '#00bfff',
                                color: '#fff',
                                '&:hover': {
                                  backgroundColor: '#007acc',
                                },
                              }}
                            >
                              Refresh Captcha
                            </Button>
                          </Box>
                          <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="enteredCaptcha"
                            label="Enter Captcha"
                            value={formData.enteredCaptcha}
                            onChange={handleChange}
                            error={!!errors.captcha}
                            helperText={errors.captcha}
                            sx={{
                              backgroundColor: 'white',
                              borderRadius: '10px',
                              mt: 2, // Add spacing above the TextField
                            }}
                          />
                        </Box>
                        <Button
                          type="submit"
                          fullWidth
                          variant="contained"
                          sx={{ mt: 3, mb: 2 }}
                        >
                          Sign In
                        </Button>
                        <Grid container>
                          {/* <Grid item xs>
                            <Link href="#" variant="body2">
                              Forgot password?
                            </Link>
                          </Grid> */}
                          <Grid item>
                            <Link href="/signup" variant="body2">
                              {"Don't have an account? Sign Up"}
                            </Link>
                          </Grid>
                        </Grid>
                      </Box>
                    </Box>
                  </CardContent>
                </Grid>
                <Grid item xs={6}>
                  <CardMedia
                    component="img"
                    alt="sign-in"
                    height="100%"
                    image={img}
                  />
                </Grid>
              </Grid>
            </Card>
          </Container>
        </div>

        <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
            {snackbar.message}
          </Alert>
        </Snackbar>

        <Footer />
      </div>
    </ThemeProvider>
  );
}
