import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Chip,
    Typography,
    CircularProgress,
    Alert,
    TablePagination
} from '@mui/material';
import { format } from 'date-fns';

const ViewOrders = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Fetch orders when component mounts
    useEffect(() => {
        fetchOrders();
    }, []);

    // Function to fetch orders from the server
    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await fetch('http://localhost:4000/api/orders', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch orders');
            }

            const data = await response.json();
            setOrders(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Handle page change for pagination
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    // Handle rows per page change for pagination
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
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

    // Function to handle status update
    const handleStatusUpdate = async (orderId, newStatus) => {
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

            // Refresh orders after update
            fetchOrders();
        } catch (err) {
            setError(err.message);
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
            </Box>
        );
    }

    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom>
                Orders Management
            </Typography>

            <Paper elevation={2}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Order ID</TableCell>
                                <TableCell>Customer</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell align="right">Total</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Payment</TableCell>
                                <TableCell align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orders
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((order) => (
                                <TableRow key={order.orderId}>
                                    <TableCell>{order.orderId}</TableCell>
                                    <TableCell>
                                        {order.customer ? (
                                            <>
                                                <Typography variant="body2">
                                                    {order.customer.firstName} {order.customer.lastName}
                                                </Typography>
                                                <Typography variant="caption" color="textSecondary">
                                                    {order.customer.email}
                                                </Typography>
                                            </>
                                        ) : (
                                            'N/A'
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {format(new Date(order.createdAt), 'MMM d, yyyy HH:mm')}
                                    </TableCell>
                                    <TableCell align="right">
                                        ${order.total.toFixed(2)}
                                    </TableCell>
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
                                            color={order.paymentStatus === 'paid' ? 'success' : 'warning'}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                onClick={() => navigate(`/orders/${order.orderId}`)}
                                            >
                                                View
                                            </Button>
                                            {order.status === 'pending' && (
                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    color="primary"
                                                    onClick={() => handleStatusUpdate(order.orderId, 'processing')}
                                                >
                                                    Process
                                                </Button>
                                            )}
                                            {order.status === 'processing' && (
                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    color="info"
                                                    onClick={() => handleStatusUpdate(order.orderId, 'shipped')}
                                                >
                                                    Ship
                                                </Button>
                                            )}
                                            {order.status === 'shipped' && (
                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    color="success"
                                                    onClick={() => handleStatusUpdate(order.orderId, 'delivered')}
                                                >
                                                    Deliver
                                                </Button>
                                            )}
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={orders.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </Box>
    );
};

export default ViewOrders;