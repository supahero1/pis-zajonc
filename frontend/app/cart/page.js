"use client";

import "./cart.css"
import React, {useContext, useEffect, useState} from "react";
import {AuthContext} from "@/app/AuthContext";
import axios from "axios";
import {Button} from "@mui/material";
import MainComponent, {fetchClientSecret} from "@/app/payment/stripe";

const Page = () => {
    // Sample cart data
    const {cartProducts} = useContext(AuthContext);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [clientSecret, setClientSecret] = useState(undefined);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const fetchedProducts = await Promise.all(
                    cartProducts.map(async (product) => {
                        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/${product.productID}`);
                        return {
                            ...response.data,        // Spread the fetched product details
                            chosenQuantity: product.quantity,      // Initialize choosenQuantity with 1
                        };
                    })
                );
                setProducts(fetchedProducts);
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };
        if (cartProducts.length > 0) {
            fetchProducts();
        } else {
            setLoading(false); // No products, stop loading
        }
    }, [cartProducts]);
    // Calculate total price
    const totalPrice = products.reduce((acc, item) => acc + item.price * item.chosenQuantity, 0);

    const handleBuy = () => {
        alert("Purchase successful!"); // Replace with actual purchase logic
    };
    const {email} = useContext(AuthContext);
    const fetchClientSecretWithProducts = async () => {
        return await fetchClientSecret(totalPrice * 100, products, email)
            .then((response) => {
                setClientSecret(response);

            })
            .catch((error) => {
                console.error("Error fetching client secret:", error);
            })
    };

    return (
        <div className="cart-container">
            <h1>Shopping Cart</h1>
            <div className="cart-items">
                {products.map((product, index) => (
                    <div className="cart-item" key={product.id + index}>
                        <span className="product-name">{product.name}</span>
                        <span className="product-price">{product.price.toFixed(2)} zł</span>
                        <span className="product-quantity">x{product.chosenQuantity}</span>
                        <span className="product-total">{(product.price * product.chosenQuantity).toFixed(2)} zł</span>

                    </div>
                ))}
            </div>
            <div className="cart-summary">
                <h3>Total: {totalPrice.toFixed(2)} zł</h3>
                <Button label="Buy Now" className={"front-page-button"}
                        onClick={fetchClientSecretWithProducts}> Buy now</Button>
            </div>
            {clientSecret &&
                <MainComponent clientSecret={clientSecret} setClientSecret={setClientSecret}></MainComponent>}

        </div>
    );
};

export default Page;
