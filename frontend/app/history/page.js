"use client";

import React, {useContext, useEffect, useState} from "react";
import axios from "axios";
import "./ShoppingHistory.css";
import {AuthContext} from "@/app/AuthContext";
import Cookies from "js-cookie";

export default function Page() {


    const [purchases, setPurchases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = Cookies.get("authToken");
    useEffect(() => {
        const fetchPurchases = async () => {
            try {
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/purchases?userId=${token}`
                );
                setPurchases(response.data);
                console.log(response);
            } catch (err) {
                setError("Failed to load purchase history.");
            } finally {
                setLoading(false);
            }
        };

        fetchPurchases();
    }, []);

    if (loading) return <div className="loader">Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="container">
            <h1 className="heading">Shopping History</h1>
            {purchases.length === 0 ? (
                <p className="no-data">No purchases found.</p>
            ) : (
                <div className="list">
                    {purchases.map((purchase, index) => (
                        <div key={index} className="card">
                            <img
                                src={purchase.product.image || "/placeholder.png"}
                                alt={purchase.product.name}
                                className="image"
                            />
                            <div className="details">
                                <h2 className="product-name">{purchase.product.name}</h2>
                                <p className="description">{purchase.product.description}</p>
                                <p className="price">Price: ${purchase.product.price.toFixed(2)}</p>
                                <p className="quantity">Quantity: {purchase.quantity}</p>
                                <p className="total-price">Total: ${purchase.totalPrice.toFixed(2)}</p>
                                <p className="date">
                                    Purchased on:{" "}
                                    {new Date(purchase.purchaseDate).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};



