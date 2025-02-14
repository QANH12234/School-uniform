// Import necessary modules and components
import React, { useState } from 'react';
import './NewsLetter.css';
import { toast } from 'react-toastify';

// Define the NewsLetter component
const NewsLetter = () => {
    // State to manage email input and loading status
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    // Get the language setting from the document or default to 'en'
    const language = document.documentElement.lang || 'en';

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) return;

        setLoading(true);
        try {
            // Simulate newsletter subscription process
            await new Promise(resolve => setTimeout(resolve, 1000));
            // Show success message 
            toast.success(
                language === 'en' 
                    ? 'Successfully subscribed to newsletter!' 
                    : 'Đã đăng ký nhận bản tin thành công!'
            );
            // Clear the email input field
            setEmail('');
        } catch (error) {
            // Show error message 
            toast.error(
                language === 'en'
                    ? 'Failed to subscribe. Please try again.'
                    : 'Đăng ký thất bại. Vui lòng thử lại.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="newsletter">
            <div className="newsletter-content">
                <div className="newsletter-text">
                    <h2>
                        {/* Display heading  */}
                        {language === 'en'
                            ? 'Stay Updated with School Uniforms'
                            : 'Cập Nhật về Đồng Phục Học Sinh'}
                    </h2>
                    <p>
                        {/* Display subheading  */}
                        {language === 'en'
                            ? 'Subscribe to receive exclusive offers, new arrivals, and uniform care tips'
                            : 'Đăng ký để nhận ưu đãi độc quyền, sản phẩm mới và mẹo chăm sóc đồng phục'}
                    </p>
                </div>
                <form onSubmit={handleSubmit} className="newsletter-form">
                    <div className="input-group">
                        <div className="email-input-wrapper">
                            {/* Email input field */}
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder={language === 'en' ? 'Enter your email' : 'Nhập email của bạn'}
                                required
                                aria-label={language === 'en' ? 'Email subscription input' : 'Ô nhập email đăng ký'}
                            />
                            {/* Submit button */}
                            <button 
                                type="submit" 
                                disabled={loading}
                                aria-label={language === 'en' ? 'Subscribe to newsletter' : 'Đăng ký nhận bản tin'}
                            >
                                {loading ? (
                                    // Show loading spinner if loading
                                    <span className="loading-spinner"></span>
                                ) : (
                                    // Display button text 
                                    language === 'en' ? 'Subscribe' : 'Đăng Ký'
                                )}
                            </button>
                        </div>
                    </div>
                    <div className="newsletter-benefits">
                        {/* Display benefits e */}
                        <div className="benefit-item">
                            <span className="benefit-icon">🎁</span>
                            <span className="benefit-text">
                                {language === 'en' ? 'Exclusive Offers' : 'Ưu Đãi Độc Quyền'}
                            </span>
                        </div>
                        <div className="benefit-item">
                            <span className="benefit-icon">📦</span>
                            <span className="benefit-text">
                                {language === 'en' ? 'New Arrivals' : 'Sản Phẩm Mới'}
                            </span>
                        </div>
                        <div className="benefit-item">
                            <span className="benefit-icon">💡</span>
                            <span className="benefit-text">
                                {language === 'en' ? 'Care Tips' : 'Mẹo Chăm Sóc'}
                            </span>
                        </div>
                    </div>
                </form>
            </div>
        </section>
    );
};

// Export the NewsLetter component
export default NewsLetter;