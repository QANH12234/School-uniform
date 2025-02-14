import React, { useState, useRef } from 'react';
import { Box, Button, TextField, Typography, Container, Alert, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Define categories and API URL
const CATEGORIES = ['primary', 'secondary', 'sixth'];
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// Component for file input
const FileInput = ({ onImageChange, disabled }) => {
  const fileInputRef = useRef(null);
  
  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Box>
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        style={{ display: 'none' }}
        onChange={onImageChange}
        name="product-image"
        id="product-image"
      />
      <Button
        variant="contained"
        onClick={handleClick}
        fullWidth
        disabled={disabled}
        sx={{ mt: 2 }}
      >
        Upload Image
      </Button>
    </Box>
  );
};

const AddProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    new_price: '',
    old_price: '',
    description: '',
    stock: 0
  });
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle image input change
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (!image) {
        throw new Error('Please select an image');
      }

      // First upload the image
      const imageData = new FormData();
      imageData.append('product', image);

      const imageResponse = await axios.post(
        `${API_URL}/api/upload`,
        imageData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (!imageResponse.data.image_url) {
        throw new Error('Failed to upload image');
      }

      // Then create the product
      const productData = {
        ...formData,
        new_price: Number(formData.new_price),
        old_price: Number(formData.old_price),
        stock: Number(formData.stock),
        image: imageResponse.data.image_url
      };

      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Authentication required');
      }

      await axios.post(
        `${API_URL}/api/products`,
        productData,
        {
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
          }
        }
      );

      setSuccess('Product added successfully!');
      setFormData({
        name: '',
        category: '',
        new_price: '',
        old_price: '',
        description: '',
        stock: 0
      });
      setImage(null);
      
      // Reset file input
      const fileInput = document.querySelector('#product-image');
      if (fileInput) {
        fileInput.value = '';
      }
    } catch (error) {
      console.error('Error adding product:', error);
      setError(error.response?.data?.error || error.message || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Add New Product
          </Typography>
          <Button 
            variant="outlined" 
            onClick={() => navigate('/dashboard')}
            sx={{ mb: 2 }}
          >
            Back to Dashboard
          </Button>
        </Box>

        {/* Display error message */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Display success message */}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        {/* Form to add product */}
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Product Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            select
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            {CATEGORIES.map((option) => (
              <MenuItem key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            margin="normal"
            required
            fullWidth
            label="New Price"
            name="new_price"
            type="number"
            value={formData.new_price}
            onChange={handleChange}
            inputProps={{ min: 0 }}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            label="Old Price"
            name="old_price"
            type="number"
            value={formData.old_price}
            onChange={handleChange}
            inputProps={{ min: 0 }}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            label="Stock"
            name="stock"
            type="number"
            value={formData.stock}
            onChange={handleChange}
            inputProps={{ min: 0 }}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            label="Description"
            name="description"
            multiline
            rows={4}
            value={formData.description}
            onChange={handleChange}
          />

          <FileInput 
            onImageChange={handleImageChange}
            disabled={loading}
          />

          {image && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              Selected file: {image.name}
            </Typography>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading || !image}
          >
            {loading ? 'Adding Product...' : 'Add Product'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default AddProduct;