const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Get all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find()
            .select('-__v')
            .sort({ popularity: -1 });
        res.json(products);
    } catch (error) {
        console.error('Error getting products:', error);
        res.status(500).json({ error: 'Failed to get products' });
    }
});

// Get products by category
router.get('/category/:category', async (req, res) => {
    try {
        const { category } = req.params;
        const validCategories = ['primary', 'secondary', 'sixth'];
        
        if (!validCategories.includes(category)) {
            return res.status(400).json({ 
                error: 'Invalid category. Must be one of: primary, secondary, sixth' 
            });
        }

        const products = await Product.find({ category })
            .select('-__v')
            .sort({ popularity: -1 });
        res.json(products);
    } catch (error) {
        console.error('Error getting products by category:', error);
        res.status(500).json({ error: 'Failed to get products' });
    }
});

// Get popular products
router.get('/popular', async (req, res) => {
    try {
        const { category, limit = 10 } = req.query;
        const validCategories = ['primary', 'secondary', 'sixth'];
        
        if (category && !validCategories.includes(category)) {
            return res.status(400).json({ 
                error: 'Invalid category. Must be one of: primary, secondary, sixth' 
            });
        }

        const query = category ? { category } : {};
        const products = await Product.find(query)
            .select('-__v')
            .sort({ popularity: -1 })
            .limit(parseInt(limit));

        res.json(products);
    } catch (error) {
        console.error('Error getting popular products:', error);
        res.status(500).json({ error: 'Failed to get popular products' });
    }
});

// Get new products
router.get('/new', async (req, res) => {
    try {
        const { limit = 10 } = req.query;
        const products = await Product.find()
            .select('-__v')
            .sort({ createdAt: -1 })
            .limit(parseInt(limit));
        res.json(products);
    } catch (error) {
        console.error('Error getting new products:', error);
        res.status(500).json({ error: 'Failed to get new products' });
    }
});

// Get product by ID
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findOne({ id: parseInt(req.params.id) })
            .select('-__v');
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        console.error('Error getting product:', error);
        res.status(500).json({ error: 'Failed to get product' });
    }
});

// Get single product by ID
router.get('/item/:id', async (req, res) => {
    try {
        const { id } = req.params;
        let product;

        // Try to find by MongoDB _id first
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            product = await Product.findById(id);
        }

        // If not found, try to find by regular id
        if (!product) {
            product = await Product.findOne({ id: parseInt(id) });
        }

        if (!product) {
            return res.status(404).json({ 
                success: false,
                error: "Product not found" 
            });
        }

        console.log('Found product:', product);
        res.json(product);
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({ 
            success: false,
            error: "Failed to fetch product",
            details: error.message 
        });
    }
});

// Create new product
router.post('/', async (req, res) => {
    try {
        // Find the highest existing ID
        const highestProduct = await Product.findOne().sort('-id');
        const nextId = highestProduct ? highestProduct.id + 1 : 1;

        // Create new product with auto-generated ID
        const product = new Product({
            ...req.body,
            id: nextId
        });

        await product.save();
        res.status(201).json(product);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ error: error.message || 'Failed to create product' });
    }
});

// Update product
router.put('/:id', async (req, res) => {
    try {
        const product = await Product.findOneAndUpdate(
            { id: parseInt(req.params.id) },
            { 
                ...req.body,
                updatedAt: new Date()
            },
            { new: true }
        ).select('-__v');
        
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        
        res.json({ success: true, product });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'Failed to update product' });
    }
});

// Delete product
router.delete('/:id', async (req, res) => {
    try {
        const product = await Product.findOneAndDelete({ id: parseInt(req.params.id) });
        
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: 'Failed to delete product' });
    }
});

// Update product sizes
router.patch('/:id/sizes', async (req, res) => {
    try {
        const product = await Product.findOne({ id: parseInt(req.params.id) });
        
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Set default sizes if none exist
        if (!product.sizes || product.sizes.length === 0) {
            product.sizes = ['S', 'M', 'L', 'XL', 'XXL'];
            await product.save();
        }
        
        res.json({ success: true, product });
    } catch (error) {
        console.error('Error updating product sizes:', error);
        res.status(500).json({ error: 'Failed to update product sizes' });
    }
});

module.exports = router; 