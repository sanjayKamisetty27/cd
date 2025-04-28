import React, { useEffect, useState } from 'react';
import Navbar from '../components/Adminnav';
import FilterListIcon from '@mui/icons-material/FilterList';

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
    MenuItem,
    Menu
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Edit, Delete, } from '@mui/icons-material'; // Import icons


const AdminViewRecom = () => {
    const [foodItems, setFoodItems] = useState([]);
    const [editForm, setEditForm] = useState(null);
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [filteredFoodItems, setFilteredFoodItems] = useState([]);
    const navigate = useNavigate();






    // Fetch food items based on the selected nutritional level
    const fetchFoodItems = async (nutritionalLevel = null) => {
        try {
            const url = nutritionalLevel
                ? `http://localhost:8080/recommendation/all?nutritionalLevel=${nutritionalLevel}`
                : `http://localhost:8080/recommendation/all`;
            const response = await axios.get(url);
            setFoodItems(response.data);
            setFilteredFoodItems(response.data); // Update filtered items
        } catch (error) {
            console.error('Error fetching food items:', error);
        }
    };

    // Call fetchFoodItems on initial load
    useEffect(() => {
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
                `http://localhost:8080/recommendation/${editForm.id}`,
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
            const updatedFoodItems = await axios.get('http://localhost:8080/recommendation/all');
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
            await axios.delete(`http://localhost:8080/recommendation/${itemToDelete.id}`);
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





    // Toggle menu display
    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleMenuSelect = (nutrition) => {
        setSelectedNutrition(nutrition); // Update the selected nutritional level
        fetchFoodItems(nutrition); // Fetch filtered food items
        handleMenuClose(); // Close the menu
    };

    const [selectedNutrition, setSelectedNutrition] = useState(null);



    const [anchorEl, setAnchorEl] = useState(null);
    return (
        <div>
            <Navbar handleLogout={handleLogout} />
            <main style={{ padding: '2rem' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4 }}>
                    <Typography variant="h2">View all Recommendation</Typography>
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
                    <DialogTitle>Edit Food Recommendation</DialogTitle>
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
                            label="Energy"
                            value={editForm?.energy || ''}
                            onChange={(e) => setEditForm({ ...editForm, energy: e.target.value })}
                            fullWidth
                            margin="normal"
                            sx={{
                                '& .MuiInputBase-input': {
                                    color: '#000',
                                    '&:focus': { color: '#0099cc' },
                                },
                                '& .MuiInputLabel-root.Mui-focused': { color: '#0099cc' },
                            }}
                        />
                        <TextField
                            label="Protein"
                            value={editForm?.protein || ''}
                            onChange={(e) => setEditForm({ ...editForm, protein: e.target.value })}
                            fullWidth
                            margin="normal"
                            sx={{
                                '& .MuiInputBase-input': {
                                    color: '#000',
                                    '&:focus': { color: '#0099cc' },
                                },
                                '& .MuiInputLabel-root.Mui-focused': { color: '#0099cc' },
                            }}
                        />
                        <TextField
                            label="Fat"
                            value={editForm?.fat || ''}
                            onChange={(e) => setEditForm({ ...editForm, fat: e.target.value })}
                            fullWidth
                            margin="normal"
                            sx={{
                                '& .MuiInputBase-input': {
                                    color: '#000',
                                    '&:focus': { color: '#0099cc' },
                                },
                                '& .MuiInputLabel-root.Mui-focused': { color: '#0099cc' },
                            }}
                        />
                        <TextField
                            label="Net Carbs"
                            value={editForm?.netCarbs || ''}
                            onChange={(e) => setEditForm({ ...editForm, netCarbs: e.target.value })}
                            fullWidth
                            margin="normal"
                            sx={{
                                '& .MuiInputBase-input': {
                                    color: '#000',
                                    '&:focus': { color: '#0099cc' },
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
                                    color: '#000',
                                    '&:focus': { color: '#0099cc' },
                                },
                                '& .MuiInputLabel-root.Mui-focused': { color: '#0099cc' },
                            }}
                        />

                        {/* Nutrition Level Dropdown */}
                        <TextField
                            select
                            label="Nutrition Level"
                            value={editForm?.nutritionLevel || ''}
                            onChange={(e) => setEditForm({ ...editForm, nutritionLevel: e.target.value })}
                            fullWidth
                            margin="normal"
                            sx={{
                                '& .MuiInputBase-input': {
                                    color: '#000',
                                    '&:focus': { color: '#0099cc' },
                                },
                                '& .MuiInputLabel-root.Mui-focused': { color: '#0099cc' },
                            }}
                        >
                            <MenuItem value="High Protein">High Protein</MenuItem>
                            <MenuItem value="Low Fat">Low Fat</MenuItem>
                            <MenuItem value="High Net Carbs">High Net Carbs</MenuItem>
                            <MenuItem value="High Energy">High Energy</MenuItem>
                        </TextField>

                        {/* Cooking Steps TextField */}
                        <TextField
                            label="Cooking Steps"
                            value={editForm?.cookingSteps || ''}
                            onChange={(e) => setEditForm({ ...editForm, cookingSteps: e.target.value })}
                            fullWidth
                            margin="normal"
                            multiline
                            rows={4}
                            sx={{
                                '& .MuiInputBase-input': {
                                    color: '#000',
                                    '&:focus': { color: '#0099cc' },
                                },
                                '& .MuiInputLabel-root.Mui-focused': { color: '#0099cc' },
                            }}
                        />
                    </DialogContent>
                    <DialogActions sx={{ gap: 2 }}>
                        <Button
                            onClick={handleCancelEdit}
                            sx={{
                                color: '#00bfff',
                                textTransform: 'none',
                                fontSize: '16px',
                                fontWeight: 'bold',
                                background: 'none',
                                boxShadow: 'none',
                                '&:hover': {
                                    color: '#0099cc',
                                },
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmitEdit}
                            sx={{
                                color: '#00bfff',
                                textTransform: 'none',
                                fontSize: '16px',
                                fontWeight: 'bold',
                                background: 'none',
                                boxShadow: 'none',
                                '&:hover': {
                                    color: '#0099cc',
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
                            Are you sure you want to delete the Recommendation: {itemToDelete?.name}?
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
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, marginTop: '20px' }}>

                    {/* Hamburger Menu */}
                    <IconButton
                        onClick={handleMenuOpen}
                        sx={{
                            marginRight: '10px',
                            borderRadius: '50%',
                            colour: 'skyblue',
                            padding: 1,
                            '&:hover': {
                                backgroundColor: '#f0f0f0',
                            },
                        }}
                    >
                        <FilterListIcon sx={{ color: 'skyblue' }} />
                    </IconButton>

                    {/* Menu with options */}
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                        MenuListProps={{
                            disablePadding: true,
                        }}
                        PaperProps={{
                            style: {
                                maxHeight: 48 * 4.5 + 8, // Limits the height of the dropdown
                                overflowX: 'hidden', // Hides horizontal overflow
                                zIndex: 1300, // Ensures it's above standard overlays
                            },
                        }}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                        disableScrollLock={true} // Prevents scroll lock on the body
                    >
                        <MenuItem onClick={() => handleMenuSelect('High Protein')}>
                            <Typography>High Protein</Typography>
                        </MenuItem>
                        <MenuItem onClick={() => handleMenuSelect('Low Fat')}>
                            <Typography>Low Fat</Typography>
                        </MenuItem>
                        <MenuItem onClick={() => handleMenuSelect('High Net Carbs')}>
                            <Typography>High Net Carbs</Typography>
                        </MenuItem>
                        <MenuItem onClick={() => handleMenuSelect('High Energy')}>
                            <Typography>High Energy</Typography>
                        </MenuItem>
                    </Menu>

                </Box>

                {/* Food Cards */}
                <Box sx={{ mt: 6 }}>
                    <Grid container spacing={4} direction="column">
                        {filteredFoodItems.length > 0 ? (
                            filteredFoodItems.map((item, index) => (
                                <Grid item xs={12} key={index}>
                                    <Card
                                        sx={{
                                            display: 'flex',
                                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                            borderRadius: '8px',
                                            maxWidth: '100%',
                                            overflow: 'hidden',
                                            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                            '&:hover': {
                                                transform: 'scale(1.02)',
                                                boxShadow: '0 8px 16px rgba(0, 191, 255, 0.6)',
                                            },
                                        }}
                                    >
                                        <CardMedia
                                            component="img"
                                            sx={{
                                                width: '40%', // Ensures the image takes 40% of the card
                                                maxHeight: '400px', // Restrict height
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
                                                flexDirection: 'column',
                                                justifyContent: 'space-between',
                                                width: '100%',
                                                backgroundColor: 'white',
                                                overflow: 'hidden',
                                                padding: 2,
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
                                                    <strong>Description :</strong> {item.description} kcal
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: '#333', marginBottom: 0.2 }}>
                                                    <strong>Energy :</strong> {item.energy} kcal
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: '#333', marginBottom: 0.2 }}>
                                                    <strong>Protein:</strong> {item.protein} grams
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: '#333', marginBottom: 0.2 }}>
                                                    <strong>Fat:</strong> {item.fat} grams
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: '#333', marginBottom: 0 }}>
                                                    <strong>Net Carbs:</strong> {item.netCarbs} grams
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: '#333', marginBottom: 0 }}>
                                                    <strong>Steps to Cook:</strong>
                                                    {item.cookingSteps.split('\n').map((step, index) => {
                                                        const trimmedStep = step.trim();
                                                        return (
                                                            trimmedStep && (
                                                                <div key={index}>
                                                                    <strong>{`Step ${index + 1}:`}</strong> {trimmedStep}
                                                                </div>
                                                            )
                                                        );
                                                    })}
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
                                <Typography variant="h6" color="text.secondary">
                                    No food items available.
                                </Typography>
                            </Grid>
                        )}
                    </Grid>
                </Box>



            </main>
        </div>
    );
};

export default AdminViewRecom;
