const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
require('dotenv').config();

const app = express();
const port = process.env.PORT || 4000;

// Import routes
const productsRouter = require('./routes/products');
const authRouter = require('./routes/auth');
const cartRouter = require('./routes/cart');
const adminRouter = require('./routes/admin');
const ordersRouter = require('./routes/orders');

// Middleware
app.use(express.json());
app.use(cors({
    origin: '*', // Allow all origins for now
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token', 'x-admin-token']
}));

// Debug middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    console.log('Body:', req.body);
    console.log('Headers:', req.headers);
    next();
});

// Set strictQuery to false to prepare for Mongoose 7
mongoose.set('strictQuery', false);

// MongoDB connection with error handling and retry logic
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        
        // Log collections
        const collections = await mongoose.connection.db.collections();
        console.log('Available collections:', collections.map(c => c.collectionName));
        
        // Check User collection
        const users = await mongoose.connection.db.collection('users').countDocuments();
        console.log('Number of users in database:', users);
        
    } catch (err) {
        console.error("MongoDB connection error:", err);
        // Retry connection after 5 seconds
        setTimeout(connectDB, 5000);
    }
};

// Initial connection
connectDB();

// Handle connection errors
mongoose.connection.on('error', err => {
    console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected. Attempting to reconnect...');
    connectDB();
});

// Image Storage Engine
const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
});

const upload = multer({ storage: storage });

// Static files
app.use('/images', express.static('upload/images'));

// Upload endpoint for images
app.post("/api/upload", upload.single('product'), (req, res) => {
    res.json({
        success: 1,
        image_url: `http://localhost:${port}/images/${req.file.filename}`
    });
});

// API routes
app.use('/api/products', productsRouter);
app.use('/api/auth', authRouter);
app.use('/api/cart', cartRouter);
app.use('/api/admin', adminRouter);
app.use('/api/orders', ordersRouter);

// Root route
app.get("/", (req, res) => {
    res.json({ 
        success: true,
        message: "API is running",
        timestamp: new Date().toISOString()
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({ 
        success: false,
        error: err.message || 'Something went wrong!',
        path: req.path
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ 
        success: false,
        error: 'Route not found',
        path: req.path,
        method: req.method
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`Test the API at http://localhost:${port}`);
});

// Enable mongoose debug mode
mongoose.set('debug', true);
