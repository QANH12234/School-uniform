const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const { sendOrderConfirmation, sendLowStockAlert } = require('../utils/emailService');
const jwt = require('jsonwebtoken');

// Get all orders (admin only)
router.get('/', adminAuth, async (req, res) => {
    try {
        const orders = await Order.find()
            .sort({ createdAt: -1 })
            .populate('items.productId', 'name image price stock');
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

// Get user's orders - This needs to be BEFORE the /:orderId route
router.get('/my-orders', auth, async (req, res) => {
    try {
        const orders = await Order.find({ 'customer.email': req.user.email })
            .sort({ createdAt: -1 })
            .populate('items.productId', 'name image price');
        
        res.json(orders);
    } catch (error) {
        console.error('Error fetching user orders:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

// Test email route
router.post('/test-email', async (req, res) => {
    try {
        // Test product for low stock alert
        const testProduct = {
            name: 'Test Product',
            stock: 5
        };

        // Send test emails
        await sendLowStockAlert(testProduct);
        
        res.json({ 
            success: true, 
            message: 'Test emails sent successfully' 
        });
    } catch (error) {
        console.error('Test email error:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// Get single order - This should come AFTER specific routes
router.get('/:orderId', async (req, res) => {
    try {
        const order = await Order.findOne({ orderId: req.params.orderId })
            .populate('items.productId', 'name image price stock');
        
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Check admin token first
        const authToken = req.headers.authorization?.split(' ')[1];
        if (!authToken) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        try {
            const decoded = jwt.verify(authToken, process.env.JWT_SECRET);
            if (decoded.isAdmin) {
                return res.json(order);
            }
            
            // Regular user authentication
            if (order.customer.email !== decoded.email) {
                return res.status(403).json({ error: 'Access denied' });
            }
            res.json(order);
        } catch (err) {
            return res.status(401).json({ error: 'Invalid token' });
        }
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ error: 'Failed to fetch order' });
    }
});

// Create new order
router.post('/', auth, async (req, res) => {
    try {
        const { customer, items, total, paymentMethod } = req.body;

        // Basic validation
        if (!items || !total) {
            return res.status(400).json({ 
                success: false,
                error: 'Items and total are required' 
            });
        }

        // Check stock availability and update stock
        for (const item of items) {
            const product = await Product.findById(item.productId);
            if (!product) {
                return res.status(400).json({
                    success: false,
                    error: `Product not found: ${item.productId}`
                });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    error: `Not enough stock for product: ${product.name}`
                });
            }

            // Update stock
            product.stock -= item.quantity;
            await product.save();

            // Check if stock is low and send alert
            if (product.stock <= 10) {
                await sendLowStockAlert(product);
            }
        }

        // Create order
        const order = new Order({
            customer,
            items,
            total,
            paymentMethod
        });

        await order.save();

        // Send order confirmation email
        await sendOrderConfirmation(order);

        res.status(201).json({
            success: true,
            order: {
                orderId: order.orderId,
                total: order.total,
                status: order.status,
                paymentStatus: order.paymentStatus
            }
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to create order'
        });
    }
});

// Update order status (admin only)
router.patch('/:orderId/status', adminAuth, async (req, res) => {
    try {
        const order = await Order.findOne({ orderId: req.params.orderId });
        
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        order.status = req.body.status;
        await order.save();
        
        res.json(order);
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ error: 'Failed to update order status' });
    }
});

// Update payment status (admin only)
router.patch('/:orderId/payment', adminAuth, async (req, res) => {
    try {
        const order = await Order.findOne({ orderId: req.params.orderId });
        
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        order.paymentStatus = req.body.paymentStatus;
        await order.save();
        
        res.json(order);
    } catch (error) {
        console.error('Error updating payment status:', error);
        res.status(500).json({ error: 'Failed to update payment status' });
    }
});

module.exports = router; 