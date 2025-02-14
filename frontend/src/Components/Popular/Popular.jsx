// Import necessary modules and components
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Popular.css';
import Item from '../Item/Item';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

// Define the Popular component
const Popular = ({ products: initialProducts = [] }) => {
  // State to manage products, loading status, error, language, pagination, and sorting
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState('en');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [sortBy, setSortBy] = useState('popularity');

  // Set language based on document's language setting
  useEffect(() => {
    const htmlLang = document.documentElement.lang;
    if (htmlLang) {
      setLanguage(htmlLang);
    }
  }, []);

  // Sort products based on selected sorting option
  useEffect(() => {
    try {
      setIsLoading(true);
      // Sort products based on selected option
      let sortedProducts = [...initialProducts];
      switch (sortBy) {
        case 'price-asc':
          sortedProducts.sort((a, b) => a.new_price - b.new_price);
          break;
        case 'price-desc':
          sortedProducts.sort((a, b) => b.new_price - a.new_price);
          break;
        case 'newest':
          sortedProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
        default:
          // Default popularity order
          sortedProducts.sort((a, b) => b.popularity - a.popularity);
          break;
      }
      setProducts(sortedProducts);
    } catch (err) {
      setError('Error sorting products');
      console.error('Error sorting products:', err);
    } finally {
      setIsLoading(false);
    }
  }, [sortBy, initialProducts]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(products.length / itemsPerPage);

  // Handle page change
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle sorting option change
  const handleSortChange = (event) => {
    setSortBy(event.target.value);
    setCurrentPage(1);
  };

  // Display loading spinner if loading
  if (isLoading) {
    return (
      <div className="popular">
        <h1>{language === 'en' ? 'POPULAR ITEMS' : 'SẢN PHẨM PHỔ BIẾN'}</h1>
        <hr />
        <LoadingSpinner />
      </div>
    );
  }

  // Display error message if there's an error
  if (error) {
    return (
      <div className="popular">
        <h1>{language === 'en' ? 'POPULAR ITEMS' : 'SẢN PHẨM PHỔ BIẾN'}</h1>
        <hr />
        <div className="error">
          <p>{language === 'en' ? 'Unable to load products. Please try again later.' : 'Không thể tải sản phẩm. Vui lòng thử lại sau.'}</p>
          <button onClick={() => window.location.reload()} className="retry-button">
            {language === 'en' ? 'Retry' : 'Thử lại'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="popular">
      <h1>{language === 'en' ? 'POPULAR ITEMS' : 'SẢN PHẨM PHỔ BIẾN'}</h1>
      <hr />
      
      {products.length > 0 ? (
        <>
          <div className="popular-controls">
            <div className="sort-control">
              <label htmlFor="sort">
                {language === 'en' ? 'Sort by:' : 'Sắp xếp theo:'}
              </label>
              <select id="sort" value={sortBy} onChange={handleSortChange}>
                <option value="popularity">
                  {language === 'en' ? 'Popularity' : 'Độ phổ biến'}
                </option>
                <option value="price-asc">
                  {language === 'en' ? 'Price: Low to High' : 'Giá: Thấp đến Cao'}
                </option>
                <option value="price-desc">
                  {language === 'en' ? 'Price: High to Low' : 'Giá: Cao đến Thấp'}
                </option>
                <option value="newest">
                  {language === 'en' ? 'Newest First' : 'Mới nhất'}
                </option>
              </select>
            </div>
            
            <div className="items-count">
              {language === 'en' 
                ? `Showing ${indexOfFirstItem + 1}-${Math.min(indexOfLastItem, products.length)} of ${products.length} items`
                : `Hiển thị ${indexOfFirstItem + 1}-${Math.min(indexOfLastItem, products.length)} trong ${products.length} sản phẩm`}
            </div>
          </div>

          <div className="popular-item">
            {/* Display current items */}
            {currentItems.map((item) => (
              <Item 
                key={item.id} 
                {...item}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button 
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="page-button"
              >
                ←
              </button>
              
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => paginate(index + 1)}
                  className={`page-button ${currentPage === index + 1 ? 'active' : ''}`}
                >
                  {index + 1}
                </button>
              ))}
              
              <button 
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="page-button"
              >
                →
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="no-products">
          {language === 'en' 
            ? 'No popular items available at the moment.'
            : 'Hiện không có sản phẩm phổ biến nào.'}
        </div>
      )}
    </div>
  );
};

// Export the Popular component
export default Popular;