const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/school_uniforms', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Product Schema
const productSchema = new mongoose.Schema({
    id: Number,
    name: String,
    description: String,
    category: String,
    type: { type: String, enum: ['SINGLE', 'COMBO'], default: 'SINGLE' },
    image: String,
    new_price: Number,
    old_price: Number,
    stock: { type: Number, default: 0 },
    sizes: [String],
    combo_items: [{
        name: String,
        quantity: Number
    }],
    popularity: { type: Number, default: 0 },
    available: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', productSchema);

// Sample data for import
const sampleProducts = [
    {
        id: 1,
        name: "Primary School Complete Set",
        description: "Complete primary school uniform set including 2 shirts, trousers/skirt, and tie",
        category: "primary",
        type: "COMBO",
        image: "https://example.com/assets/images/products/primary-set.jpg",
        new_price: 299000,
        old_price: 350000,
        stock: 50,
        sizes: ["4", "6", "8", "10", "12"],
        combo_items: [
            { name: "White Shirt", quantity: 2 },
            { name: "Navy Trousers/Skirt", quantity: 1 },
            { name: "School Tie", quantity: 1 }
        ]
    },
    {
        id: 2,
        name: "Secondary School Blazer",
        description: "Navy blue blazer with school emblem",
        category: "secondary",
        type: "SINGLE",
        image: "https://example.com/assets/images/products/secondary-blazer.jpg",
        new_price: 180000,
        old_price: 200000,
        stock: 30,
        sizes: ["XS", "S", "M", "L", "XL"]
    },
    {
        id: 3,
        name: "Sixth Form Complete Set",
        description: "Premium sixth form uniform set with blazer",
        category: "sixth",
        type: "COMBO",
        image: "https://example.com/assets/images/products/sixth-set.jpg",
        new_price: 450000,
        old_price: 500000,
        stock: 20,
        sizes: ["XS", "S", "M", "L", "XL"],
        combo_items: [
            { name: "Premium Blazer", quantity: 1 },
            { name: "White Shirts", quantity: 3 },
            { name: "Trousers/Skirt", quantity: 2 },
            { name: "Sixth Form Tie", quantity: 1 }
        ]
    }
];

// Import data to MongoDB
const importData = async () => {
    try {
        // Clear existing data
        await Product.deleteMany({});
        console.log('Cleared existing products');

        // Add random popularity and timestamps
        const productsToImport = sampleProducts.map(product => ({
            ...product,
            popularity: Math.floor(Math.random() * 100),
            available: product.stock > 0,
            createdAt: new Date()
        }));

        // Import new data
        await Product.insertMany(productsToImport);
        console.log(`Successfully imported ${productsToImport.length} products`);

        // Create indexes
        await Product.collection.createIndex({ category: 1 });
        await Product.collection.createIndex({ popularity: -1 });
        await Product.collection.createIndex({ createdAt: -1 });
        console.log('Created indexes');

        console.log('Data import completed successfully');
    } catch (error) {
        console.error('Error importing data:', error);
    } finally {
        mongoose.disconnect();
    }
};

// Run the import
importData(); 