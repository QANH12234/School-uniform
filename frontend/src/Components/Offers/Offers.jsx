// Import necessary modules and components
import React from 'react';
import { Link } from 'react-router-dom';
import './Offers.css';
import p25_img from '../Assets/product_25.png'; // Import a school uniform image

// Define the Offers component
const Offers = () => {
    // Get the language setting from the document or default to 'en'
    const language = document.documentElement.lang || 'en';

    return (
        <section className="offers">
            <div className="offers-content">
                <div className="offers-text">
                    <h2>
                        {/* Display heading */}
                        {language === 'en' 
                            ? 'Special Offers'
                            : 'Ưu Đãi Đặc Biệt'}
                    </h2>
                    <div className="offers-description">
                        <p>
                            {/* Display offer description */}
                            {language === 'en'
                                ? 'Save up to 20% on selected school uniforms'
                                : 'Tiết kiệm đến 20% cho đồng phục được chọn'}
                        </p>
                        <ul className="offers-features">
                            <li>
                                {/* Display feature */}
                                {language === 'en'
                                    ? '✓ Free shipping on orders over £50'
                                    : '✓ Miễn phí vận chuyển cho đơn hàng trên £50'}
                            </li>
                            <li>
                                {/* Display feature */}
                                {language === 'en'
                                    ? '✓ Easy returns within 30 days'
                                    : '✓ Dễ dàng đổi trả trong vòng 30 ngày'}
                            </li>
                            <li>
                                {/* Display feature */}
                                {language === 'en'
                                    ? '✓ Size guarantee for growing children'
                                    : '✓ Đảm bảo size cho trẻ em đang lớn'}
                            </li>
                        </ul>
                    </div>
                    {/* Link to the products page */}
                    <Link to="/products" className="offers-button">
                        {language === 'en' ? 'Shop Now' : 'Mua Ngay'}
                    </Link>
                </div>
                <div className="offers-image">
                    {/* Display product image */}
                    <img src={p25_img} alt={language === 'en' ? 'School Uniform' : 'Đồng phục học sinh'} />
                    <div className="discount-badge">
                        {/* Display discount badge */}
                        <span>-20%</span>
                    </div>
                    <div className="limited-time">
                        {/* Display limited time offer text */}
                        {language === 'en' ? 'Limited Time Offer' : 'Ưu Đãi Có Hạn'}
                    </div>
                </div>
            </div>
        </section>
    );
};

// Export the Offers component
export default Offers;
