// Import necessary modules and components
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productsAPI } from '../../services/api';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import './RelatedProducts.css';

// Define the RelatedProducts component
const RelatedProducts = ({ category, currentProductId }) => {
    // State to manage products, loading status, error, and current index for slider
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Fetch related products when category or currentProductId changes
    useEffect(() => {
        const fetchRelatedProducts = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await productsAPI.getProductsByCategory(category);
                // Filter out current product and limit to 8 items
                const filteredProducts = data
                    .filter(product => product.id !== currentProductId)
                    .slice(0, 8);
                setProducts(filteredProducts);
            } catch (err) {
                console.error('Error fetching related products:', err);
                setError('Failed to load related products');
            } finally {
                setLoading(false);
            }
        };

        if (category) {
            fetchRelatedProducts();
        }
    }, [category, currentProductId]);

    // Handle previous button click for slider
    const handlePrevious = () => {
        setCurrentIndex(prev => Math.max(prev - 1, 0));
    };

    // Handle next button click for slider
    const handleNext = () => {
        setCurrentIndex(prev => Math.min(prev + 1, Math.max(0, products.length - 4)));
    };

    // Display loading spinner if loading
    if (loading) {
        return (
            <div className="related-products-loading">
                <LoadingSpinner />
                <p>Loading related products...</p>
            </div>
        );
    }

    // Display error message if there's an error
    if (error) {
        return (
            <div className="related-products-error">
                <p>{error}</p>
            </div>
        );
    }

    // Return null if no related products are found
    if (!products.length) {
        return null;
    }

    return (
        <div className="related-products">
            <h2>You May Also Like</h2>
            <div className="related-products-container">
                {/* Previous button for slider */}
                <button 
                    className="nav-button prev"
                    onClick={handlePrevious}
                    disabled={currentIndex === 0}
                >
                    ‹
                </button>
                
                <div className="products-slider">
                    <div 
                        className="products-track"
                        style={{ 
                            transform: `translateX(-${currentIndex * 25}%)`,
                            transition: 'transform 0.3s ease-in-out'
                        }}
                    >
                        {/* Map through related products and display each product */}
                        {products.map((product) => (
                            <Link 
                                to={`/product/${product.id}`}
                                key={product.id}
                                className="product-card"
                            >
                                <div className="product-image">
                                    <img src={product.image} alt={product.name} />
                                    {product.stock <= 10 && product.stock > 0 && (
                                        <span className="stock-badge">
                                            Only {product.stock} left!
                                        </span>
                                    )}
                                </div>
                                <div className="product-info">
                                    <h3>{product.name}</h3>
                                    <div className="product-prices">
                                        {product.old_price > product.new_price && (
                                            <span className="old-price">£{product.old_price}</span>
                                        )}
                                        <span className="new-price">£{product.new_price}</span>
                                    </div>
                                    {product.stock === 0 && (
                                        <span className="out-of-stock">Out of Stock</span>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Next button for slider */}
                <button 
                    className="nav-button next"
                    onClick={handleNext}
                    disabled={currentIndex >= products.length - 4}
                >
                    ›
                </button>
            </div>
        </div>
    );
};

// Export the RelatedProducts component
export default RelatedProducts;


