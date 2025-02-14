const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Simple Admin Schema
const adminSchema = new mongoose.Schema({
  email: String,
  password: String,
  role: String
});

// Hash password before saving
adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const Admin = mongoose.model('Admin', adminSchema);

async function createAdmin() {
  try {
    await mongoose.connect('mongodb://localhost:27017/school_uniforms');
    
    // Create admin
    const admin = new Admin({
      email: 'nguyenvanqui291@gmail.com',
      password: '123456',
      role: 'admin'
    });

    await admin.save();
    console.log('Admin created successfully!');
    console.log('Email: nguyenvanqui291@gmail.com');
    console.log('Password: 123456');
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

createAdmin(); 