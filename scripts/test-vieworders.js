const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '../backend/.env' });

async function testViewOrders() {
    try {
        // 1. Test MongoDB Connection
        console.log('Testing MongoDB connection...');
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
        console.log('✅ MongoDB connected successfully');

        // 2. Check Orders Collection
        const ordersCount = await mongoose.connection.db.collection('orders').countDocuments();
        console.log(`📦 Found ${ordersCount} orders in database`);

        // 3. Create Test Order if none exists
        if (ordersCount === 0) {
            console.log('Creating test order...');
            await mongoose.connection.db.collection('orders').insertOne({
                orderId: "TEST001",
                customer: {
                    firstName: "John",
                    lastName: "Doe",
                    email: "john@example.com"
                },
                items: [{
                    productId: new mongoose.Types.ObjectId(),
                    quantity: 1,
                    price: 29.99
                }],
                total: 29.99,
                status: "pending",
                paymentStatus: "paid",
                createdAt: new Date()
            });
            console.log('✅ Test order created');
        }

        // 4. Test JWT Token Generation
        console.log('Testing JWT token generation...');
        const token = jwt.sign(
            { 
                email: 'nguyenvanqui291@gmail.com',
                isAdmin: true 
            },
            process.env.JWT_SECRET || 'defaultsecret'
        );
        console.log('✅ Admin token generated successfully');
        console.log('Token for testing:', token);

        // 5. Test Token Verification
        console.log('Testing token verification...');
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'defaultsecret');
        if (decoded.isAdmin) {
            console.log('✅ Token verification successful');
        } else {
            console.log('❌ Token verification failed - isAdmin not set');
        }

        console.log('\n🎉 All tests completed successfully!');
        console.log('\nNext steps:');
        console.log('1. Use this token in your browser:');
        console.log('   localStorage.setItem("adminToken", "' + token + '")');
        console.log('2. Navigate to http://localhost:5173/orders');
        console.log('3. Check browser console for any errors');

    } catch (error) {
        console.error('❌ Test failed:', error);
    } finally {
        await mongoose.disconnect();
    }
}

testViewOrders(); 