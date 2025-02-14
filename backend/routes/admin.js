const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

// Admin login with proper JWT token
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // In production, you should validate email and password against database
        const token = jwt.sign(
            { 
                email: email,
                role: 'admin',
                isAdmin: true 
            }, 
            process.env.JWT_SECRET || 'defaultsecret',
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            token: token,
            admin: {
                email: email,
                role: 'admin'
            }
        });
    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// Get admin profile without authentication
router.get('/me', async (req, res) => {
    try {
        res.json({
            email: 'nguyenvanqui291@gmail.com',
            role: 'admin'
        });
    } catch (error) {
        console.error('Error fetching admin profile:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Create initial admin (this should be removed or secured in production)
router.post('/setup', async (req, res) => {
    try {
        const adminExists = await Admin.findOne({ email: 'nguyenvanqui291@gmail.com' });
        if (adminExists) {
            return res.json({ message: 'Admin already exists' });
        }

        const admin = new Admin({
            email: 'nguyenvanqui291@gmail.com',
            password: '123456',
            role: 'admin'
        });

        await admin.save();
        res.json({ message: 'Admin created successfully' });
    } catch (error) {
        console.error('Error creating admin:', error);
        res.status(500).json({ error: 'Failed to create admin' });
    }
});

module.exports = router; 