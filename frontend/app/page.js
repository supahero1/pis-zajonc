"use client"

import {useContext, useEffect, useState} from "react";
import Product from "@/app/front-page/product";
import {AuthContext} from "@/app/AuthContext";


export default function Page() {
    const [products, setProducts] = useState([]);
    const {searchedWord} = useContext(AuthContext);
    const [filteredProducts, setFilteredProducts] = useState([]);
    useEffect(() => {
        const fetchProducts = async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products`);
            const productsData = await res.json();
            setProducts(productsData);
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        // Filter products based on searched word
        if (searchedWord) {
            setFilteredProducts(products.filter((product) =>
                product.name.toLowerCase().includes(searchedWord.toLowerCase())
            ))
        } else {
            setFilteredProducts(products)
        }
    }, [searchedWord, products]);

    return (
        <div className="front-page-main-div">

            <div className="product-page" style={{cursor: "pointer"}}>
                {filteredProducts.map((product) => (
                    // Render a <Product /> component for each number
                    <Product key={product.id} img={product.image} productName={product.name}
                             price={product.price + " zł"} id={product.id}/>
                ))}
            </div>
        </div>
    );
}
