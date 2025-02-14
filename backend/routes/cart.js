const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');

// Debug middleware
router.use((req, res, next) => {
    console.log('Cart Route:', {
        method: req.method,
        path: req.path,
        body: req.body,
        user: req.user
    });
    next();
});

// Get cart items
router.get('/', auth, async (req, res) => {
    try {
        const userId = req.user?.id || 'guest';
        const cart = await Cart.findOne({ userId })
            .populate('items.productId', 'name image new_price stock');
        
        if (!cart) {
            return res.json({ items: [] });
        }
        
        res.json(cart);
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ error: 'Failed to fetch cart' });
    }
});

// Add item to cart
router.post('/add', auth, async (req, res) => {
    try {
        console.log('Add to cart request:', req.body);
        const { productId, quantity = 1, size } = req.body;
        const userId = req.user?.id || 'guest';

        if (!productId || !size) {
            return res.status(400).json({
                error: 'Product ID and size are required'
            });
        }

        // Validate productId
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                error: 'Invalid product ID'
            });
        }

        // Find or create cart
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        // Check if product exists and has enough stock
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Get total quantity including existing cart items
        const existingItem = cart.items.find(item => 
            item.productId.toString() === productId && item.size === size
        );
        const totalRequestedQuantity = (existingItem ? existingItem.quantity : 0) + quantity;

        // Check if total requested quantity exceeds stock
        if (totalRequestedQuantity > product.stock) {
            return res.status(400).json({
                error: `Not enough stock available. Only ${product.stock} items remaining.`
            });
        }

        if (existingItem) {
            existingItem.quantity = totalRequestedQuantity;
        } else {
            cart.items.push({
                productId,
                quantity,
                size,
                price: product.new_price
            });
        }

        await cart.save();
        
        // Populate product details before sending response
        await cart.populate('items.productId', 'name image new_price stock');
        
        res.json({
            success: true,
            cart,
            message: 'Item added to cart successfully'
        });
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ 
            error: 'Failed to add item to cart',
            details: error.message 
        });
    }
});

// Update cart item quantity
router.patch('/update', auth, async (req, res) => {
    try {
        const { productId, quantity, size } = req.body;
        const userId = req.user.id || 'guest';

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        const item = cart.items.find(item => 
            item.productId.toString() === productId && item.size === size
        );

        if (!item) {
            return res.status(404).json({ error: 'Item not found in cart' });
        }

        const product = await Product.findById(productId);
        if (quantity > product.stock) {
            return res.status(400).json({ error: 'Not enough stock available' });
        }

        item.quantity = quantity;
        await cart.save();
        
        res.json(cart);
    } catch (error) {
        console.error('Error updating cart:', error);
        res.status(500).json({ error: 'Failed to update cart' });
    }
});

// Remove item from cart
router.delete('/remove', auth, async (req, res) => {
    try {
        const { productId, size } = req.body;
        const userId = req.user.id || 'guest';

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        cart.items = cart.items.filter(item => 
            !(item.productId.toString() === productId && item.size === size)
        );

        await cart.save();
        res.json(cart);
    } catch (error) {
        console.error('Error removing from cart:', error);
        res.status(500).json({ error: 'Failed to remove item from cart' });
    }
});

// Clear cart
router.delete('/clear', auth, async (req, res) => {
    try {
        const userId = req.user.id || 'guest';
        const cart = await Cart.findOne({ userId });
        
        if (cart) {
            cart.items = [];
            await cart.save();
        }
        
        res.json({ message: 'Cart cleared' });
    } catch (error) {
        console.error('Error clearing cart:', error);
        res.status(500).json({ error: 'Failed to clear cart' });
    }
});

module.exports = router; 