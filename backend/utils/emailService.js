const nodemailer = require('nodemailer');

// Create transporter with Gmail settings
const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    },
    tls: {
        rejectUnauthorized: false,
        ciphers: 'SSLv3'
    }
});

// Debug: Test transporter connection with detailed logging
transporter.verify(function(error, success) {
    if (error) {
        console.error('Email transporter error details:', {
            error: error.message,
            code: error.code,
            response: error.response,
            command: error.command
        });
    } else {
        console.log('Email server is ready to send messages');
    }
});

// Send order confirmation email
const sendOrderConfirmation = async (order) => {
    try {
        console.log('Attempting to send order confirmation email to:', order.customer.email);
        
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: order.customer.email,
            subject: 'Order Confirmation - Your order has been received',
            html: `
                <h1>Thank you for your order!</h1>
                <p>Order ID: ${order.orderId}</p>
                <h2>Order Details:</h2>
                <ul>
                    ${order.items.map(item => `
                        <li>${item.name} - Quantity: ${item.quantity} - $${item.price}</li>
                    `).join('')}
                </ul>
                <p>Total Amount: $${order.total}</p>
                <p>We will process your order soon.</p>
            `
        };

        console.log('Mail options:', { from: mailOptions.from, to: mailOptions.to, subject: mailOptions.subject });
        const info = await transporter.sendMail(mailOptions);
        console.log('Order confirmation email sent:', info.response);
    } catch (error) {
        console.error('Error sending order confirmation email:', error);
        throw error; // Rethrow to handle in the order route
    }
};

// Send low stock notification to admin
const sendLowStockAlert = async (product) => {
    try {
        console.log('Attempting to send low stock alert for product:', product.name);
        
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.ADMIN_EMAIL,
            subject: 'Low Stock Alert',
            html: `
                <h1>Low Stock Alert</h1>
                <p>Product: ${product.name}</p>
                <p>Current Stock: ${product.stock}</p>
                <p>Please restock this item soon.</p>
            `
        };

        console.log('Mail options:', { from: mailOptions.from, to: mailOptions.to, subject: mailOptions.subject });
        const info = await transporter.sendMail(mailOptions);
        console.log('Low stock alert email sent:', info.response);
    } catch (error) {
        console.error('Error sending low stock alert:', error);
        throw error;
    }
};

module.exports = {
    sendOrderConfirmation,
    sendLowStockAlert
}; 