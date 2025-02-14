# ViewOrders Page Guide

## Overview
The ViewOrders page in the admin panel allows administrators to view and manage all orders in the system. This guide ensures the page works correctly for all users.

## Prerequisites
1. Ensure MongoDB is running and contains orders collection
2. Backend server is running on port 4000
3. Admin panel is running on port 5173
4. Valid admin authentication

## Setup Steps

### 1. Database Setup
```bash
# Connect to MongoDB
mongosh

# Switch to ecommerce database
use ecommerce

# Create an initial test order (if needed)
db.orders.insertOne({
  orderId: "TEST001",
  customer: {
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com"
  },
  items: [{
    productId: "your_product_id",
    quantity: 1,
    price: 29.99
  }],
  total: 29.99,
  status: "pending",
  paymentStatus: "paid",
  createdAt: new Date()
})
```

### 2. Environment Variables
Make sure these environment variables are set correctly:

#### Backend (.env)
```
PORT=4000
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_jwt_secret_here
```

#### Admin Panel (.env)
```
VITE_API_URL=http://localhost:4000
```

### 3. Authentication Setup
1. Clear any existing tokens:
   ```javascript
   localStorage.clear()
   ```

2. Login as admin:
   - URL: http://localhost:5173/login
   - Email: nguyenvanqui291@gmail.com
   - Password: 123456

### 4. Verify API Access
Test the orders API endpoint:
```bash
# Get your admin token after login from localStorage.adminToken
# Replace YOUR_ADMIN_TOKEN with the actual token
curl -X GET http://localhost:4000/api/orders \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

## Common Issues & Solutions

### 1. "Authentication Required" Error
- **Cause**: Missing or invalid admin token
- **Solution**: 
  1. Clear localStorage
  2. Re-login as admin
  3. Verify token exists in localStorage.adminToken

### 2. "Failed to Fetch Orders" Error
- **Cause**: Backend connection issues
- **Solution**:
  1. Verify backend is running (`npm start` in backend directory)
  2. Check MongoDB connection
  3. Verify MONGODB_URI in backend .env

### 3. Empty Orders List
- **Cause**: No orders in database
- **Solution**:
  1. Add test order using MongoDB command above
  2. Create test order through the frontend
  3. Check MongoDB directly:
     ```bash
     mongosh
     use ecommerce
     db.orders.find()
     ```

### 4. Status Update Not Working
- **Cause**: Permission issues or invalid token
- **Solution**:
  1. Verify admin token has isAdmin: true
  2. Check network tab for specific error
  3. Try re-logging in

## Testing Checklist

Before using the ViewOrders page:

1. [ ] MongoDB service is running
2. [ ] Backend server is running on port 4000
3. [ ] Admin panel is running on port 5173
4. [ ] Successfully logged in as admin
5. [ ] Can see orders in MongoDB
6. [ ] Network requests show 200 status

## Debugging Tips

1. Open Browser DevTools (F12)
2. Check Network tab for API calls:
   - GET http://localhost:4000/api/orders
   - Should return 200 status

3. Check Console for errors

4. Verify request headers:
   ```javascript
   // In browser console
   const token = localStorage.getItem('adminToken');
   console.log('Admin Token:', token);
   ```

5. Test API directly:
   ```javascript
   // In browser console
   fetch('http://localhost:4000/api/orders', {
     headers: {
       'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
     }
   }).then(r => r.json()).then(console.log)
   ```

## Support

If you encounter any issues:
1. Check the above solutions first
2. Look for errors in:
   - Browser console
   - Backend terminal
   - MongoDB logs
3. Contact the maintainer with:
   - Error message
   - Steps to reproduce
   - Environment details 