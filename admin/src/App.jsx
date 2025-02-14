import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './Pages/Login';
import Dashboard from './Pages/Dashboard';
import AddProduct from './Pages/AddProduct';
import ManageProducts from './Pages/ManageProducts';
import ViewOrders from './Pages/ViewOrders';
import OrderDetails from './Pages/OrderDetails';
import './App.css';

// PrivateRoute component to protect routes
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return user ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        {/* Route for login page */}
        <Route path="/login" element={<Login />} />
        
        {/* Protected route for dashboard */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        
        {/* Protected route for managing products */}
        <Route
          path="/products"
          element={
            <PrivateRoute>
              <ManageProducts />
            </PrivateRoute>
          }
        />
        
        {/* Protected route for adding a product */}
        <Route
          path="/add-product"
          element={
            <PrivateRoute>
              <AddProduct />
            </PrivateRoute>
          }
        />
        
        {/* Protected route for adding a product (alternative path) */}
        <Route
          path="/addproduct"
          element={
            <PrivateRoute>
              <AddProduct />
            </PrivateRoute>
          }
        />
        
        {/* Protected route for viewing orders */}
        <Route
          path="/orders"
          element={
            <PrivateRoute>
              <ViewOrders />
            </PrivateRoute>
          }
        />
        
        {/* Protected route for viewing order details */}
        <Route
          path="/orders/:orderId"
          element={
            <PrivateRoute>
              <OrderDetails />
            </PrivateRoute>
          }
        />
        
        {/* Redirect root path to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" />} />
        
        {/* Redirect any unknown path to dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
