// Import necessary modules and components from React, react-router-dom, and react-toastify
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './CSS/OrderConfirmation.css';
import { toast } from 'react-toastify';

// Define the OrderConfirmation functional component
const OrderConfirmation = () => {
    // Use the useLocation hook to access the current location object
    const location = useLocation();
    // Use the useNavigate hook to get the navigate function for programmatic navigation
    const navigate = useNavigate();
    // Extract the orderId from the location state
    const orderId = location.state?.orderId;

    // useEffect hook to perform side effects when the component mounts or when orderId or navigate changes
    useEffect(() => {
        // If orderId is not present, show an error toast and navigate to the home page
        if (!orderId) {
            toast.error('No order information found');
            navigate('/');
            return;
        }
        
        // Store the order ID in session storage for persistence
        sessionStorage.setItem('lastOrderId', orderId);
        
        // Log the order confirmation for debugging purposes
        console.log('Order confirmed:', orderId);
    }, [orderId, navigate]);

    // If orderId is not present, return null to render nothing
    if (!orderId) {
        return null;
    }

    // Handler function to navigate to the orders page and highlight the current order
    const handleViewOrder = () => {
        navigate('/orders', { state: { highlightOrderId: orderId } });
    };

    // Return the JSX to render the order confirmation page
    return (
        <div className="order-confirmation">
            <div className="confirmation-content">
                <div className="success-icon">✓</div>
                <h1>Order Confirmed!</h1>
                <p className="order-id">Order ID: {orderId}</p>
                <p className="thank-you">Thank you for your purchase!</p>
                <p className="confirmation-message">
                    We've received your order and will send you an email confirmation shortly.
                </p>
                <div className="next-steps">
                    <h2>What's Next?</h2>
                    <ul>
                        <li>You will receive an email with your order details</li>
                        <li>We will process your order within 24 hours</li>
                        <li>Shipping updates will be sent to your email</li>
                    </ul>
                </div>
                <div className="confirmation-buttons">
                    <button onClick={() => navigate('/')} className="continue-shopping">
                        Continue Shopping
                    </button>
                    <button onClick={handleViewOrder} className="view-order">
                        View Order
                    </button>
                </div>
            </div>
        </div>
    );
};

// Export the OrderConfirmation component as the default export
export default OrderConfirmation;