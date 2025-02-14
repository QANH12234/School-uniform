// Import necessary modules and components from React, react-router-dom, and react-toastify
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './CSS/OrderDetails.css';
import { toast } from 'react-toastify';

// Define the OrderDetails functional component
const OrderDetails = () => {
    // Extract the orderId from the URL parameters
    const { orderId } = useParams();
    // Use the useNavigate hook to get the navigate function for programmatic navigation
    const navigate = useNavigate();
    // Define state variables for order details, loading status, and error message
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // useEffect hook to fetch order details when the component mounts or when orderId or navigate changes
    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                // Get the authentication token from local storage
                const token = localStorage.getItem('auth-token');
                // If no token is found, show an error toast and navigate to the login page
                if (!token) {
                    toast.error('Please login to view order details');
                    navigate('/login');
                    return;
                }

                // Fetch order details from the API
                const response = await fetch(`http://localhost:4000/api/orders/${orderId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                // If the response is not OK, throw an error
                if (!response.ok) {
                    throw new Error('Failed to fetch order details');
                }

                // Parse the response data and set the order state
                const data = await response.json();
                setOrder(data);
            } catch (err) {
                // Set the error state and show an error toast
                setError(err.message);
                toast.error(err.message);
            } finally {
                // Set the loading state to false
                setLoading(false);
            }
        };

        // Call the fetchOrderDetails function
        fetchOrderDetails();
    }, [orderId, navigate]);

    // If the component is in a loading state, render a loading indicator
    if (loading) {
        return (
            <div className="order-details-loading">
                <div className="loader"></div>
                <p>Loading order details...</p>
            </div>
        );
    }

    // If there is an error, render an error message
    if (error) {
        return (
            <div className="order-details-error">
                <h2>Error</h2>
                <p>{error}</p>
                <button onClick={() => navigate('/orders')}>Back to Orders</button>
            </div>
        );
    }

    // If no order is found, render a not found message
    if (!order) {
        return (
            <div className="order-not-found">
                <h2>Order Not Found</h2>
                <p>We couldn't find the order you're looking for.</p>
                <button onClick={() => navigate('/orders')}>Back to Orders</button>
            </div>
        );
    }

    // Function to get the CSS class for the order status
    const getStatusClass = (status) => {
        switch (status.toLowerCase()) {
            case 'pending': return 'status-pending';
            case 'processing': return 'status-processing';
            case 'shipped': return 'status-shipped';
            case 'delivered': return 'status-delivered';
            case 'cancelled': return 'status-cancelled';
            default: return '';
        }
    };

    // Return the JSX to render the order details page
    return (
        <div className="order-details-container">
            <div className="order-details-header">
                <h1>Order #{order.orderId}</h1>
                <span className={`order-status ${getStatusClass(order.status)}`}>
                    {order.status}
                </span>
            </div>

            <div className="order-details-content">
                <div className="order-info-section">
                    <h2>Order Information</h2>
                    <div className="info-grid">
                        <div className="info-item">
                            <label>Order Date:</label>
                            <span>{new Date(order.createdAt).toLocaleString()}</span>
                        </div>
                        <div className="info-item">
                            <label>Payment Status:</label>
                            <span className={`payment-status-${order.paymentStatus}`}>
                                {order.paymentStatus}
                            </span>
                        </div>
                        <div className="info-item">
                            <label>Payment Method:</label>
                            <span>{order.paymentMethod}</span>
                        </div>
                    </div>
                </div>

                <div className="shipping-info-section">
                    <h2>Shipping Information</h2>
                    <div className="info-grid">
                        <div className="info-item">
                            <label>Name:</label>
                            <span>{order.customer.firstName} {order.customer.lastName}</span>
                        </div>
                        <div className="info-item">
                            <label>Address:</label>
                            <span>{order.customer.address}</span>
                        </div>
                        <div className="info-item">
                            <label>City:</label>
                            <span>{order.customer.city}</span>
                        </div>
                        <div className="info-item">
                            <label>Country:</label>
                            <span>{order.customer.country}</span>
                        </div>
                        <div className="info-item">
                            <label>ZIP Code:</label>
                            <span>{order.customer.zipCode}</span>
                        </div>
                    </div>
                </div>

                <div className="order-items-section">
                    <h2>Order Items</h2>
                    <div className="order-items-list">
                        {order.items.map((item, index) => (
                            <div key={index} className="order-item">
                                <div className="item-image">
                                    <img 
                                        src={item.productId.image} 
                                        alt={item.productId.name} 
                                    />
                                </div>
                                <div className="item-details">
                                    <h3>{item.productId.name}</h3>
                                    <p>Size: {item.size}</p>
                                    <p>Quantity: {item.quantity}</p>
                                    <p>Price: ${item.price}</p>
                                </div>
                                <div className="item-total">
                                    ${(item.price * item.quantity).toFixed(2)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="order-summary">
                    <div className="summary-row">
                        <span>Subtotal:</span>
                        <span>${order.total}</span>
                    </div>
                    <div className="summary-row">
                        <span>Shipping:</span>
                        <span>Free</span>
                    </div>
                    <div className="summary-row total">
                        <span>Total:</span>
                        <span>${order.total}</span>
                    </div>
                </div>
            </div>

            <div className="order-details-actions">
                <button onClick={() => navigate('/orders')}>Back to Orders</button>
                <button onClick={() => window.print()} className="print-button">
                    Print Order
                </button>
            </div>
        </div>
    );
};

// Export the OrderDetails component as the default export
export default OrderDetails;