import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar';
import Footer from './Components/Footer/Footer';
import Shop from './Pages/Shop';
import ShopCategory from './Pages/ShopCategory';
import Product from './Pages/Product';
import Cart from './Pages/Cart';
import LoginSignup from './Pages/LoginSignup';
import Checkout from './Pages/Checkout';
import OrderConfirmation from './Pages/OrderConfirmation';
import SizeGuidePage from './Pages/SizeGuidePage';
import Orders from './Pages/Orders';
import OrderDetails from './Pages/OrderDetails';

const AppContent = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path='/' element={<Shop />} />
        <Route path='/primary' element={<ShopCategory category="primary" />} />
        <Route path='/secondary' element={<ShopCategory category="secondary" />} />
        <Route path='/sixth' element={<ShopCategory category="sixth" />} />
        <Route path='/product/:productId' element={<Product />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/login' element={<LoginSignup />} />
        <Route path='/checkout' element={<Checkout />} />
        <Route path='/orders' element={<Orders />} />
        <Route path='/orders/:orderId' element={<OrderDetails />} />
        <Route path='/order-confirmation' element={<OrderConfirmation />} />
        <Route path='/size-guide' element={<SizeGuidePage />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default AppContent; 