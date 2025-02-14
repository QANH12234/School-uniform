// Import necessary modules and components from React and react-router-dom
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import SizeCalculator from '../Components/SizeCalculator/SizeCalculator';
import './CSS/SizeGuidePage.css';

// Define the SizeGuidePage functional component
const SizeGuidePage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const language = document.documentElement.lang || 'en';

    // Handler function to navigate back to the previous page or home page
    const handleBack = () => {
        // If there's a previous page in history, go back
        if (window.history.length > 2) {
            navigate(-1);
        } else {
            // If no history, go to home page
            navigate('/');
        }
    };

    // Return the JSX to render the size guide page
    return (
        <div className="size-guide-page">
            <button 
                className="back-nav-button"
                onClick={handleBack}
                aria-label={language === 'vi' ? 'Quay lại trang trước' : 'Back to previous page'}
            >
                <span className="back-icon">←</span>
                <span className="back-text">
                    {language === 'vi' ? 'Quay lại' : 'Back'}
                </span>
            </button>
            <div className="size-guide-content">
                <SizeCalculator 
                    onClose={handleBack}
                    category="all"
                    language={language}
                    initialTab="guide"
                    standalone={true}
                />
            </div>
        </div>
    );
};

// Export the SizeGuidePage component as the default export
export default SizeGuidePage;