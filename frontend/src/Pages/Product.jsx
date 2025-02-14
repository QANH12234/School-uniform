// Import necessary modules and components from React, react-router-dom, and react-toastify
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Breadcrum from '../Components/Breadcrums/Breadcrum';
import ProductDisplay from '../Components/ProductDisplay/ProductDisplay';
import DescriptionBox from '../Components/DescriptionBox/DescriptionBox';
import RelatedProducts from '../Components/RelatedProducts/RelatedProducts';
import LoadingSpinner from '../Components/LoadingSpinner/LoadingSpinner';
import { productsAPI } from '../services/api';
import { ShopContext } from '../Context/ShopContext';
import { toast } from 'react-toastify';
import './Product.css';

// Define the Product functional component
const Product = () => {
  // Use the useNavigate hook to get the navigate function for programmatic navigation
  const navigate = useNavigate();
  // Extract the productId from the URL parameters
  const { productId } = useParams();
  // Use the ShopContext to access the addItemToCart function
  const { addItemToCart } = useContext(ShopContext);
  // Define state variables for product details, loading status, error message, selected size, and quantity
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // useEffect hook to fetch product details when the component mounts or when productId changes
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Set loading state to true and reset error state
        setLoading(true);
        setError(null);
        // Fetch product details from the API
        const data = await productsAPI.getProductById(productId);
        // If no product data is found, set an error message
        if (!data) {
          setError('Product not found');
          return;
        }
        // Set the product state with the fetched data
        setProduct(data);
        // Reset size and quantity when product changes
        setSelectedSize(null);
        setQuantity(1);
      } catch (err) {
        // Log the error and set an error message
        console.error('Error fetching product:', err);
        setError('Failed to load product. Please try again later.');
      } finally {
        // Set loading state to false
        setLoading(false);
      }
    };

    // Call the fetchProduct function
    fetchProduct();
    // Scroll to the top of the page when the product changes
    window.scrollTo(0, 0);
  }, [productId]);

  // Handler function to add the product to the cart
  const handleAddToCart = async () => {
    // If no size is selected, show a warning toast
    if (!selectedSize) {
      toast.warning('Please select a size');
      return;
    }

    // If the quantity is less than 1, show a warning toast
    if (quantity < 1) {
      toast.warning('Please select a valid quantity');
      return;
    }

    // If the quantity exceeds the available stock, show an error toast
    if (quantity > product.stock) {
      toast.error('Not enough stock available');
      return;
    }

    try {
      // Attempt to add the item to the cart
      const success = await addItemToCart(productId, selectedSize, quantity);
      // If successful, show a success toast
      if (success) {
        toast.success('Added to cart successfully!');
      } else {
        // If unsuccessful, show an error toast
        toast.error('Failed to add to cart. Please try again.');
      }
    } catch (err) {
      // Log the error and show an error toast
      console.error('Error adding to cart:', err);
      toast.error('Failed to add to cart. Please try again.');
    }
  };

  // If the component is in a loading state, render a loading indicator
  if (loading) {
    return (
      <div className="product-page loading">
        <LoadingSpinner />
        <p>Loading product details...</p>
      </div>
    );
  }

  // If there is an error, render an error message
  if (error) {
    return (
      <div className="product-page error">
        <div className="error-message">
          <h2>{error}</h2>
          <button onClick={() => navigate('/')}>
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  // If no product is found, render a not found message
  if (!product) {
    return (
      <div className="product-page error">
        <div className="error-message">
          <h2>Product not found</h2>
          <p>The product you're looking for might have been removed or is no longer available.</p>
          <button onClick={() => navigate('/')}>
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  // Return the JSX to render the product page
  return (
    <div className="product-page">
      <Breadcrum product={product} />
      <div className="product-content">
        <ProductDisplay 
          product={product}
          selectedSize={selectedSize}
          setSelectedSize={setSelectedSize}
          quantity={quantity}
          setQuantity={setQuantity}
          onAddToCart={handleAddToCart}
        />
        <div className="stock-info">
          {product.stock > 10 ? (
            <p className="in-stock">In stock: {product.stock} units</p>
          ) : product.stock === 0 ? (
            <p className="out-of-stock">Out of stock</p>
          ) : (
            <p className="low-stock">Low stock - only {product.stock} units left!</p>
          )}
        </div>
        <DescriptionBox description={product.description} />
        <RelatedProducts 
          category={product.category} 
          currentProductId={product.id} 
        />
      </div>
    </div>
  );
};

// Export the Product component as the default export
export default Product;