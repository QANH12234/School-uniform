// Import necessary modules and components from React, react-router-dom, and custom components
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import { productsAPI, withErrorHandler } from '../services/api';
import Hero from '../Components/Hero/Hero';
import Popular from '../Components/Popular/Popular';
import Offers from '../Components/Offers/Offers';
import NewCollections from '../Components/NewCollections/NewCollections';
import NewsLetter from '../Components/NewsLetter/NewsLetter';
import LoadingSpinner from '../Components/LoadingSpinner/LoadingSpinner';
import './Shop.css';

// Import images
import primaryUniform from '../Components/Assets/product_1.png';
import secondaryUniform from '../Components/Assets/product_2.png';
import sixthUniform from '../Components/Assets/product_3.png';
import heroImage from '../Components/Assets/hero_image.png';

// Define the Shop functional component
const Shop = () => {
  // Use the useAuth hook to get the current user
  const { user } = useAuth();
  // Define state variables for loading status, error message, language, popular products, and new products
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState('en');
  const [popularProducts, setPopularProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  
  // useEffect hook to fetch shop data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Set loading state to true and reset error state
        setIsLoading(true);
        setError(null);

        // Get language from HTML tag
        const htmlLang = document.documentElement.lang;
        if (htmlLang) {
          setLanguage(htmlLang);
        }

        // Fetch popular products
        const popularData = await withErrorHandler(() => 
          productsAPI.getPopularProducts()
        );
        setPopularProducts(popularData || []);

        // Fetch new collections
        const newData = await withErrorHandler(() => 
          productsAPI.getNewProducts()
        );
        setNewProducts(newData || []);

      } catch (err) {
        // Log the error and set an error message
        console.error('Error loading shop data:', err);
        setError('Failed to load shop data. Please try again.');
      } finally {
        // Set loading state to false
        setIsLoading(false);
      }
    };

    // Call the fetchData function
    fetchData();
  }, []);

  // If the component is in a loading state, render a loading indicator
  if (isLoading) {
    return (
      <div className="loading-container">
        <LoadingSpinner />
        <p>Loading shop data...</p>
      </div>
    );
  }

  // If there is an error, render an error message
  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  // Return the JSX to render the shop page
  return (
    <div className="shop">
      <Hero />
      <Popular products={popularProducts} />
      <Offers />
      <NewCollections products={newProducts} />
      <NewsLetter />
    </div>
  );
};

// Export the Shop component as the default export
export default Shop;