import React, { useState } from 'react';
import './AddProduct.css';
import upload_area from '../../assets/upload_area.svg';

const AddProduct = () => {
    // State to manage the image file
    const [image, setImage] = useState(false);
    // State to manage product details
    const [productDetails, setProductDetails] = useState({
        name: "",
        image: "",
        category: "women",
        new_price: "",
        old_price: "",
        stock: "", // Added stock field
    });

    // Handler for image input change
    const imageHandler = (e) => {
        setImage(e.target.files[0]);
    };

    // Handler for other input changes
    const changeHandler = (e) => {
        setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
    };

    // Function to add product
    const Add_Product = async () => {
        console.log(productDetails);
        let responseData;
        let product = productDetails;

        // Create form data for image upload
        let formData = new FormData();
        formData.append('product', image);

        // Upload image to server
        await fetch('http://localhost:4000/upload', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
            },
            body: formData,
        }).then((resp) => resp.json()).then((data) => { responseData = data });

        // If image upload is successful, add product details to server
        if (responseData.success) {
            product.image = responseData.image_url;
            console.log(product);
            await fetch('http://localhost:4000/addproduct', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(product),
            }).then((resp) => resp.json()).then((data) => {
                data.success ? alert("Product Added") : alert("Failed")
            })

        }
    };

    return (
        <div className='add-product'>
            {/* Input field for product title */}
            <div className="addproduct-itemfield">
                <p>Product title</p>
                <input value={productDetails.name} onChange={changeHandler} type="text" name='name' placeholder='Type here' />
            </div>
            {/* Input fields for price and offer price */}
            <div className="addproduct-price">
                <div className="addproduct-itemfield">
                    <p>Price</p>
                    <input value={productDetails.old_price} onChange={changeHandler} type="text" name="old_price" placeholder="Type here" />
                </div>
                <div className="addproduct-itemfield">
                    <p>Offer Price</p>
                    <input value={productDetails.new_price} onChange={changeHandler} type="text" name="new_price" placeholder="Type here" />
                </div>
            </div>
            {/* Input field for stock */}
            <div className="addproduct-itemfield">
                <p>Stock</p> {/* Added stock input field */}
                <input value={productDetails.stock} onChange={changeHandler} type="number" name="stock" placeholder="Type here" />
            </div>
            {/* Dropdown for product category */}
            <div className="addproduct-itemfield">
                <p>Product Category</p>
                <select value={productDetails.category} onChange={changeHandler} name="category" className="add-product-selector">
                    <option value="Primary">Primary</option>
                    <option value="Secondary">Secondary</option>
                    <option value="Six form">Sixth Form</option>
                </select>
            </div>
            {/* Image upload field */}
            <div class="addproduct-itemfield">
                <label htmlFor="file-input">
                    <img src={image ? URL.createObjectURL(image) : upload_area} className="addproduct-thumnail-img" alt="" />
                </label>
                <input onChange={imageHandler} id="file-input" type="file" name='image' hidden />
            </div>
            {/* Button to add product */}
            <button onClick={() => { Add_Product() }} className='addproduct-btn'>ADD</button>
        </div>
    );
};

export default AddProduct;
