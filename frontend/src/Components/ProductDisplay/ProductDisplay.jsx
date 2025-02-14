// Import necessary modules and components
import React, { useContext, useState, useEffect } from 'react';
import './ProductDisplay.css'
import star_icon from '../Assets/star_icon.png'
import star_dull_icon from '../Assets/star_dull_icon.png'
import { ShopContext } from '../../Context/ShopContext';
import { toast } from 'react-toastify';

// Define the ProductDisplay component
const ProductDisplay = (props) => {
    const { product } = props;
    const { addItemToCart: addToCart, cartItems } = useContext(ShopContext);
    const [selectedSize, setSelectedSize] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

    // Reset selected size when product changes
    useEffect(() => {
        setSelectedSize('');
        setSelectedImage(0);
    }, [product?.id]);

    // Display loading message if product is not available
    if (!product) {
        return <div>Loading...</div>;
    }

    // Handle size selection
    const handleSizeSelect = (size) => {
        setSelectedSize(size);
    };

    // Handle image selection
    const handleImageSelect = (index) => {
        setSelectedImage(index);
    };

    // Handle quantity change
    const handleQuantityChange = (newQuantity) => {
        if (newQuantity >= 1 && newQuantity <= product.stock) {
            setQuantity(newQuantity);
        }
    };

    // Handle adding item to cart
    const handleAddToCart = async () => {
        if (!selectedSize) {
            toast.error('Please select a size');
            return;
        }

        if (!product.stock) {
            toast.error('Sorry, this item is out of stock');
            return;
        }

        // Check if the item is already in cart
        const existingItem = cartItems.items?.find(item => 
            item.productId === product._id && item.size === selectedSize
        );
        const currentQuantity = existingItem ? existingItem.quantity : 0;
        const totalQuantity = currentQuantity + quantity;

        if (totalQuantity > product.stock) {
            toast.error(`Cannot add ${quantity} more items. Only ${product.stock - currentQuantity} items available.`);
            return;
        }

        try {
            setIsAddingToCart(true);
            const success = await addToCart(product._id, quantity, selectedSize);
            
            if (success) {
                toast.success(`Added ${quantity} item(s) to cart`);
                // Reset quantity and size after successful add
                setQuantity(1);
                setSelectedSize('');
            } else {
                toast.error('Failed to add item to cart');
            }
        } catch (error) {
            console.error('Add to cart error:', error);
            toast.error(error.message || 'Failed to add item to cart');
        } finally {
            setIsAddingToCart(false);
        }
    };

    // Get stock text based on product stock
    const getStockText = () => {
        if (product.stock > 10) {
            return <p className="in-stock">In stock: {product.stock} units</p>;
        } else if (product.stock === 0) {
            return <p className="out-of-stock">Out of stock</p>;
        } else {
            return <p className="low-stock">Low stock - only {product.stock} units left!</p>;
        }
    };

    const itemCount = cartItems[product.id] || 0;

    return (
        <div className="product-display">
            <div className="product-display-left">
                <div className="product-display-img-list">
                    {/* Display product images */}
                    {[product.image, ...product.additionalImages || []].map((img, index) => (
                        <div 
                            key={index} 
                            className="product-display-img-item"
                        >
                            <img src={img} alt={`${product.name} view ${index + 1}`} />
                        </div>
                    ))}
                </div>
                <div className="product-display-main-img">
                    <img src={product.image} alt={product.name} />
                    {product.stock <= 10 && product.stock > 0 && (
                        <div className="stock-badge">
                            Only {product.stock} left!
                        </div>
                    )}
                </div>
            </div>
            
            <div className="product-display-right">
                <h1>{product.name}</h1>
                <div className="product-display-right-prices">
                    <div className="old-price">£{product.old_price}</div>
                    <div className="new-price">£{product.new_price}</div>
                </div>

                <div className="product-details">
                    <div className="size-selector">
                        <h3>Select Size</h3>
                        <div className="size-guide-link">
                            <button onClick={() => window.open('/size-guide', '_blank')}>
                                Size Guide
                            </button>
                        </div>
                        <div className="size-options">
                            {/* Display size options */}
                            {sizes.map((size) => (
                                <button
                                    key={size}
                                    className={`size-option ${selectedSize === size ? 'selected' : ''} ${
                                        product.stock === 0 ? 'disabled' : ''
                                    }`}
                                    onClick={() => handleSizeSelect(size)}
                                    disabled={product.stock === 0}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="quantity-selector">
                        <h3>Quantity</h3>
                        <div className="quantity-controls">
                            <button 
                                onClick={() => handleQuantityChange(quantity - 1)}
                                disabled={quantity <= 1 || product.stock === 0}
                            >
                                -
                            </button>
                            <span>{quantity}</span>
                            <button 
                                onClick={() => handleQuantityChange(quantity + 1)}
                                disabled={quantity >= product.stock || product.stock === 0}
                            >
                                +
                            </button>
                        </div>
                    </div>
                </div>

                <button 
                    className="add-to-cart-btn"
                    onClick={handleAddToCart}
                    disabled={product.stock === 0 || !selectedSize}
                >
                    {product.stock === 0 ? 'Out of Stock' : 'ADD TO CART'}
                </button>

                <div className="product-info">
                    <div className="info-item">
                        <span className="label">Category:</span>
                        <span className="value">{product.category}</span>
                    </div>
                    {product.material && (
                        <div className="info-item">
                            <span className="label">Material:</span>
                            <span className="value">{product.material}</span>
                        </div>
                    )}
                    {product.care && (
                        <div className="info-item">
                            <span className="label">Care:</span>
                            <span className="value">{product.care}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}; 

// Export the ProductDisplay component
export default ProductDisplay;