// Import necessary modules and components
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import footer_logo from '../Assets/logo_big.png';
import instagram_icon from '../Assets/instagram_icon.png';
import pintester_icon from '../Assets/pintester_icon.png';
import whatsapp_icon from '../Assets/whatsapp_icon.png';

// Define the Footer component
const Footer = () => {
    // State to manage language, email input, and subscription status
    const [language, setLanguage] = useState('en');
    const [email, setEmail] = useState('');
    const [subscribeStatus, setSubscribeStatus] = useState('');

    // Set language based on document's language setting
    useEffect(() => {
        const htmlLang = document.documentElement.lang;
        if (htmlLang) {
            setLanguage(htmlLang);
        }
    }, []);

    // Handle newsletter subscription
    const handleSubscribe = (e) => {
        e.preventDefault();
        if (email) {
            // Simulate API call for newsletter subscription
            setSubscribeStatus('success');
            setEmail('');
            setTimeout(() => setSubscribeStatus(''), 3000);
        }
    };

    // Footer links data
    const footerLinks = {
        company: {
            title: { en: 'Company', vi: 'Công ty' },
            links: [
                { en: 'About Us', vi: 'Về chúng tôi', path: '/about' },
                { en: 'Contact', vi: 'Liên hệ', path: '/contact' },
                { en: 'Careers', vi: 'Tuyển dụng', path: '/careers' },
                { en: 'Store Locations', vi: 'Vị trí cửa hàng', path: '/locations' }
            ]
        },
        support: {
            title: { en: 'Support', vi: 'Hỗ trợ' },
            links: [
                { en: 'Size Guide', vi: 'Hướng dẫn size', path: '/size-guide' },
                { en: 'Shipping Info', vi: 'Thông tin vận chuyển', path: '/shipping' },
                { en: 'Returns', vi: 'Đổi trả', path: '/returns' },
                { en: 'FAQ', vi: 'Câu hỏi thường gặp', path: '/faq' }
            ]
        },
        legal: {
            title: { en: 'Legal', vi: 'Pháp lý' },
            links: [
                { en: 'Terms & Conditions', vi: 'Điều khoản & Điều kiện', path: '/terms' },
                { en: 'Privacy Policy', vi: 'Chính sách bảo mật', path: '/privacy' },
                { en: 'Cookie Policy', vi: 'Chính sách cookie', path: '/cookies' }
            ]
        }
    };

    // Social media links data
    const socialLinks = [
        { icon: instagram_icon, name: 'Instagram', url: 'https://instagram.com' },
        { icon: pintester_icon, name: 'Pinterest', url: 'https://pinterest.com' },
        { icon: whatsapp_icon, name: 'WhatsApp', url: 'https://whatsapp.com' }
    ];

    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-main">
                    <div className="footer-info">
                        {/* Link to the home page with logo */}
                        <Link to="/" className="footer-logo">
                            <img src={footer_logo} alt="School Uniform Store" />
                        </Link>
                        <p className="footer-description">
                            {language === 'en' 
                                ? 'Your trusted source for quality British International School uniforms.'
                                : 'Nguồn cung cấp đồng phục trường Quốc tế Anh uy tín.'}
                        </p>
                    </div>

                    <div className="footer-links-container">
                        {/* Map through footer links sections */}
                        {Object.values(footerLinks).map((section, index) => (
                            <div key={index} className="footer-links-section">
                                <h3>{section.title[language]}</h3>
                                <ul>
                                    {/* Map through links in each section */}
                                    {section.links.map((link, linkIndex) => (
                                        <li key={linkIndex}>
                                            <Link to={link.path}>{link[language]}</Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <div className="footer-newsletter">
                        <h3>{language === 'en' ? 'Newsletter' : 'Bản tin'}</h3>
                        <p>
                            {language === 'en'
                                ? 'Subscribe for exclusive offers and updates'
                                : 'Đăng ký để nhận ưu đãi và cập nhật độc quyền'}
                        </p>
                        <form onSubmit={handleSubscribe} className="newsletter-form">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder={language === 'en' ? 'Your email' : 'Email của bạn'}
                                required
                            />
                            <button type="submit">
                                {language === 'en' ? 'Subscribe' : 'Đăng ký'}
                            </button>
                        </form>
                        {subscribeStatus === 'success' && (
                            <p className="subscribe-success">
                                {language === 'en'
                                    ? 'Thank you for subscribing!'
                                    : 'Cảm ơn bạn đã đăng ký!'}
                            </p>
                        )}
                    </div>
                </div>

                <div className="footer-bottom">
                    <div className="footer-social">
                        {/* Map through social media links */}
                        {socialLinks.map((social, index) => (
                            <a
                                key={index}
                                href={social.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="social-link"
                                aria-label={social.name}
                            >
                                <img src={social.icon} alt={social.name} />
                            </a>
                        ))}
                    </div>

                    <div className="footer-copyright">
                        <p>
                            &copy; {new Date().getFullYear()} {language === 'en'
                                ? 'British International School Uniform Store. All rights reserved.'
                                : 'Cửa hàng Đồng phục Trường Quốc tế Anh. Bảo lưu mọi quyền.'}
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

// Export the Footer component
export default Footer;