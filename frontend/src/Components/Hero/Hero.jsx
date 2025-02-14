import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';
import hand_icon from '../Assets/hand_icon.png';
import arrow_icon from '../Assets/arrow.png';
import hero_image from '../Assets/hero_image.png';

const Hero = () => {
    // State to manage language and visibility of the hero section
    const [language, setLanguage] = useState('en');
    const [isVisible, setIsVisible] = useState(false);

    // Set language based on document's language attribute and make hero section visible
    useEffect(() => {
        const htmlLang = document.documentElement.lang;
        if (htmlLang) {
            setLanguage(htmlLang);
        }
        setIsVisible(true);
    }, []);

    // Content for the hero section 
    const content = {
        heading: {
            en: 'NEW ARRIVALS ONLY',
            vi: 'HÀNG MỚI VỀ'
        },
        new: {
            en: 'new',
            vi: 'mới'
        },
        collection: {
            en: 'collection',
            vi: 'bộ sưu tập'
        },
        forEveryone: {
            en: 'for everyone',
            vi: 'cho mọi người'
        },
        latestCollection: {
            en: 'Latest Collection',
            vi: 'Bộ Sưu Tập Mới Nhất'
        },
        shopNow: {
            en: 'Shop Now',
            vi: 'Mua Ngay'
        }
    };

    return (
        <div className={`hero ${isVisible ? 'visible' : ''}`}>
            <div className="hero-left">
                <h1 className="animate-slide-down">
                    {content.heading[language]}
                </h1>
                <div className="hero-text-container animate-slide-right">
                    <div className="hero-hand-icon">
                        <p>{content.new[language]}</p>
                        <img src={hand_icon} alt="Wave" className="wave-animation" />
                    </div>
                    <p className="collection-text">{content.collection[language]}</p>
                    <p className="everyone-text">{content.forEveryone[language]}</p>
                </div>
                <div className="hero-buttons animate-slide-up">
                    <Link to="/products" className="hero-latest-btn primary-btn">
                        <span>{content.latestCollection[language]}</span>
                        <img src={arrow_icon} alt="Arrow" className="arrow-animation" />
                    </Link>
                    <Link to="/categories" className="hero-shop-btn secondary-btn">
                        <span>{content.shopNow[language]}</span>
                    </Link>
                </div>
            </div>
            <div className="hero-right animate-fade-in">
                <img 
                    src={hero_image} 
                    alt="School Uniforms Collection" 
                    className="hero-image"
                    loading="eager"
                />
            </div>
        </div>
    );
};

export default Hero;