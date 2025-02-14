// Import necessary modules and components from React, react-router-dom, and react-toastify
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CSS/Orders.css';
import { toast } from 'react-toastify';

// Define the Orders functional component
const Orders = () => {
    // Use the useNavigate hook to get the navigate function for programmatic navigation
    const navigate = useNavigate();
    // Define state variables for orders, loading status, and error message
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // useEffect hook to fetch orders when the component mounts or when navigate changes
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                // Get the authentication token from local storage
                const token = localStorage.getItem('auth-token');
                // If no token or a guest token is found, show an error toast and navigate to the login page
                if (!token || token === 'guest-token') {
                    toast.error('Please login to view orders');
                    navigate('/login');
                    return;
                }

                // Log the token for debugging purposes
                console.log('Auth token:', token);

                // Fetch orders from the API
                const response = await fetch('http://localhost:4000/api/orders/my-orders', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    }
                });

                // If the response is not OK, throw an error
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to fetch orders');
                }

                // Parse the response data and set the orders state
                const data = await response.json();
                console.log('Orders data:', data); // Debug log
                setOrders(data);
            } catch (err) {
                // Log the error, set the error state, and show an error toast
                console.error('Error fetching orders:', err);
                setError(err.message);
                toast.error(err.message);
            } finally {
                // Set the loading state to false
                setLoading(false);
            }
        };

        // Call the fetchOrders function
        fetchOrders();
    }, [navigate]);

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

    // If the component is in a loading state, render a loading indicator
    if (loading) {
        return (
            <div className="orders-loading">
                <div className="loader"></div>
                <p>Loading your orders...</p>
            </div>
        );
    }

    // If there is an error, render an error message
    if (error) {
        return (
            <div className="orders-error">
                <h2>Error</h2>
                <p>{error}</p>
                <button onClick={() => navigate('/')}>Continue Shopping</button>
            </div>
        );
    }

    // If no orders are found, render a no orders message
    if (!orders.length) {
        return (
            <div className="no-orders">
                <h2>No Orders Found</h2>
                <p>You haven't placed any orders yet.</p>
                <button onClick={() => navigate('/')}>Start Shopping</button>
            </div>
        );
    }

    // Return the JSX to render the orders page
    return (
        <div className="orders-container">
            <h1>My Orders</h1>
            <div className="orders-list">
                {orders.map((order) => (
                    <div key={order.orderId} className="order-card">
                        <div className="order-header">
                            <div className="order-info">
                                <h3>Order #{order.orderId}</h3>
                                <p className="order-date">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            <span className={`order-status ${getStatusClass(order.status)}`}>
                                {order.status}
                            </span>
                        </div>

                        <div className="order-items">
                            {order.items.map((item, index) => (
                                <div key={index} className="order-item-preview">
                                    <img 
                                        src={item.productId.image} 
                                        alt={item.productId.name}
                                    />
                                    <div className="item-info">
                                        <p className="item-name">{item.productId.name}</p>
                                        <p className="item-details">
                                            Size: {item.size} | Quantity: {item.quantity}
                                        </p>
                                    </div>
                                    <p className="item-price">${item.price}</p>
                                </div>
                            ))}
                        </div>

                        <div className="order-footer">
                            <div className="order-total">
                                <span>Total:</span>
                                <span className="total-amount">${order.total}</span>
                            </div>
                            <button 
                                onClick={() => navigate(`/orders/${order.orderId}`)}
                                className="view-details-btn"
                            >
                                View Details
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Export the Orders component as the default export
export default Orders;