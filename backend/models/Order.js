const mongoose = require('mongoose');

// Define the order schema
const orderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        unique: true // Ensure orderId is unique
    },
    customer: {
        firstName: String,
        lastName: String,
        email: String,
        phone: String,
        address: String,
        city: String,
        country: String,
        zipCode: String
    },
    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product' // Reference to the Product model
        },
        quantity: {
            type: Number,
            default: 1 // Default quantity is 1
        },
        price: Number,
        size: String
    }],
    total: {
        type: Number,
        required: true // Total amount is required
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], // Possible statuses
        default: 'pending' // Default status is pending
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'], // Possible payment statuses
        default: 'pending' // Default payment status is pending
    },
    paymentMethod: {
        type: String,
        default: 'card' // Default payment method is card
    }
}, {
    timestamps: true // Automatically add createdAt and updatedAt fields
});

// Generate order ID before saving
orderSchema.pre('save', async function(next) {
    if (!this.orderId) {
        const count = await mongoose.model('Order').countDocuments();
        this.orderId = `ORD${String(count + 1).padStart(6, '0')}`; // Generate order ID in the format ORD000001
    }
    next();
});

// Create the Order model using the order schema
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;