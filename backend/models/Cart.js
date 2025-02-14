const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    size: {
        type: String,
        required: true,
        enum: ['S', 'M', 'L', 'XL', 'XXL']
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    price: {
        type: Number,
        required: true,
        min: 0
    }
});

const cartSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true
    },
    items: [cartItemSchema],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update timestamp before saving
cartSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

// Add index for better query performance
cartSchema.index({ userId: 1 });

// Virtual for total amount
cartSchema.virtual('totalAmount').get(function() {
    return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
});

// Virtual for total items
cartSchema.virtual('totalItems').get(function() {
    return this.items.reduce((total, item) => total + item.quantity, 0);
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart; 