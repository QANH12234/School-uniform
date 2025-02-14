import React, { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Typography,
    Box,
    Chip
} from '@mui/material';
import { format } from 'date-fns';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch orders when component mounts
    useEffect(() => {
        fetchOrders();
    }, []);

    // Function to fetch orders from the server
    const fetchOrders = async () => {
        try {
            const response = await fetch('/api/orders', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                }
            });
            
            if (!response.ok) throw new Error('Failed to fetch orders');
            
            const data = await response.json();
            setOrders(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Function to get status color
    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'warning';
            case 'processing': return 'info';
            case 'shipped': return 'primary';
            case 'delivered': return 'success';
            case 'cancelled': return 'error';
            default: return 'default';
        }
    };

    // Function to get payment status color
    const getPaymentStatusColor = (status) => {
        switch (status) {
            case 'paid': return 'success';
            case 'pending': return 'warning';
            case 'failed': return 'error';
            default: return 'default';
        }
    };

    if (loading) return <Typography>Loading orders...</Typography>;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom>Orders</Typography>
            
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Order ID</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Customer</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Items</TableCell>
                            <TableCell>Total</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Payment</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.map((order) => (
                            <TableRow key={order.orderId}>
                                <TableCell>{order.orderId}</TableCell>
                                <TableCell>
                                    {format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm')}
                                </TableCell>
                                <TableCell>
                                    {order.customer.name}
                                </TableCell>
                                <TableCell>
                                    {order.customer.email}
                                </TableCell>
                                <TableCell>
                                    <ul style={{ margin: 0, paddingLeft: 20 }}>
                                        {order.items.map((item, index) => (
                                            <li key={index}>
                                                {item.productId.name} - {item.quantity} units
                                            </li>
                                        ))}
                                    </ul>
                                </TableCell>
                                <TableCell>${order.total}</TableCell>
                                <TableCell>
                                    <Chip 
                                        label={order.status}
                                        color={getStatusColor(order.status)}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Chip 
                                        label={order.paymentStatus}
                                        color={getPaymentStatusColor(order.paymentStatus)}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Button 
                                        variant="outlined" 
                                        size="small"
                                        href={`/admin/orders/${order.orderId}`}
                                    >
                                        View Details
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default Orders;