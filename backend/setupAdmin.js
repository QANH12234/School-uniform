const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin');
require('dotenv').config();

async function setupAdmin() {
    try {
        // Connect to MongoDB
        await mongoose.connect('mongodb://localhost:27017/ecommerce', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');

        // Check if admin exists
        const adminExists = await Admin.findOne({ email: 'nguyenvanqui291@gmail.com' });
        if (adminExists) {
            console.log('Admin already exists');
            process.exit(0);
        }

        // Create new admin
        const admin = new Admin({
            email: 'nguyenvanqui291@gmail.com',
            password: '123456',
            role: 'admin'
        });

        await admin.save();
        console.log('Admin created successfully');
        console.log('Email: nguyenvanqui291@gmail.com');
        console.log('Password: 123456');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

setupAdmin(); 