const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Debug middleware
router.use((req, res, next) => {
    console.log('Auth Route:', {
        method: req.method,
        path: req.path,
        body: req.body,
        headers: req.headers
    });
    next();
});

// Login route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login attempt:', { email, password });

        // Validate input
        if (!email || !password) {
            console.log('Missing credentials');
            return res.status(400).json({
                success: false,
                error: 'Please provide both email and password'
            });
        }

        // Find user
        const user = await User.findOne({ email });
        console.log('User found:', user ? {
            id: user._id,
            email: user.email,
            name: user.name,
            hasPassword: !!user.password
        } : 'No user found');
        
        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'User not found'
            });
        }

        // Check password using bcrypt compare
        const isMatch = await user.comparePassword(password);
        console.log('Password match:', isMatch);
        
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                error: 'Incorrect password'
            });
        }

        // Create token
        const token = jwt.sign(
            { 
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        console.log('Login successful:', {
            userId: user._id,
            email: user.email,
            name: user.name
        });

        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            error: 'Login failed: ' + error.message
        });
    }
});

// Create test user route
router.post('/create-test-user', async (req, res) => {
    try {
        // Check if test user exists
        let user = await User.findOne({ email: 'test@example.com' });
        
        if (user) {
            return res.json({
                success: true,
                message: 'Test user already exists',
                credentials: {
                    email: 'test@example.com',
                    password: 'test123'
                }
            });
        }

        // Create test user
        user = new User({
            email: 'test@example.com',
            password: 'test123',
            name: 'Test User'
        });

        await user.save();

        res.json({
            success: true,
            message: 'Test user created',
            credentials: {
                email: 'test@example.com',
                password: 'test123'
            }
        });
    } catch (error) {
        console.error('Create test user error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create test user'
        });
    }
});

// Create test admin user route
router.post('/create-test-admin', async (req, res) => {
    try {
        // Check if test admin exists
        let user = await User.findOne({ email: 'admin@test.com' });
        
        if (user) {
            return res.json({
                success: true,
                message: 'Test admin already exists',
                credentials: {
                    email: 'admin@test.com',
                    password: 'admin123'
                }
            });
        }

        // Create test admin
        user = new User({
            email: 'admin@test.com',
            password: 'admin123',
            name: 'Test Admin',
            role: 'admin'
        });

        await user.save();

        res.json({
            success: true,
            message: 'Test admin created',
            credentials: {
                email: 'admin@test.com',
                password: 'admin123'
            }
        });
    } catch (error) {
        console.error('Create test admin error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create test admin'
        });
    }
});

// Signup route
router.post('/signup', async (req, res) => {
    try {
        const { email, password, name } = req.body;

        // Validate input
        if (!email || !password || !name) {
            return res.status(400).json({
                success: false,
                error: 'Please provide email, password and name'
            });
        }

        // Password validation
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                error: 'Password must be at least 6 characters long'
            });
        }

        // Check if user exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                success: false,
                error: 'User already exists'
            });
        }

        // Create user - password will be hashed by the pre-save middleware
        user = new User({
            email,
            password,
            name
        });

        await user.save();

        // Create token
        const token = jwt.sign(
            { 
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Signup error:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                error: Object.values(error.errors).map(err => err.message).join(', ')
            });
        }
        res.status(500).json({
            success: false,
            error: 'Signup failed'
        });
    }
});

// Get current user
router.get('/me', async (req, res) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({
                success: false,
                error: 'No token provided'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        res.json({
            success: true,
            user
        });
    } catch (error) {
        console.error('Auth error:', error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                error: 'Invalid token'
            });
        }
        res.status(500).json({
            success: false,
            error: 'Authentication failed'
        });
    }
});

module.exports = router; 