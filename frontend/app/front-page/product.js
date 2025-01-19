"use client";

import {useRouter} from "next/navigation";

export default function Product({img, productName, price, id}) {
    const router = useRouter();

    const handleClick = () => {
        router.push(`/products/${id}`);
    };

    return (
        <div className="product" onClick={handleClick}>
            <img className={"product-image"} src={img} alt="product image"/>
            <p className={"product-price"}>{price + " zł"}</p>
            <h3 className={"product-name"}>{productName}</h3>


        </div>
    )

}