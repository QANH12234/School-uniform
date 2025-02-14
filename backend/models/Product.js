const mongoose = require('mongoose');

// Define the product schema
const productSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true // Ensure id is unique
    },
    name: {
        type: String,
        required: true,
        trim: true // Trim whitespace from name
    },
    description: {
        type: String,
        trim: true // Trim whitespace from description
    },
    image: {
        type: String,
        required: true // Image URL is required
    },
    category: {
        type: String,
        required: true,
        enum: ['primary', 'secondary', 'sixth'] // Allowed categories
    },
    new_price: {
        type: Number,
        required: true,
        min: 0 // Minimum price is 0
    },
    old_price: {
        type: Number,
        min: 0 // Minimum old price is 0
    },
    stock: {
        type: Number,
        required: true,
        min: 0, // Minimum stock is 0
        default: 0 // Default stock is 0
    },
    popularity: {
        type: Number,
        default: 0 // Default popularity is 0
    },
    sizes: [{
        type: String,
        enum: ['S', 'M', 'L', 'XL', 'XXL'] // Allowed sizes
    }],
    createdAt: {
        type: Date,
        default: Date.now // Default creation date is now
    },
    updatedAt: {
        type: Date,
        default: Date.now // Default update date is now
    }
});

// Update timestamp before saving
productSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

// Generate ID before saving if not provided
productSchema.pre('save', async function(next) {
    if (!this.id) {
        const lastProduct = await this.constructor.findOne({}, {}, { sort: { 'id': -1 } });
        this.id = lastProduct ? lastProduct.id + 1 : 1;
    }
    next();
});

// Indexes for efficient querying
productSchema.index({ category: 1 });
productSchema.index({ name: 'text' });
productSchema.index({ createdAt: -1 });
productSchema.index({ popularity: -1 });
productSchema.index({ new_price: 1 });
productSchema.index({ stock: 1 });
productSchema.index({ id: 1 }, { unique: true });

// Virtual for checking if product is in stock
productSchema.virtual('inStock').get(function() {
    return this.stock > 0;
});

// Methods for updating stock and incrementing popularity
productSchema.methods.updateStock = function(quantity) {
    this.stock += quantity;
    return this.save();
};

productSchema.methods.incrementPopularity = function() {
    this.popularity += 1;
    return this.save();
};

// Static methods for finding products by category, popularity, and creation date
productSchema.statics.findByCategory = function(category) {
    return this.find({ category });
};

productSchema.statics.findPopular = function(limit = 10) {
    return this.find()
        .sort({ popularity: -1 })
        .limit(limit);
};

productSchema.statics.findNew = function(limit = 10) {
    return this.find()
        .sort({ createdAt: -1 })
        .limit(limit);
};

// Create the Product model using the product schema
const Product = mongoose.model('Product', productSchema);

module.exports = Product;