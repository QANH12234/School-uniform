const mongoose = require('mongoose');
const Product = require('./models/Product');
const { schoolUniforms } = require('../frontend/src/Components/Assets/data');

async function importData() {
    try {
        // Connect to MongoDB
        await mongoose.connect("mongodb://127.0.0.1:27017/school_uniforms", {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Connected to MongoDB");

        // Clear existing products
        await Product.deleteMany({});
        console.log("Cleared existing products");

        // Prepare products array
        const products = [
            ...schoolUniforms.primary,
            ...schoolUniforms.secondary,
            ...schoolUniforms.sixth
        ];

        // Add products to database
        await Product.insertMany(products);
        console.log("Imported all products successfully");

        // Close connection
        await mongoose.connection.close();
        console.log("Database connection closed");

    } catch (error) {
        console.error("Error importing data:", error);
        process.exit(1);
    }
}

// Run the import
importData(); 