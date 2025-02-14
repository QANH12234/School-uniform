// Import necessary modules and components
import React, { useState, useEffect } from 'react';
import './Navbar.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import { toast } from 'react-toastify';
import logo from '../Assets/logo.png';
import cart_icon from '../Assets/cart_icon.png';

// Define the Navbar component
const Navbar = () => {
    // State to manage user authentication, menu selection, cart count, and search query
    const { user, logout, isAuthenticated } = useAuth();
    const [menu, setMenu] = useState("shop");
    const [cartCount, setCartCount] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const location = useLocation();
    const navigate = useNavigate();

    // Update menu based on current location
    useEffect(() => {
        const path = location.pathname.substring(1);
        if (path) setMenu(path);
    }, [location]);

    // Update cart count based on local storage
    useEffect(() => {
        const updateCartCount = () => {
            const cartItems = JSON.parse(localStorage.getItem('cartItems') || '{}');
            const count = Object.values(cartItems).reduce((total, item) => total + item, 0);
            setCartCount(count);
        };
        updateCartCount();
        window.addEventListener('storage', updateCartCount);
        return () => window.removeEventListener('storage', updateCartCount);
    }, []);

    // Handle search form submission
    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    // Handle user authentication (login/logout)
    const handleAuth = () => {
        if (isAuthenticated) {
            logout();
            toast.success('Logged out successfully');
            navigate('/');
        } else {
            navigate('/login');
        }
    };

    return (
        <div className='navbar'>
            <div className="nav-main">
                <div className="nav-logo">
                    {/* Link to the home page with logo */}
                    <Link to='/'><img src={logo} alt="School Uniform Store" /></Link>
                </div>
                
                <form className="search-bar" onSubmit={handleSearch}>
                    {/* Search input field */}
                    <input
                        type="search"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button type="submit">🔍</button>
                </form>

                <ul className="nav-menu">
                    {/* Navigation links */}
                    <li onClick={() => {setMenu("primary")}}>
                        <Link to='/primary'>
                            <span className={menu === "primary" ? "active" : ""}>Primary</span>
                        </Link>
                    </li>
                    <li onClick={() => {setMenu("secondary")}}>
                        <Link to='/secondary'>
                            <span className={menu === "secondary" ? "active" : ""}>Secondary</span>
                        </Link>
                    </li>
                    <li onClick={() => {setMenu("sixth")}}>
                        <Link to='/sixth'>
                            <span className={menu === "sixth" ? "active" : ""}>Sixth Form</span>
                        </Link>
                    </li>
                    <li onClick={() => {setMenu("size-guide")}}>
                        <Link to='/size-guide'>
                            <span className={menu === "size-guide" ? "active" : ""}>Size Guide</span>
                        </Link>
                    </li>
                </ul>

                <div className="nav-login-cart">
                    {/* Login/Logout button */}
                    <button onClick={handleAuth} className="auth-button">
                        {isAuthenticated ? `Logout (${user?.name})` : 'Login'}
                    </button>
                    {/* Link to the cart page with cart icon */}
                    <Link to='/cart' className="cart-icon">
                        <img src={cart_icon} alt="Shopping Cart" />
                        {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
                    </Link>
                </div>
            </div>
        </div>
    );
};

// Export the Navbar component
export default Navbar;