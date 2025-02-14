// Import necessary modules and components
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './CartItems.css'
import { ShopContext } from '../../Context/ShopContext';
import remove_icon from '../Assets/cart_cross_icon.png'
import { toast } from 'react-toastify';

// Define the CartItems component
const CartItems = () => {
    // Initialize navigation hook
    const navigate = useNavigate();
    // Destructure context values from ShopContext
    const { getTotalCartAmount, all_product, cartItems, removeFromCart } = useContext(ShopContext);

    // Handle checkout process
    const handleCheckout = () => {
        // Check if user is authenticated
        const token = localStorage.getItem('auth-token');
        if (!token) {
            // Show error message if not authenticated
            toast.error('Please login to proceed with checkout');
            // Save the return URL for redirection after login
            localStorage.setItem('returnUrl', '/checkout');
            // Redirect to login page
            navigate('/login');
            return;
        }
        // Redirect to checkout page if authenticated
        navigate('/checkout');
    };

    return (
        <div className="cartitems">
            {/* Header row for cart items */}
            <div className="cartitems-format-main">
                <p>Products</p>
                <p>Title</p>
                <p>Price</p>
                <p>Quantity</p>
                <p>Total</p>
                <p>Remove</p>
            </div>
            <hr />
            {/* Map through all products and display those in the cart */}
            {all_product.map((e) => {
                if (cartItems[e.id] > 0) {
                    return <div key={e.id}>
                        <div className="cartitems-format cartitems-format-main">
                            {/* Product image */}
                            <img src={e.image} alt="" className='carticon-product-icon' />
                            {/* Product name */}
                            <p>{e.name}</p>
                            {/* Product price */}
                            <p>${e.new_price}</p>
                            {/* Quantity of the product in the cart */}
                            <button className='cartitems-quantity'>{cartItems[e.id]}</button>
                            {/* Total price for the product based on quantity */}
                            <p>${e.new_price * cartItems[e.id]}</p>
                            {/* Remove product from cart */}
                            <img className='cartitems-remove-icon' src={remove_icon} onClick={() => { removeFromCart(e.id) }} alt="" />
                        </div>
                        <hr />
                    </div>
                }
                return null;
            })}
            <div className="cartitems-down">
                <div className="cartitems-total">
                    <h1>Cart Totals</h1>
                    <div>
                        {/* Subtotal amount */}
                        <div className="cartitems-total-item">
                            <p>Subtotal</p>
                            <p>${getTotalCartAmount()}</p>
                        </div>
                        <hr />
                        {/* Shipping fee */}
                        <div className="cartitems-total-item">
                            <p>Shipping Fee</p>
                            <p>Free</p>
                        </div>
                        <hr />
                        {/* Total amount */}
                        <div className="cartitems-total-item">
                            <h3>Total</h3>
                            <h3>${getTotalCartAmount()}</h3>
                        </div>
                    </div>
                    {/* Button to proceed to checkout */}
                    <button onClick={handleCheckout}>PROCEED TO CHECKOUT</button>
                </div>
                <div className="cartitems-promocode">
                    <p>If you have a promo code, Enter it here</p>
                    <div className="cartitems-promobox">
                        {/* Input field for promo code */}
                        <input type="text" placeholder='promo code' />
                        {/* Button to submit promo code */}
                        <button>Submit</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Export the CartItems component
export default CartItems;
