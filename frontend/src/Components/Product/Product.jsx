import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import Breadcrum from '../Components/Breadcrums/Breadcrum';
import ProductDisplay from '../Components/ProductDisplay/ProductDisplay';
import DescriptionBox from '../Components/DescriptionBox/DescriptionBox';
import RelatedProducts from '../Components/RelatedProducts/RelatedProducts';
import { ShopContext } from '../Context/ShopContext';

const Product = () => {
  const { all_product } = useContext(ShopContext);
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [stock, setStock] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:4000/allproducts`);
        const data = await response.json();
        const foundProduct = data.find((p) => p.id === Number(productId));
        setProduct(foundProduct);
        setStock(foundProduct.stock);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleStockUpdate = async (newStock) => {
    try {
      const response = await fetch(`http://localhost:4000/updateStock`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: productId,
          stock: newStock,
        }),
      });

      if (response.ok) {
        setStock(newStock);
        // Optionally show a success message
      } else {
        console.error('Error updating stock:', response.status);
      }
    } catch (error) {
      console.error('Error updating stock:', error);
    }
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Breadcrum product={product} />
      <ProductDisplay product={product} />
      <DescriptionBox />
      <RelatedProducts />

      <div className="stock-info">
        {stock > 10 ? (
          <p>In stock: {stock} units</p>
        ) : stock === 0 ? (
          <p>Out of stock</p>
        ) : (
          <p className="low-stock-warning">Low stock - only {stock} units left!</p>
        )}
      </div>

      {/* Add a button or form to update stock if needed */}
      {/* Example: */}
      {/* <form onSubmit={(e) => { e.preventDefault(); handleStockUpdate(e.target.stock.value); }}>
        <input type="number" name="stock" placeholder="New stock quantity" />
        <button type="submit">Update Stock</button>
      </form> */}
    </div>
  );
};

export default Product;