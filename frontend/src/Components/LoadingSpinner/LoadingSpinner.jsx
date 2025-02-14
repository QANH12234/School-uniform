import React from 'react';
import './LoadingSpinner.css';

// LoadingSpinner component displays a loading spinner and a loading message
const LoadingSpinner = () => {
    return (
        <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading...</p>
        </div>
    );
};

export default LoadingSpinner;