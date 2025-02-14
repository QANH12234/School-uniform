// Import necessary modules and components
import React, { useState } from 'react';
import './ProductList.css';
import Item from '../Item/Item';

// Define the ProductList component
const ProductList = ({ products, category }) => {
    // State to manage sorting, view mode, and items per page
    const [sortBy, setSortBy] = useState('newest');
    const [view, setView] = useState('grid');
    const [itemsPerPage, setItemsPerPage] = useState(15);

    // Function to sort products based on selected sorting option
    const sortProducts = (products) => {
        switch (sortBy) {
            case 'price-asc':
                return [...products].sort((a, b) => a.new_price - b.new_price);
            case 'price-desc':
                return [...products].sort((a, b) => b.new_price - a.new_price);
            case 'newest':
                return [...products].sort((a, b) => new Date(b.date) - new Date(a.date));
            default:
                return products;
        }
    };

    // Get sorted products
    const sortedProducts = sortProducts(products);

    return (
        <div className="product-list-container">
            <div className="product-list-header">
                <div className="category-info">
                    <h1>{category}</h1>
                    <span className="product-count">
                        Showing {Math.min(itemsPerPage, products.length)} of {products.length} results
                    </span>
                </div>
                
                <div className="product-filters">
                    <div className="filter-group">
                        <label>Sort by:</label>
                        <select 
                            value={sortBy} 
                            onChange={(e) => setSortBy(e.target.value)}
                            className="sort-select"
                        >
                            <option value="newest">Newest First</option>
                            <option value="price-asc">Price: Low to High</option>
                            <option value="price-desc">Price: High to Low</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>Show:</label>
                        <select 
                            value={itemsPerPage} 
                            onChange={(e) => setItemsPerPage(Number(e.target.value))}
                            className="display-select"
                        >
                            <option value={15}>15 items</option>
                            <option value={30}>30 items</option>
                            <option value={45}>45 items</option>
                        </select>
                    </div>

                    <div className="view-toggle">
                        {/* Button to switch to grid view */}
                        <button 
                            className={`view-btn ${view === 'grid' ? 'active' : ''}`}
                            onClick={() => setView('grid')}
                            aria-label="Grid view"
                        >
                            <i className="fas fa-th"></i>
                        </button>
                        {/* Button to switch to list view */}
                        <button 
                            className={`view-btn ${view === 'list' ? 'active' : ''}`}
                            onClick={() => setView('list')}
                            aria-label="List view"
                        >
                            <i className="fas fa-list"></i>
                        </button>
                    </div>
                </div>
            </div>

            <div className={`product-grid ${view === 'list' ? 'list-view' : ''}`}>
                {/* Display sorted products */}
                {sortedProducts.length > 0 ? (
                    sortedProducts.slice(0, itemsPerPage).map((product) => (
                        <Item 
                            key={product.id}
                            {...product}
                        />
                    ))
                ) : (
                    <div className="no-products">
                        No products found in this category.
                    </div>
                )}
            </div>

            {/* Load more products button */}
            {products.length > itemsPerPage && (
                <div className="load-more">
                    <button onClick={() => setItemsPerPage(prev => prev + 15)}>
                        Load More Products
                    </button>
                </div>
            )}
        </div>
    );
};

// Export the ProductList component
export default ProductList;