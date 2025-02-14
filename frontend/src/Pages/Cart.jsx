// Import necessary modules and components
import React, { useContext } from 'react';
import { ShopContext } from '../Context/ShopContext';
import LoadingSpinner from '../Components/LoadingSpinner/LoadingSpinner';
import { Link, useNavigate } from 'react-router-dom';
import './CSS/Cart.css';

// Define the Cart component
const Cart = () => {
  // Destructure context values from ShopContext
  const { 
    cartItems, // Items in the cart
    loading, // Loading state
    error, // Error state
    all_product, // All available products
    updateItem, // Function to update item quantity
    removeItem, // Function to remove item from cart
    getTotalCartAmount // Function to get total cart amount
  } = useContext(ShopContext);

  // Hook to navigate programmatically
  const navigate = useNavigate();

  // Render loading state
  if (loading) {
    return (
      <div className="cart-loading">
        <LoadingSpinner />
        <p>Loading your cart...</p>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="cart-error">
        <h2>Oops! Something went wrong</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  // Render empty cart state
  if (!cartItems?.items?.length) {
    return (
      <div className="cart-empty">
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added any items to your cart yet.</p>
        <Link to="/" className="continue-shopping">
          Continue Shopping
        </Link>
      </div>
    );
  }

  // Function to render cart items
  const renderCartItems = () => {
    return cartItems.items?.map((item) => {
      // Find the product details for the cart item
      const product = all_product.find(p => p._id === item.productId || p.id === item.productId);
      if (!product) return null;

      // Calculate the total price for the item
      const itemTotal = product.new_price * item.quantity;

      return (
        <div className="cart-item" key={`${item.productId}-${item.size}`}>
          <div className="cart-item-image">
            <img src={product.image} alt={product.name} />
          </div>
          <div className="cart-item-details">
            <h3>{product.name}</h3>
            <p>Size: {item.size}</p>
            <p className="price">£{product.new_price}</p>
            <div className="quantity-controls">
              <button onClick={() => updateItem(item.productId, item.size, Math.max(1, item.quantity - 1))}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => updateItem(item.productId, item.size, item.quantity + 1)}>+</button>
            </div>
            <p className="item-total">Total: £{itemTotal.toFixed(2)}</p>
            <button className="remove-btn" onClick={() => removeItem(item.productId, item.size)}>Remove</button>
          </div>
        </div>
      );
    });
  };

  // Calculate the subtotal for the cart
  const subtotal = getTotalCartAmount();

  // Render the cart component
  return (
    <div className="cart-container">
      <h1>Your Shopping Cart</h1>
      <div className="cart-content">
        <div className="cart-items">
          {renderCartItems()}
        </div>
        <div className="cart-summary">
          <div className="summary-row">
            <span>Subtotal:</span>
            <span>£{subtotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping:</span>
            <span>Free</span>
          </div>
          <div className="summary-row total">
            <span>Total:</span>
            <span>£{subtotal.toFixed(2)}</span>
          </div>
          <button 
            className="checkout-btn" 
            onClick={() => navigate('/checkout')}
            disabled={!cartItems.items.length}
          >
            PROCEED TO CHECKOUT
          </button>
        </div>
      </div>
    </div>
  );
};

// Export the Cart component
export default Cart;