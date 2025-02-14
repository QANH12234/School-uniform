const mongoose = require('mongoose');
const Admin = require('../models/Admin');
require('dotenv').config({ path: '../.env' });

async function createAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/school_uniforms', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: 'nguyenvanqui291@gmail.com' });
    if (existingAdmin) {
      console.log('Admin account already exists');
      process.exit(0);
    }

    // Create new admin
    const admin = new Admin({
      email: 'nguyenvanqui291@gmail.com',
      password: '123456',
      role: 'admin'
    });

    await admin.save();
    console.log('Admin account created successfully');
  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    mongoose.disconnect();
  }
}

createAdmin(); 