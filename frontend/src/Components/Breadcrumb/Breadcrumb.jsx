// Import necessary modules and components
import React from 'react';
import { Link } from 'react-router-dom';
import './Breadcrumb.css';

// Define the Breadcrumb component
const Breadcrumb = ({ items }) => {
    return (
        <div className="breadcrumb">
            <div className="breadcrumb-container">
                {/* Link to the home page */}
                <Link to="/" className="breadcrumb-item">
                    <i className="fas fa-home"></i>
                    Trang chủ
                </Link>
                {/* Map through breadcrumb items */}
                {items.map((item, index) => (
                    <React.Fragment key={index}>
                        {/* Separator between breadcrumb items */}
                        <span className="breadcrumb-separator">/</span>
                        {index === items.length - 1 ? (
                            // If it's the last item, display it as active text
                            <span className="breadcrumb-item active">{item.label}</span>
                        ) : (
                            // Otherwise, display it as a link
                            <Link to={item.path} className="breadcrumb-item">
                                {item.label}
                            </Link>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

// Export the Breadcrumb component
export default Breadcrumb;