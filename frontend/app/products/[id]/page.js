"use client";

import {Button} from "@mui/material";
import axios from "axios";
import {useContext, useEffect, useState} from "react";
import {useParams, useRouter} from "next/navigation";
import {Elements} from "@stripe/react-stripe-js";
import CheckoutForm from "@/app/payment/checkoutForm";
import {AuthContext} from "@/app/AuthContext";
import {loadStripe} from "@stripe/stripe-js";
import MainComponent, {fetchClientSecret} from "@/app/payment/stripe";
import Cookies from "js-cookie";

const stripePromise = loadStripe(`${process.env.NEXT_PUBLIC_KEY_STRIPE_API}`);

const Page = () => {

    const params = useParams()
    const id = params.id;// Extract 'id' from the URL
    const [clientSecret, setClientSecret] = useState(undefined);
    const [fetching, setFetching] = useState(false);
    const [quantity, setQuantity] = useState(1); // Start from 1
    const {email, addProductToCart} = useContext(AuthContext);
    const token = Cookies.get('authToken');

    const router = useRouter();
    const [product, setProduct] = useState([]);
    useEffect(() => {
        // Fetch products on component mount
        const fetchProducts = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/${id}`);
                if (!res.ok) throw new Error("Failed to fetch products");
                const data = await res.json();
                setProduct(data);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        fetchProducts();
    }, []);

    const fetchClientSecretWithProducts = async () => {
        if (token) {
            return await fetchClientSecret(product.price * quantity * 100, [product], email)
                .then((response) => {
                    setClientSecret(response);

                })
                .catch((error) => {
                    console.error("Error fetching client secret:", error);
                })
        } else {
            router.push('/login');
        }
    };

    const addCurrentProductToCart = (product) => {
        if (token) {
            addProductToCart({productID: product.id, quantity: quantity});
        } else {
            router.push('/login');
        }
    }


    const increaseQuantity = () => {
        if (quantity < product.quantity) {
            setQuantity((prev) => prev + 1);
        }
    };

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity((prev) => prev - 1);
        }
    };

    return (
        <div className="product-card">

            <img src={product.img} alt={"product name"} className="product-card-image"/>
            <div>
                <h2 className="product-card-name">{product.name}</h2>
                <p className="product-card-price">{product.price + " zł"}</p>
                <p className="product-card-description">{product.description}</p>
                <div className="product-card-quantity-container">
                    <button onClick={decreaseQuantity} className="quantity-button">-</button>
                    <p className="product-card-quantity">{quantity}</p>
                    <button onClick={increaseQuantity} className="quantity-button">+</button>
                </div>

                <div className="button-group">
                    <Button label="Buy Now" className={"front-page-button"}
                            onClick={fetchClientSecretWithProducts}> Buy now</Button>
                    <Button disabled label="Put in Later" className={"front-page-button"}
                            onClick={() => {
                                addCurrentProductToCart(product, quantity);
                                alert('Added to Later');

                            }}> Put in Cart </Button>
                </div>
            </div>
            {clientSecret &&
                <MainComponent clientSecret={clientSecret} setClientSecret={setClientSecret} productID={product.id}
                               quantity={quantity}></MainComponent>}

        </div>
    );
};

export default Page;