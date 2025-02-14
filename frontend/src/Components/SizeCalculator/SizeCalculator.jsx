// Import necessary modules and styles
import React, { useState } from 'react';
import './SizeCalculator.css';

// Define the SizeCalculator component
const SizeCalculator = ({ 
    onClose, // Function to call when closing the calculator
    category = 'all', // Category of clothing (default is 'all')
    onSizeSelect, // Function to call when a size is selected
    language = 'en', // Language for labels (default is English)
    initialTab = 'calculator', // Initial active tab (default is 'calculator')
    standalone = false // Boolean to determine if the component is standalone
}) => {
    // State to store user measurements
    const [measurements, setMeasurements] = useState({
        height: '', // User's height
        weight: '', // User's weight
        age: '' // User's age
    });

    // State to store the recommended size
    const [recommendedSize, setRecommendedSize] = useState(null);

    // State to store the active tab
    const [activeTab, setActiveTab] = useState(initialTab);

    // Function to calculate the recommended size based on measurements
    const calculateSize = () => {
        const { height, weight, age } = measurements;
        
        // Ensure all measurements are provided
        if (!height || !weight || !age) {
            return;
        }

        let size;
        const numHeight = parseFloat(height);
        const numWeight = parseFloat(weight);
        const numAge = parseFloat(age);
        
        // Determine size based on category and measurements
        if (category === 'primary' || category === 'pe') {
            // Size calculation for primary or PE category
            if (numHeight < 120) size = '4';
            else if (numHeight < 130) size = '6';
            else if (numHeight < 140) size = '8';
            else if (numHeight < 150) size = '10';
            else if (numHeight < 160) size = '12';
            else if (numHeight < 170) size = '14';
            else size = '16';

            // Adjust size based on weight
            if (numWeight > (numHeight - 100)) {
                const sizes = ['4', '6', '8', '10', '12', '14', '16'];
                const currentIndex = sizes.indexOf(size);
                if (currentIndex < sizes.length - 1) {
                    size = sizes[currentIndex + 1];
                }
            }
        } else {
            // Size calculation for secondary and sixth form category
            if (numHeight < 155) size = 'XS';
            else if (numHeight < 165) size = 'S';
            else if (numHeight < 175) size = 'M';
            else if (numHeight < 185) size = 'L';
            else if (numHeight < 195) size = 'XL';
            else size = '2XL';

            // Adjust size based on weight
            if (numWeight > (numHeight - 100 + 10)) {
                const sizes = ['XS', 'S', 'M', 'L', 'XL', '2XL'];
                const currentIndex = sizes.indexOf(size);
                if (currentIndex < sizes.length - 1) {
                    size = sizes[currentIndex + 1];
                }
            }
        }

        // Set the recommended size
        setRecommendedSize(size);
    };

    // Function to get the size guide based on category
    const getSizeGuide = () => {
        if (category === 'primary' || category === 'pe') {
            // Size guide for primary or PE category
            return [
                { size: '4', height: '110-120', age: '4-5', chest: '56-61' },
                { size: '6', height: '120-130', age: '5-6', chest: '61-66' },
                { size: '8', height: '130-140', age: '7-8', chest: '66-71' },
                { size: '10', height: '140-150', age: '9-10', chest: '71-76' },
                { size: '12', height: '150-160', age: '11-12', chest: '76-81' },
                { size: '14', height: '160-170', age: '13-14', chest: '81-86' },
                { size: '16', height: '170+', age: '15+', chest: '86-91' }
            ];
        } else {
            // Size guide for secondary and sixth form category
            return [
                { size: 'XS', height: '150-160', chest: '81-86', waist: '66-71' },
                { size: 'S', height: '160-165', chest: '86-91', waist: '71-76' },
                { size: 'M', height: '165-170', chest: '91-97', waist: '76-81' },
                { size: 'L', height: '170-180', chest: '97-102', waist: '81-86' },
                { size: 'XL', height: '180-190', chest: '102-107', waist: '86-91' },
                { size: '2XL', height: '190+', chest: '107-112', waist: '91-97' }
            ];
        }
    };

    // Render the component
    return (
        <div className="size-calculator">
            <div className="calculator-tabs">
                <button 
                    className={`tab-btn ${activeTab === 'calculator' ? 'active' : ''}`}
                    onClick={() => setActiveTab('calculator')}
                >
                    {language === 'vi' ? 'Tính Size' : 'Size Calculator'}
                </button>
                <button 
                    className={`tab-btn ${activeTab === 'guide' ? 'active' : ''}`}
                    onClick={() => setActiveTab('guide')}
                >
                    {language === 'vi' ? 'Bảng Size' : 'Size Guide'}
                </button>
            </div>

            {activeTab === 'calculator' ? (
                <div className="calculator-section">
                    <h2>{language === 'vi' ? 'Tính Size' : 'Size Calculator'}</h2>
                    <div className="calculator-form">
                        <div className="form-group">
                            <label>{language === 'vi' ? 'Chiều cao (cm)' : 'Height (cm)'}</label>
                            <input
                                type="number"
                                value={measurements.height}
                                onChange={(e) => setMeasurements(prev => ({
                                    ...prev,
                                    height: e.target.value
                                }))}
                                placeholder={language === 'vi' ? 'Nhập chiều cao' : 'Enter height'}
                            />
                        </div>
                        <div className="form-group">
                            <label>{language === 'vi' ? 'Cân nặng (kg)' : 'Weight (kg)'}</label>
                            <input
                                type="number"
                                value={measurements.weight}
                                onChange={(e) => setMeasurements(prev => ({
                                    ...prev,
                                    weight: e.target.value
                                }))}
                                placeholder={language === 'vi' ? 'Nhập cân nặng' : 'Enter weight'}
                            />
                        </div>
                        <div className="form-group">
                            <label>{language === 'vi' ? 'Tuổi' : 'Age'}</label>
                            <input
                                type="number"
                                value={measurements.age}
                                onChange={(e) => setMeasurements(prev => ({
                                    ...prev,
                                    age: e.target.value
                                }))}
                                placeholder={language === 'vi' ? 'Nhập tuổi' : 'Enter age'}
                            />
                        </div>
                        <button 
                            className="calculate-btn"
                            onClick={calculateSize}
                        >
                            {language === 'vi' ? 'Tính Size' : 'Calculate Size'}
                        </button>
                    </div>
                    {recommendedSize && (
                        <div className="size-result">
                            <h3>{language === 'vi' ? 'Size Phù Hợp' : 'Recommended Size'}</h3>
                            <p className="size">{recommendedSize}</p>
                            {!standalone && onSizeSelect && (
                                <button 
                                    className="select-size-btn"
                                    onClick={() => {
                                        onSizeSelect(recommendedSize);
                                        onClose && onClose();
                                    }}
                                >
                                    {language === 'vi' ? 'Chọn Size Này' : 'Select This Size'}
                                </button>
                            )}
                        </div>
                    )}
                </div>
            ) : (
                <div className="guide-section">
                    <h2>{language === 'vi' ? 'Bảng Size' : 'Size Guide'}</h2>
                    <div className="size-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>{language === 'vi' ? 'Size' : 'Size'}</th>
                                    <th>{language === 'vi' ? 'Chiều cao (cm)' : 'Height (cm)'}</th>
                                    {(category === 'primary' || category === 'pe' || category === 'all') ? (
                                        <>
                                            <th>{language === 'vi' ? 'Tuổi' : 'Age'}</th>
                                            <th>{language === 'vi' ? 'Ngực (cm)' : 'Chest (cm)'}</th>
                                        </>
                                    ) : (
                                        <>
                                            <th>{language === 'vi' ? 'Ngực (cm)' : 'Chest (cm)'}</th>
                                            <th>{language === 'vi' ? 'Eo (cm)' : 'Waist (cm)'}</th>
                                        </>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {getSizeGuide().map((row, index) => (
                                    <tr key={index}>
                                        <td>{row.size}</td>
                                        <td>{row.height}</td>
                                        {(category === 'primary' || category === 'pe' || category === 'all') ? (
                                            <>
                                                <td>{row.age}</td>
                                                <td>{row.chest}</td>
                                            </>
                                        ) : (
                                            <>
                                                <td>{row.chest}</td>
                                                <td>{row.waist}</td>
                                            </>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

// Export the SizeCalculator component
export default SizeCalculator;