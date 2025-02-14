import React, { createContext, useEffect, useState } from "react";
import { getCart, addToCart, updateCartItem, removeFromCart, withErrorHandler, productsAPI } from '../services/api';

export const ShopContext = createContext(null);

const getDefaultCart = () => {
    return {
        items: [],
        total: 0
    };
};

export const ShopContextProvider = ({ children }) => {
    const [all_product, setAll_Product] = useState([]);
    const [cartItems, setCartItems] = useState(getDefaultCart());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Add clearCart function
    const clearCart = () => {
        const emptyCart = getDefaultCart();
        setCartItems(emptyCart);
        localStorage.setItem('cart', JSON.stringify(emptyCart));
        // Also clear from server if user is logged in
        const token = localStorage.getItem('token');
        if (token) {
            fetch('http://localhost:4000/api/cart/clear', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }).catch(err => console.error('Failed to clear server cart:', err));
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch products first
                const products = await withErrorHandler(() => productsAPI.getAllProducts());
                setAll_Product(products || []);

                // Get cart from localStorage first
                const localCart = JSON.parse(localStorage.getItem('cart') || '{"items":[],"total":0}');
                
                // Validate cart items against available products
                const validItems = localCart.items.filter(item => 
                    products.some(p => (p._id === item.productId || p.id === item.productId))
                );

                // If some items were invalid, update the cart
                if (validItems.length !== localCart.items.length) {
                    const validCart = {
                        items: validItems,
                        total: validItems.reduce((sum, item) => {
                            const product = products.find(p => p._id === item.productId || p.id === item.productId);
                            return sum + (product?.new_price || 0) * item.quantity;
                        }, 0)
                    };
                    setCartItems(validCart);
                    localStorage.setItem('cart', JSON.stringify(validCart));
                } else {
                    setCartItems(localCart);
                }

                // Try to sync with server if logged in
                const token = localStorage.getItem('token');
                if (token) {
                    try {
                        const response = await getCart();
                        if (response?.items) {
                            // Validate server cart items too
                            const validServerItems = response.items.filter(item =>
                                products.some(p => (p._id === item.productId || p.id === item.productId))
                            );
                            
                            const validServerCart = {
                                items: validServerItems,
                                total: validServerItems.reduce((sum, item) => {
                                    const product = products.find(p => p._id === item.productId || p.id === item.productId);
                                    return sum + (product?.new_price || 0) * item.quantity;
                                }, 0)
                            };
                            
                            setCartItems(validServerCart);
                            localStorage.setItem('cart', JSON.stringify(validServerCart));
                        }
                    } catch (cartError) {
                        console.log('Failed to fetch cart:', cartError);
                    }
                }
            } catch (err) {
                setError(err.message);
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const addItemToCart = async (productId, quantity = 1, size) => {
        try {
            setLoading(true);
            setError(null);

            // Find product to get price
            const product = all_product.find(p => p._id === productId || p.id === productId);
            if (!product) {
                throw new Error('Product not found');
            }

            // Add to local cart first
            const currentCart = { ...cartItems };
            currentCart.items = currentCart.items || [];
            
            // Find if item already exists
            const existingItemIndex = currentCart.items.findIndex(
                item => item.productId === productId && item.size === size
            );

            if (existingItemIndex !== -1) {
                // Update existing item
                currentCart.items[existingItemIndex].quantity += quantity;
            } else {
                // Add new item with price
                currentCart.items.push({ 
                    productId, 
                    size, 
                    quantity,
                    price: product.new_price 
                });
            }

            setCartItems(currentCart);
            localStorage.setItem('cart', JSON.stringify(currentCart));

            // Try to sync with server
            const response = await addToCart(productId, quantity, size);
            if (response?.success) {
                if (response.cart?.items) {
                    setCartItems(response.cart);
                    localStorage.setItem('cart', JSON.stringify(response.cart));
                }
                return true;
            }
            return false;
        } catch (err) {
            console.error('Error adding to cart:', err);
            setError('Failed to add item to cart');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const updateItem = async (productId, size, quantity) => {
        try {
            setLoading(true);
            setError(null);

            // Update local cart first
            const currentCart = { ...cartItems };
            currentCart.items = currentCart.items || [];
            const itemIndex = currentCart.items.findIndex(item => 
                item.productId === productId && item.size === size
            );
            if (itemIndex !== -1) {
                currentCart.items[itemIndex].quantity = quantity;
            }
            setCartItems(currentCart);
            localStorage.setItem('cart', JSON.stringify(currentCart));

            // Try to sync with server
            const response = await updateCartItem(productId, size, quantity);
            if (response?.items) {
                setCartItems(response);
                localStorage.setItem('cart', JSON.stringify(response));
            }
            return true;
        } catch (err) {
            console.error('Error updating cart:', err);
            setError('Failed to update cart');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const removeItem = async (productId, size) => {
        try {
            setLoading(true);
            setError(null);

            // Remove from local cart first
            const currentCart = { ...cartItems };
            currentCart.items = currentCart.items || [];
            currentCart.items = currentCart.items.filter(item => 
                !(item.productId === productId && item.size === size)
            );
            setCartItems(currentCart);
            localStorage.setItem('cart', JSON.stringify(currentCart));

            // Try to sync with server
            const response = await removeFromCart(productId, size);
            if (response?.items) {
                setCartItems(response);
                localStorage.setItem('cart', JSON.stringify(response));
            }
            return true;
        } catch (err) {
            console.error('Error removing from cart:', err);
            setError('Failed to remove item from cart');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        if (cartItems?.items) {
            cartItems.items.forEach(item => {
                const product = all_product.find(p => p._id === item.productId || p.id === item.productId);
                if (product) {
                    totalAmount += product.new_price * item.quantity;
                }
            });
        }
        return totalAmount;
    };

    const getTotalCartItems = () => {
        if (!cartItems?.items) return 0;
        return cartItems.items.reduce((total, item) => total + (item.quantity || 0), 0);
    };

    const contextValue = {
        all_product,
        cartItems,
        loading,
        error,
        addItemToCart,
        updateItem,
        removeItem,
        getTotalCartAmount,
        getTotalCartItems,
        setCartItems,
        clearCart
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <ShopContext.Provider value={contextValue}>
            {children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;

