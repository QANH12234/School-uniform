import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Container, Grid } from '@mui/material';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1">
            Admin Dashboard
          </Typography>
          {/* Logout button */}
          <Button variant="outlined" color="error" onClick={logout}>
            Logout
          </Button>
        </Box>

        <Grid container spacing={3}>
          {/* Button to navigate to add product page */}
          <Grid item xs={12} sm={6} md={4}>
            <Button
              variant="contained"
              fullWidth
              sx={{ height: '120px' }}
              onClick={() => navigate('/addproduct')}
            >
              Add New Product
            </Button>
          </Grid>
          {/* Button to navigate to manage products page */}
          <Grid item xs={12} sm={6} md={4}>
            <Button
              variant="contained"
              fullWidth
              sx={{ height: '120px' }}
              onClick={() => navigate('/products')}
            >
              Manage Products
            </Button>
          </Grid>
          {/* Button to navigate to view orders page */}
          <Grid item xs={12} sm={6} md={4}>
            <Button
              variant="contained"
              fullWidth
              sx={{ height: '120px' }}
              onClick={() => navigate('/orders')}
            >
              View Orders
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Dashboard;