import React, { useEffect, useState } from 'react';
import Navbar from '../components/Adminnav';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  Snackbar,
  Alert,
  DialogTitle,
  IconButton,
  Pagination
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Edit, Delete, Search } from '@mui/icons-material'; // Import icons


const ExerciseDashboard = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [editForm, setEditForm] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [filteredFoodItems, setFilteredFoodItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [buttonClicked, setButtonClicked] = useState(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 3; // Show 3 items per page
  const navigate = useNavigate();

  const handlePageChange = (event, value) => {
    setPage(value); // Change the current page
  };

  const paginatedFoodItems = filteredFoodItems.slice((page - 1) * itemsPerPage, page * itemsPerPage);


  // Fetch food items from the backend on initial load
  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        const response = await axios.get('http://localhost:8080/exercise/all'); // Adjust this URL as per your backend API
        setFoodItems(response.data);
        setFilteredFoodItems(response.data); // Initially set filtered items to all food items
      } catch (error) {
        console.error('Error fetching food items:', error);
      }
    };

    fetchFoodItems();
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('userName');
    navigate('/');
    window.location.reload();
  };

  useEffect(() => {
    const username = sessionStorage.getItem('username');
    const authToken = sessionStorage.getItem('authToken');

    if (!authToken || !username) {
      navigate('/');
    } else {
      console.log('Session validated:', { username, authToken });
    }
  }, [navigate]);

  const handleEdit = (item) => {
    setEditForm(item);
    setOpenEdit(true);
  };

  const handleDelete = (item) => {
    setItemToDelete(item);
    setOpenDelete(true);
  };

  const handleCancelEdit = () => {
    setOpenEdit(false);
    setSuccessMessage('');
    setErrorMessage('');
  };

  const handleSubmitEdit = async () => {
    try {
      const formData = new FormData();

      // Append fields only if they have values
      if (editForm.name) formData.append('name', editForm.name);
      if (editForm.description) formData.append('description', editForm.description);
      if (editForm.energy) formData.append('energy', editForm.energy);
      if (editForm.protein) formData.append('protein', editForm.protein);
      if (editForm.fat) formData.append('fat', editForm.fat);
      if (editForm.netCarbs) formData.append('netCarbs', editForm.netCarbs);

      // Append image if it is selected and valid
      if (editForm.image && editForm.image.size > 0) {
        formData.append('image', editForm.image);
      }
      console.log('Sending PUT request to edit food:', {
        name: editForm.name,
        description: editForm.description,
        energy: editForm.energy,
        protein: editForm.protein,
        fat: editForm.fat,
        netCarbs: editForm.netCarbs,
      });

      // Make API call to update the food item
      await axios.put(
        `http://localhost:8080/exercise/${editForm.id}`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      // Handle success
      setSuccessMessage('Exercise updated successfully!');
      window.location.reload();
      setErrorMessage('');
      setEditForm(null); // Reset the form
      setOpenEdit(false); // Close the edit modal/dialog

      // Fetch updated food items
      const updatedFoodItems = await axios.get('http://localhost:8080/exercise/all');
      setFoodItems(updatedFoodItems.data);
    } catch (error) {
      // Handle errors
      setErrorMessage('Error updating Exercise. Please try again.');
      setSuccessMessage('');
      console.error('Error updating Exercise:', error);

      // Optionally provide more feedback based on error response
      if (error.response && error.response.data) {
        console.error('Backend error response:', error.response.data);
      }
    }
  };

  const handleCancelDelete = () => {
    setOpenDelete(false);
    setItemToDelete(null);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/exercise/${itemToDelete.id}`);
      const updatedFoodItems = foodItems.filter(item => item.name !== itemToDelete.name);
      setFoodItems(updatedFoodItems);
      setOpenDelete(false);
      setItemToDelete(null);
      setSuccessMessage("Item deleted successfully!"); // Set the success message
      window.location.reload();
    } catch (error) {
      console.error("Error deleting Exercise:", error);
    }
  };

  // Handle search input change
  const handleSearch = async (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    try {
      // Fetch food items based on the search query
      const response = await axios.get(`http://localhost:8080/exercise/search?name=${query}`);
      setFilteredFoodItems(response.data); // Update the filtered items based on the search result
    } catch (error) {
      console.error('Error fetching Exercise:', error);
    }
  };

  const handleButtonClick = () => {
    setButtonClicked(true);
    // You can reset this after a short period if you'd like the color to go back to default
    setTimeout(() => setButtonClicked(false), 200);
  };

  return (
    <div>
      <Navbar handleLogout={handleLogout} />
      <main style={{ padding: '2rem' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4 }}>
          <Typography variant="h2">View all Exercises</Typography>
        </Box>
        {/* Success/Error Messages */}
        {successMessage && (
          <Snackbar
            open={true}
            autoHideDuration={3000}
            onClose={() => setSuccessMessage('')}
          >
            <Alert onClose={() => setSuccessMessage('')} severity="success">{successMessage}</Alert>
          </Snackbar>
        )}
        {errorMessage && (
          <Snackbar
            open={true}
            autoHideDuration={3000}
            onClose={() => setErrorMessage('')}
          >
            <Alert onClose={() => setErrorMessage('')} severity="error">{errorMessage}</Alert>
          </Snackbar>
        )}
        {/* Edit Form Dialog */}
        <Dialog open={openEdit} onClose={handleCancelEdit}>
          <DialogTitle>Edit Exercise</DialogTitle>
          <DialogContent>
            <TextField
              label="Name"
              value={editForm?.name || ''}
              fullWidth
              margin="normal"
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              sx={{
                '& .MuiInputBase-input': {
                  color: '#000',
                  '&:focus': { color: '#0099cc' },
                },
                '& .MuiInputLabel-root.Mui-focused': { color: '#0099cc' },
              }}
            />
            <TextField
              label="Energy Required"
              value={editForm?.energy || ''}
              onChange={(e) => setEditForm({ ...editForm, energy: e.target.value })}
              fullWidth
              margin="normal"
              sx={{
                '& .MuiInputBase-input': {
                  color: '#000', // Default text color
                  '&:focus': { color: '#0099cc' }, // Sky-blue color when focused
                },
                '& .MuiInputLabel-root.Mui-focused': { color: '#0099cc' },
              }}
            />
            <TextField
              label="Burns Protein"
              value={editForm?.protein || ''}
              onChange={(e) => setEditForm({ ...editForm, protein: e.target.value })}
              fullWidth
              margin="normal"
              sx={{
                '& .MuiInputBase-input': {
                  color: '#000', // Default text color
                  '&:focus': { color: '#0099cc' }, // Sky-blue color when focused
                },
                '& .MuiInputLabel-root.Mui-focused': { color: '#0099cc' },
              }}
            />
            <TextField
              label="Burns Fat"
              value={editForm?.fat || ''}
              onChange={(e) => setEditForm({ ...editForm, fat: e.target.value })}
              fullWidth
              margin="normal"
              sx={{
                '& .MuiInputBase-input': {
                  color: '#000', // Default text color
                  '&:focus': { color: '#0099cc' }, // Sky-blue color when focused
                },
                '& .MuiInputLabel-root.Mui-focused': { color: '#0099cc' },
              }}
            />
            <TextField
              label="Burns Net Carbs"
              value={editForm?.netCarbs || ''}
              onChange={(e) => setEditForm({ ...editForm, netCarbs: e.target.value })}
              fullWidth
              margin="normal"
              sx={{
                '& .MuiInputBase-input': {
                  color: '#000', // Default text color
                  '&:focus': { color: '#0099cc' }, // Sky-blue color when focused
                },
                '& .MuiInputLabel-root.Mui-focused': { color: '#0099cc' },
              }}
            />
            <TextField
              label="Image Upload"
              type="file"
              fullWidth
              margin="normal"
              onChange={(e) => setEditForm({ ...editForm, image: e.target.files[0] })}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{ accept: 'image/*' }}
              sx={{
                '& .MuiInputBase-input': {
                  color: '#000', // Default text color
                  '&:focus': { color: '#0099cc' }, // Sky-blue color when focused
                },
                '& .MuiInputLabel-root.Mui-focused': { color: '#0099cc' },
              }}
            />
          </DialogContent>
          <DialogActions sx={{ gap: 2 }}>
            <Button
              onClick={handleCancelEdit}
              sx={{
                color: '#00bfff', // Bright blue color for text
                textTransform: 'none', // Disable uppercase transformation
                fontSize: '16px', // Match font size
                fontWeight: 'bold', // Bold text
                background: 'none', // No background
                boxShadow: 'none', // No shadow
                '&:hover': {
                  color: '#0099cc', // Darker blue on hover
                },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitEdit}
              sx={{
                color: '#00bfff', // Bright blue color for text
                textTransform: 'none', // Disable uppercase transformation
                fontSize: '16px', // Match font size
                fontWeight: 'bold', // Bold text
                background: 'none', // No background
                boxShadow: 'none', // No shadow
                '&:hover': {
                  color: '#0099cc', // Darker blue on hover
                },
              }}
            >
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>
        {/* Delete Confirmation Dialog */}
        <Dialog open={openDelete} onClose={handleCancelDelete}>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete the Exercise: {itemToDelete?.name}?
            </Typography>
          </DialogContent>
          <DialogActions sx={{ gap: 2 }}>
            <Button
              onClick={handleCancelDelete}
              sx={{
                color: '#00bfff', // Bright blue color for text
                textTransform: 'none', // Disable uppercase transformation
                fontSize: '16px', // Match font size
                fontWeight: 'bold', // Bold text
                background: 'none', // No background
                boxShadow: 'none', // No shadow
                '&:hover': {
                  color: '#0099cc', // Darker blue on hover
                },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmDelete}
              sx={{
                color: '#00bfff', // Bright blue color for text
                textTransform: 'none', // Disable uppercase transformation
                fontSize: '16px', // Match font size
                fontWeight: 'bold', // Bold text
                background: 'none', // No background
                boxShadow: 'none', // No shadow
                '&:hover': {
                  color: '#0099cc', // Darker blue on hover
                },
              }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
        <TextField
          label="Search Exercise"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearch}
          sx={{
            width: '300px',
            marginTop: '20px', // Adds space to the top
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
        {/* Food Cards */}
        <Box sx={{ mt: 6 }}>
          <Grid container spacing={4} direction="column" sx={{ mt: 6 }}>
            {paginatedFoodItems.length > 0 ? (
              paginatedFoodItems.map((item, index) => (
                <Grid item xs={12} key={index}>
                  <Card
                    sx={{
                      display: 'flex',
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                      borderRadius: '8px',
                      maxWidth: '100%',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease', // Smooth animation for hover effect
                      '&:hover': {
                        transform: 'scale(1.02)', // Slight enlargement
                        boxShadow: '0 8px 16px rgba(0, 191, 255, 0.6)', // Sky blue box shadow
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      sx={{ width: 150, height: '200px', objectFit: 'cover', borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px' }}
                      image={`data:image/jpeg;base64,${item.image}`}
                      alt={item.name}
                    />
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        width: '100%',
                        alignItems: 'stretch', // Ensures children stretch to fill available space
                        backgroundColor: 'white',
                        overflow: 'hidden',
                      }}
                    >
                      <CardContent
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          height: 'auto', // Allows the height to adjust dynamically
                          flex: 1, // Ensures it stretches within the parent container
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
                        <Typography variant="body2" sx={{ color: '#333', marginBottom: 0.2 }}>
                          <strong>Energy Required:</strong> {item.energy} kcal
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#333', marginBottom: 0.2 }}>
                          <strong>Burns Protein:</strong> {item.protein} grams
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#333', marginBottom: 0.2 }}>
                          <strong>Burns Fat:</strong> {item.fat} grams
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#333', marginBottom: 0 }}>
                          <strong>Burns Net Carbs:</strong> {item.netCarbs} grams
                        </Typography>
                      </CardContent>
                    </Box>
                    {/* Right Buttons */}
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
                      <Button
                        variant="contained"
                        size="medium"
                        startIcon={<Edit />}
                        onClick={() => handleEdit(item)}
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
                        Edit
                      </Button>
                      <Button
                        size="medium"
                        variant="contained"
                        startIcon={<Delete />}
                        onClick={() => handleDelete(item)}
                        sx={{
                          width: '120px',
                          backgroundColor: '#ff3b3b',
                          color: 'white',
                          borderRadius: '20px',
                          fontWeight: 'bold',
                          fontSize: '14px',
                          '&:hover': { backgroundColor: '#cc3232' },
                        }}
                      >
                        Delete
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Typography variant="h6" color="text.secondary">No Exercise available</Typography>
              </Grid>
            )}
          </Grid>
        </Box>
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

      </main>
    </div>
  );
};

export default ExerciseDashboard;
