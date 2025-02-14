import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Paper,
    Typography,
    Grid,
    Chip,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    CircularProgress,
    Alert,
    Divider
} from '@mui/material';

const OrderDetails = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch order details when component mounts or orderId changes
    useEffect(() => {
        fetchOrderDetails();
    }, [orderId]);

    // Function to fetch order details from the server
    const fetchOrderDetails = async () => {
        try {
            const adminToken = localStorage.getItem('adminToken');
            if (!adminToken) {
                navigate('/login');
                return;
            }

            const response = await fetch(`http://localhost:4000/api/orders/${orderId}`, {
                headers: {
                    'Authorization': `Bearer ${adminToken}`
                }
            });

            if (!response.ok) {
                if (response.status === 403) {
                    throw new Error('Access denied. Please make sure you are logged in as an admin.');
                }
                throw new Error('Failed to fetch order details');
            }

            const data = await response.json();
            setOrder(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Function to handle status update
    const handleStatusUpdate = async (newStatus) => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`http://localhost:4000/api/orders/${orderId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (!response.ok) {
                throw new Error('Failed to update order status');
            }

            // Refresh order details
            fetchOrderDetails();
        } catch (err) {
            setError(err.message);
        }
    };

    // Function to get status color
    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'pending': return 'warning';
            case 'processing': return 'info';
            case 'shipped': return 'primary';
            case 'delivered': return 'success';
            case 'cancelled': return 'error';
            default: return 'default';
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box p={3}>
                <Alert severity="error">{error}</Alert>
                <Button 
                    variant="contained" 
                    onClick={() => navigate('/orders')}
                    sx={{ mt: 2 }}
                >
                    Back to Orders
                </Button>
            </Box>
        );
    }

    if (!order) {
        return (
            <Box p={3}>
                <Alert severity="info">Order not found</Alert>
                <Button 
                    variant="contained" 
                    onClick={() => navigate('/orders')}
                    sx={{ mt: 2 }}
                >
                    Back to Orders
                </Button>
            </Box>
        );
    }

    return (
        <Box p={3}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4">
                    Order #{order.orderId}
                </Typography>
                <Button 
                    variant="outlined" 
                    onClick={() => navigate('/orders')}
                >
                    Back to Orders
                </Button>
            </Box>

            <Paper elevation={2} sx={{ p: 3 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h6" gutterBottom>Order Information</Typography>
                        <Box>
                            <Typography><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</Typography>
                            <Typography>
                                <strong>Status:</strong>{' '}
                                <Chip 
                                    label={order.status} 
                                    color={getStatusColor(order.status)} 
                                    size="small" 
                                />
                            </Typography>
                            <Typography>
                                <strong>Payment Status:</strong>{' '}
                                <Chip 
                                    label={order.paymentStatus} 
                                    color={order.paymentStatus === 'paid' ? 'success' : 'warning'} 
                                    size="small" 
                                />
                            </Typography>
                            <Typography><strong>Payment Method:</strong> {order.paymentMethod}</Typography>
                            <Typography><strong>Total:</strong> ${order.total.toFixed(2)}</Typography>
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Typography variant="h6" gutterBottom>Customer Information</Typography>
                        <Box>
                            <Typography>
                                <strong>Name:</strong> {order.customer.firstName} {order.customer.lastName}
                            </Typography>
                            <Typography><strong>Email:</strong> {order.customer.email}</Typography>
                            <Typography><strong>Phone:</strong> {order.customer.phone}</Typography>
                            <Typography><strong>Address:</strong> {order.customer.address}</Typography>
                            <Typography>
                                {order.customer.city}, {order.customer.country} {order.customer.zipCode}
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid item xs={12}>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="h6" gutterBottom>Order Items</Typography>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Product</TableCell>
                                        <TableCell>Size</TableCell>
                                        <TableCell align="right">Price</TableCell>
                                        <TableCell align="right">Quantity</TableCell>
                                        <TableCell align="right">Total</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {order.items.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    {item.productId.image && (
                                                        <img 
                                                            src={item.productId.image} 
                                                            alt={item.productId.name}
                                                            style={{ width: 50, height: 50, marginRight: 10, objectFit: 'cover' }}
                                                        />
                                                    )}
                                                    {item.productId.name}
                                                </Box>
                                            </TableCell>
                                            <TableCell>{item.size}</TableCell>
                                            <TableCell align="right">${item.price}</TableCell>
                                            <TableCell align="right">{item.quantity}</TableCell>
                                            <TableCell align="right">${(item.price * item.quantity).toFixed(2)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>

                    <Grid item xs={12}>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="h6" gutterBottom>Update Status</Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button 
                                variant="contained" 
                                color="primary"
                                onClick={() => handleStatusUpdate('processing')}
                                disabled={order.status !== 'pending'}
                            >
                                Mark as Processing
                            </Button>
                            <Button 
                                variant="contained" 
                                color="info"
                                onClick={() => handleStatusUpdate('shipped')}
                                disabled={order.status !== 'processing'}
                            >
                                Mark as Shipped
                            </Button>
                            <Button 
                                variant="contained" 
                                color="success"
                                onClick={() => handleStatusUpdate('delivered')}
                                disabled={order.status !== 'shipped'}
                            >
                                Mark as Delivered
                            </Button>
                            <Button 
                                variant="contained" 
                                color="error"
                                onClick={() => handleStatusUpdate('cancelled')}
                                disabled={['delivered', 'cancelled'].includes(order.status)}
                            >
                                Cancel Order
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
};

export default OrderDetails;