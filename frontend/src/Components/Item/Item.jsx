import React, { useState } from 'react';
import './Item.css';
import { Link } from 'react-router-dom';

const Item = ({ id, name, image, new_price, old_price, stock }) => {
    // State to manage image load status
    const [imageLoaded, setImageLoaded] = useState(false);
    
    // Format price to Pound currency
    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-EN', {
            style: 'currency',
            currency: 'GBP'
        }).format(price);
    };

    // Get stock status based on stock quantity
    const getStockStatus = (stock) => {
        if (stock > 20) return { text: 'In Stock', class: 'in-stock' };
        if (stock > 0) return { text: `Only ${stock} left`, class: 'low-stock' };
        return { text: 'Out of Stock', class: 'out-of-stock' };
    };

    const stockStatus = getStockStatus(stock);
    
    // Handle image load event
    const handleImageLoad = () => {
        setImageLoaded(true);
    };

    return (
        <div className="item">
            <Link to={`/product/${id}`}>
                <div className="item-image">
                    <img 
                        src={image} 
                        alt={name} 
                        loading="lazy"
                        onLoad={handleImageLoad}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/placeholder.png';
                        }}
                    />
                    {stock === 0 && <div className="out-of-stock-overlay">Out of Stock</div>}
                </div>
                <div className="item-details">
                    <h3 className="item-name">{name}</h3>
                    <div className="item-prices">
                        <span className="new-price">{formatPrice(new_price)}</span>
                        {old_price > new_price && (
                            <span className="old-price">{formatPrice(old_price)}</span>
                        )}
                    </div>
                    <span className={`stock-status ${stockStatus.class}`}>
                        {stockStatus.text}
                    </span>
                    {stock > 0 && (
                        <div className="view-details-btn">
                            View Details
                        </div>
                    )}
                </div>
            </Link>
        </div>
    );
};

export default Item;