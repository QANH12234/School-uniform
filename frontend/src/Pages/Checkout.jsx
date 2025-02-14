// Import necessary modules and components
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../Context/ShopContext';
import './CSS/Checkout.css';
import { toast } from 'react-toastify';

// Define the Checkout component
const Checkout = () => {
    // Hook to navigate programmatically
    const navigate = useNavigate();

    // Destructure context values from ShopContext
    const { cartItems, getTotalCartAmount, all_product, setCartItems, clearCart } = useContext(ShopContext);

    // State to store form data
    const [formData, setFormData] = useState({
        firstName: '', // User's first name
        lastName: '', // User's last name
        email: '', // User's email
        phone: '', // User's phone number
        address: '', // Shipping address
        city: '', // City
        country: '', // Country
        zipCode: '', // ZIP code
        paymentMethod: 'card' // Payment method (default is 'card')
    });

    // Effect to validate cart items when component mounts
    useEffect(() => {
        const invalidItems = cartItems.items.filter(item => 
            !all_product.some(p => p._id === item.productId || p.id === item.productId)
        );

        if (invalidItems.length > 0) {
            toast.error('Some items in your cart are no longer available. Please review your cart.');
            navigate('/cart');
            return;
        }
    }, [cartItems, all_product, navigate]);

    // Handle input change in the form
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const token = localStorage.getItem('auth-token');
            if (!token) {
                toast.error('Please login to continue');
                navigate('/login');
                return;
            }

            // Validate all products exist before proceeding
            const invalidItems = [];
            const orderItems = cartItems.items.map(item => {
                const product = all_product.find(p => p._id === item.productId || p.id === item.productId);
                if (!product) {
                    invalidItems.push(item.productId);
                    return null;
                }
                return {
                    productId: product._id || product.id,
                    quantity: parseInt(item.quantity) || 1,
                    size: item.size || 'M',
                    price: parseFloat(product.new_price) || 0
                };
            }).filter(Boolean);

            if (invalidItems.length > 0) {
                toast.error('Some items in your cart are no longer available. Please review your cart.');
                navigate('/cart');
                return;
            }

            // Create order data matching MongoDB schema
            const orderData = {
                customer: {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    phone: formData.phone,
                    address: formData.address,
                    city: formData.city,
                    country: formData.country,
                    zipCode: formData.zipCode
                },
                items: orderItems,
                total: parseFloat(getTotalCartAmount()),
                paymentMethod: formData.paymentMethod || 'card',
                status: 'pending',
                paymentStatus: 'pending'
            };

            console.log('Sending order data:', orderData);

            // Send to backend
            const response = await fetch('http://localhost:4000/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(orderData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Could not place order');
            }

            const data = await response.json();
            console.log('Response from server:', response.status, data);

            // Clear cart
            localStorage.removeItem('cart');
            setCartItems({
                items: [],
                total: 0
            });
            
            toast.success('Order placed successfully!');
            navigate('/order-confirmation', { 
                state: { orderId: data.order?.orderId }
            });
        } catch (error) {
            console.error('Full error details:', error);
            toast.error(error.message || 'Could not place order. Please try again.');
        }
    };

    // Check if cart is empty
    const hasItems = cartItems?.items?.length > 0;
    
    if (!hasItems) {
        return (
            <div className="checkout-empty">
                <h2>Your cart is empty</h2>
                <p>Add some items to your cart before checking out.</p>
                <button onClick={() => navigate('/')}>Continue Shopping</button>
            </div>
        );
    }

    // Render the checkout component
    return (
        <div className="checkout-container">
            <h1>Checkout</h1>
            <div className="checkout-content">
                <form onSubmit={handleSubmit} className="checkout-form">
                    <div className="form-section">
                        <h2>Contact Information</h2>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="firstName">First Name</label>
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="lastName">Last Name</label>
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="phone">Phone</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <h2>Shipping Address</h2>
                        <div className="form-group">
                            <label htmlFor="address">Address</label>
                            <input
                                type="text"
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="city">City</label>
                                <input
                                    type="text"
                                    id="city"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="country">Country</label>
                                <input
                                    type="text"
                                    id="country"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="zipCode">ZIP Code</label>
                                <input
                                    type="text"
                                    id="zipCode"
                                    name="zipCode"
                                    value={formData.zipCode}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <h2>Payment Method</h2>
                        <div className="payment-methods">
                            <div className="payment-option">
                                <input
                                    type="radio"
                                    id="card"
                                    name="paymentMethod"
                                    value="card"
                                    checked={formData.paymentMethod === 'card'}
                                    onChange={handleInputChange}
                                />
                                <label htmlFor="card">Credit/Debit Card</label>
                            </div>
                            <div className="payment-option">
                                <input
                                    type="radio"
                                    id="paypal"
                                    name="paymentMethod"
                                    value="paypal"
                                    checked={formData.paymentMethod === 'paypal'}
                                    onChange={handleInputChange}
                                />
                                <label htmlFor="paypal">PayPal</label>
                            </div>
                        </div>
                    </div>

                    <div className="order-summary">
                        <h2>Order Summary</h2>
                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>${getTotalCartAmount()}</span>
                        </div>
                        <div className="summary-row">
                            <span>Shipping</span>
                            <span>Free</span>
                        </div>
                        <div className="summary-row total">
                            <span>Total</span>
                            <span>${getTotalCartAmount()}</span>
                        </div>
                    </div>

                    <button type="submit" className="place-order-btn">
                        Place Order
                    </button>
                </form>
            </div>
        </div>
    );
};

// Export the Checkout component
export default Checkout;