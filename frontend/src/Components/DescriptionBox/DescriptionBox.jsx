// Import necessary modules and components
import React from 'react';
import './DescriptionBox.css'

// Define the DescriptionBox component
const DescriptionBox = () => {
    return (
        <div className='descriptionbox'>
            <div className="descriptionbox-navigator">
                {/* Navigation tabs for description and reviews */}
                <div className="descriptionbox-nav-box">Description</div>
                <div className="descriptionbox-nav-box fade">Reviews (122)</div>
            </div>
            <div className="descriptionbox-description">
                {/* Description content */}
                <p>We believe that the image of students wearing uniforms will give those around them positive and lasting impressions of the school. Students who dress neatly will not only receive respect from those around them but will also create a good impression on the school because they wear the school uniform.</p>
            </div>
        </div>
    );
};

// Export the DescriptionBox component
export default DescriptionBox;
