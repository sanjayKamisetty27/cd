import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook for navigation
import AdminNav from '../components/Adminnav'; // Importing the AdminNav component
import { 
  MenuItem, Button, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Paper, Dialog, 
  DialogActions, DialogContent, DialogTitle, TextField, 
  Snackbar, Alert, Typography, TablePagination 
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { createTheme, ThemeProvider} from '@mui/material/styles';
import { styled } from '@mui/material/styles';

// Sky blue theme
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
      default: '#f4f7fb',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '25px', // Rounded corners
          fontWeight: 'bold',
          textTransform: 'none', // To keep text as is
          padding: '8px 20px', // Adjust padding for better visual balance
          transition: 'all 0.3s ease', // Smooth transition for hover effect
          '&:hover': {
            transform: 'scale(1.05)', // Slightly scale up on hover for a modern feel
            backgroundColor: '#0095e8', // Darker Blue on hover
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)', // Add shadow on hover
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

const StyledTablePagination = styled(TablePagination)(({ theme }) => ({
  '& .MuiTablePagination-toolbar': {
    backgroundColor: theme.palette.background.paper,
    minHeight: '48px', // Ensure consistent height
    display: 'flex',
    alignItems: 'center', // Center align all toolbar items vertically
  },
  '& .MuiTablePagination-selectLabel, & .MuiTablePagination-input': {
    fontSize: '0.875rem', // Ensure consistent font size
    color: theme.palette.text.secondary,
    display: 'flex',
    alignItems: 'center', // Align text and dropdown vertically
  },
  '& .MuiTablePagination-select': {
    marginTop: 0, // Remove any vertical offset for the select dropdown
    marginBottom: 0, // Ensure alignment with the label text
  },
  '& .MuiTablePagination-actions': {
    color: theme.palette.primary.main, // Consistent color for navigation icons
  },
}));

// Helper function to format the date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month starts from 0
  const day = date.getDate().toString().padStart(2, '0'); // Day of the month
  const year = date.getFullYear(); // Full year
  return `${day}/${month}/${year}`; // Return in MM/DD/YYYY format
};

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editUser, setEditUser] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [page, setPage] = useState(0);  // Track current page
  const [rowsPerPage, setRowsPerPage] = useState(10);  // Number of rows per page
  const navigate = useNavigate(); 
  const [totalUsers, setTotalUsers] = useState(0);


  // Fetch user data from backend
  useEffect(() => {
    axios
      .get(`http://localhost:8080/users/all?page=${page}&size=${rowsPerPage}`)
      .then((response) => {
          setUsers(response.data.content); // `content` holds the current page of users
          setTotalUsers(response.data.totalElements); // `totalElements` is the total number of users
          
      })
      .catch((error) => {
          console.error('Error fetching user data:', error);
      });

    const username = sessionStorage.getItem('username');
    const authToken = sessionStorage.getItem('authToken');

    if (!authToken || !username) {
      navigate('/'); // Redirect to home if no auth token or username is found
    } else {
      axios.get(`http://localhost:8080/admin?username=${username}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      })
      .then(response => {
        if (response.data.user && response.data.user.username) {
          sessionStorage.setItem('userName', response.data.user.username);
        }
      })
      .catch(error => {
        console.error('Error fetching user data:', error.response ? error.response.data : error.message);
      });
    }
  }, [page, rowsPerPage,navigate]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);  // Update page when user changes page
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10)); // Update rows per page
    setPage(0); // Reset to first page when rows per page changes
  };

  // Handle logout
  const handleLogout = () => {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('userName');
    navigate('/'); // Redirect to home
    window.location.reload(); // Refresh page
  };

  // Open the edit dialog and set the user to be edited
  const handleEdit = (email) => {
    const userToEdit = users.find((user) => user.email === email);
    setEditUser(userToEdit);
    setOpenEditDialog(true);
  };

  // Close the edit dialog
  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  };

  // Handle the update of user details
  const handleUpdateUser = () => {
    axios
      .put(`http://localhost:8080/adminedit/${editUser.email}`, editUser)
      .then((response) => {
        setUsers((prevUsers) =>
          prevUsers.map((user) => (user.email === editUser.email ? response.data : user))
        );
        setSuccessMessage('User updated successfully!');
        setOpenEditDialog(false);
      })
      .catch((error) => {
        console.error('Error updating user:', error);
        setErrorMessage('Error updating user.');
      });
  };

  // Handle delete user
  const handleDelete = (email) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      axios
        .delete(`http://localhost:8080/delete/${email}`)
        .then(() => {
          setUsers((prevUsers) => prevUsers.filter((user) => user.email !== email));
          setSuccessMessage('User deleted successfully!');
        })
        .catch((error) => {
          console.error('Error deleting user:', error);
          setErrorMessage('Error deleting user.');
        });
    }
  };

  return (
    <ThemeProvider theme={skyBlueTheme}>
      <div>
        <AdminNav handleLogout={handleLogout}/> {/* Adding the AdminNav component */}
        <div style={{ padding: '20px', backgroundColor: 'white', minHeight: '100vh' }}>
          <Typography variant="h4" align="center" gutterBottom style={{ color: '#00bfff' }}>
            Registered Users
          </Typography>
          <TableContainer component={Paper} style={{ boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)', marginBottom: '20px' }}>
            <Table>
              <TableHead>
                <TableRow style={{ backgroundColor: '#00bfff' }}>
                  <TableCell style={{ color: '#ffffff', fontWeight: 'bold' }}>Name</TableCell>
                  <TableCell style={{ color: '#ffffff', fontWeight: 'bold' }}>Email</TableCell>
                  <TableCell style={{ color: '#ffffff', fontWeight: 'bold' }}>Gender</TableCell>
                  <TableCell style={{ color: '#ffffff', fontWeight: 'bold' }}>Birth Date</TableCell>
                  <TableCell style={{ color: '#ffffff', fontWeight: 'bold' }}>Height (ft)</TableCell>
                  <TableCell style={{ color: '#ffffff', fontWeight: 'bold' }}>Height (in)</TableCell>
                  <TableCell style={{ color: '#ffffff', fontWeight: 'bold' }}>Weight</TableCell>
                  <TableCell style={{ color: '#ffffff', fontWeight: 'bold', textAlign: 'center' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.email}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.gender}</TableCell>
                    <TableCell>{formatDate(user.birthDate)}</TableCell> {/* Format birth date for display */}
                    <TableCell>{user.heightFeet}</TableCell>
                    <TableCell>{user.heightInches}</TableCell>
                    <TableCell>{user.weight}</TableCell>
                    <TableCell style={{ textAlign: 'center' }}>
                      <Button
                        onClick={() => handleEdit(user.email)} // Use email here
                        variant="contained"
                        startIcon={<EditIcon />}
                        style={{ marginRight: '10px' }}
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDelete(user.email)} // Use email here
                        variant="contained"
                        startIcon={<DeleteIcon />}
                        color="error"
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        <StyledTablePagination
          component="div"
          count={totalUsers} // Total number of users
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[10, 15, 20]} // Add more options if needed
        />
        {/* Edit Dialog */}
        <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
          <DialogTitle>Edit User</DialogTitle>
          <DialogContent>
            <TextField
              label="Name"
              value={editUser.name || ''}
              onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Email"
              value={editUser.email || ''}
              onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
              fullWidth
              margin="normal"
              disabled
            />
            <TextField
              label="Gender"
              value={editUser.gender || ''}
              onChange={(e) => setEditUser({ ...editUser, gender: e.target.value })}
              fullWidth
              margin="normal"
              select
            >
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Prefer not to say">Prefer not to say</MenuItem>
            </TextField>
            <TextField
            label="Birth Date"
            type="date"
            fullWidth
            margin="normal"
            value={editUser.birthDate || ''}
            onChange={(e) => setEditUser({ ...editUser, birthDate: e.target.value })}
            InputLabelProps={{
                shrink: true,
            }}
            inputProps={{
                max: new Date().toISOString().split('T')[0], // Setting max to today's date
            }}
            />
            <TextField
              label="Height (ft)"
              value={editUser.heightFeet || ''}
              onChange={(e) => setEditUser({ ...editUser, heightFeet: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Height (in)"
              value={editUser.heightInches || ''}
              onChange={(e) => setEditUser({ ...editUser, heightInches: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Weight"
              value={editUser.weight || ''}
              onChange={(e) => setEditUser({ ...editUser, weight: e.target.value })}
              fullWidth
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEditDialog} color="primary">Cancel</Button>
            <Button onClick={handleUpdateUser} color="primary">Update</Button>
          </DialogActions>
        </Dialog>

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
      </div>
    </ThemeProvider>
  );
};

export default AdminUsersPage;
