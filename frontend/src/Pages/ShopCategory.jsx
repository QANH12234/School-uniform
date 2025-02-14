// Import necessary modules and components from React, react-router-dom, and custom components
import React, { useState, useEffect } from 'react';
import './CSS/ShopCategory.css'
import dropdown_icon from '../Components/Assets/dropdown_icon.png'
import Item from '../Components/Item/Item'
import LoadingSpinner from '../Components/LoadingSpinner/LoadingSpinner';
import { productsAPI, withErrorHandler } from '../services/api';
import { useNavigate } from 'react-router-dom';

// Add sizes configuration
const sizes = {
  primary: ['4', '6', '8', '10', '12', '14', '16'],
  secondary: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
  sixth: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
  pe: ['4', '6', '8', '10', '12', '14', '16'],
  accessories: ['One Size'],
};

// Define the ShopCategory functional component
const ShopCategory = ({ category, title }) => {
  // Define state variables for products, loading status, error message, sort type, and selected size
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('default');
  const [selectedSize, setSelectedSize] = useState(null);
  const language = document.documentElement.lang || 'en';
  const navigate = useNavigate();

  // Function to get the category title based on the language
  const getCategoryTitle = () => {
    if (language === 'vi') {
      const viTitles = {
        primary: 'Đồng phục Tiểu học',
        secondary: 'Đồng phục Trung học',
        sixth: 'Đồng phục Lớp 6',
        pe: 'Đồng phục Thể dục',
        accessories: 'Phụ kiện'
      };
      return viTitles[category] || title;
    }
    return title || `${category.charAt(0).toUpperCase() + category.slice(1)} Uniforms`;
  };

  // Function to sort products based on the selected sort type
  const sortProducts = (products, sortType) => {
    switch (sortType) {
      case 'price-low':
        return [...products].sort((a, b) => a.new_price - b.new_price);
      case 'price-high':
        return [...products].sort((a, b) => b.new_price - a.new_price);
      case 'name':
        return [...products].sort((a, b) => a.name.localeCompare(b.name));
      case 'stock-high':
        return [...products].sort((a, b) => b.stock - a.stock);
      default:
        return products;
    }
  };

  // useEffect hook to fetch products when the component mounts or when category changes
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Set loading state to true and reset error state
        setLoading(true);
        setError(null);
        
        // Fetch products by category from the API
        const data = await withErrorHandler(() => 
          productsAPI.getProductsByCategory(category)
        );

        // If no products are found, set an error message
        if (!data || data.length === 0) {
          setError('No products found in this category.');
        } else {
          // Set the products state with the fetched data
          setProducts(data);
        }
      } catch (err) {
        // Log the error and set an error message
        console.error('Error loading products:', err);
        setError('Failed to load products. Please try again.');
      } finally {
        // Set loading state to false
        setLoading(false);
      }
    };

    // Call the fetchProducts function
    fetchProducts();
  }, [category]);

  // Handler function to update the sort type
  const handleSort = (event) => {
    setSortBy(event.target.value);
  };

  // Handler function to reload the page
  const handleRetry = () => {
    window.location.reload();
  };

  // Handler function to select or deselect a size
  const handleSizeSelect = (size) => {
    setSelectedSize(prevSize => {
      if (prevSize === size) {
        return null;
      }
      return size;
    });
  };

  // If the component is in a loading state, render a loading indicator
  if (loading) {
    return (
      <div className="shop-category">
        <div className="category-header">
          <h1>{getCategoryTitle()}</h1>
        </div>
        <div className="loading-container">
          <LoadingSpinner />
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  // Sort and filter products based on the selected sort type and size
  const sortedProducts = sortProducts(products, sortBy);
  const filteredProducts = selectedSize
    ? products.filter(product => product.sizes?.includes(selectedSize))
    : sortedProducts;
  const sortedAndFilteredProducts = sortProducts(filteredProducts, sortBy);

  // Return the JSX to render the shop category page
  return (
    <div className="shop-category">
      <div className="category-header">
        <h1>{getCategoryTitle()}</h1>
      </div>

      {error ? (
        <div className="error-container">
          <p>{language === 'vi' ? 'Không tìm thấy sản phẩm.' : error}</p>
          <button onClick={handleRetry}>
            {language === 'vi' ? 'Thử lại' : 'Try Again'}
          </button>
        </div>
      ) : (
        <>
          <div className="category-indexSort">
            <p>
              <span>
                {language === 'vi' 
                  ? `Hiển thị ${sortedAndFilteredProducts.length} sản phẩm`
                  : `Showing ${sortedAndFilteredProducts.length} products`}
              </span>
            </p>
            <div className="category-sort">
              <select 
                className="sort-select"
                value={sortBy}
                onChange={handleSort}
                aria-label={language === 'vi' ? 'Sắp xếp sản phẩm' : 'Sort products'}
              >
                <option value="default">{language === 'vi' ? 'Mặc định' : 'Default sorting'}</option>
                <option value="price-low">{language === 'vi' ? 'Giá: Thấp đến Cao' : 'Price: Low to High'}</option>
                <option value="price-high">{language === 'vi' ? 'Giá: Cao đến Thấp' : 'Price: High to Low'}</option>
                <option value="name">{language === 'vi' ? 'Tên: A đến Z' : 'Name: A to Z'}</option>
                <option value="stock-high">{language === 'vi' ? 'Tồn kho: Cao đến Thấp' : 'Stock: High to Low'}</option>
              </select>
              <img src={dropdown_icon} alt="" />
            </div>
          </div>

          {sizes[category] && sizes[category].length > 0 && (
            <div className="size-selector">
              <h3>
                <span>{language === 'vi' ? 'Lọc theo Kích thước' : 'Filter by Size'}</span>
                <div className="size-actions">
                  <button 
                    className="size-guide-btn"
                    onClick={() => navigate('/size-guide')}
                    aria-label={language === 'vi' ? 'Xem hướng dẫn kích thước' : 'View size guide'}
                  >
                    <span className="size-guide-icon">📏</span>
                    {language === 'vi' ? 'Hướng dẫn Kích thước' : 'Size Guide'}
                  </button>
                </div>
              </h3>
              <div className="size-options">
                {sizes[category].map((size) => (
                  <button
                    key={size}
                    className={`size-option ${selectedSize === size ? 'selected' : ''}`}
                    onClick={() => handleSizeSelect(size)}
                    aria-pressed={selectedSize === size}
                    aria-label={`Size ${size}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {sortedAndFilteredProducts.length > 0 ? (
            <div className="category-products">
              {sortedAndFilteredProducts.map((item) => (
                <div key={item.id} className="product-container">
                  <Item {...item} />
                </div>
              ))}
            </div>
          ) : (
            <div className="no-products">
              <p>
                {language === 'vi' 
                  ? 'Không có sản phẩm nào trong kích thước này.'
                  : 'No products available in this size.'}
              </p>
              <p className="help-text">
                {language === 'vi'
                  ? 'Vui lòng thử kích thước khác hoặc quay lại sau.'
                  : 'Please try a different size or check back later.'}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// Export the ShopCategory component as the default export
export default ShopCategory;