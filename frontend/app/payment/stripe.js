import axios from "axios";
import {Elements} from "@stripe/react-stripe-js";
import CheckoutForm from "@/app/payment/checkoutForm";
import {useState} from "react";
import {loadStripe} from "@stripe/stripe-js";
import {useRouter} from "next/navigation";
import Cookies from "js-cookie";
import {router} from "next/client";

const stripePromise = loadStripe(`${process.env.NEXT_PUBLIC_KEY_STRIPE_API}`);


export const fetchClientSecret = async (price, products, email) => {
    try {
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/stripe/payment-intent`,
            {
                price: price,
                currency: "pln",
                receiptEmail: email,
                products: products.map((product) => product.name),
            }
        );
        return response.data.client_secret;
    } catch (error) {
        console.error("Error fetching client secret:", error);
    }
};

const handleSuccess = async (productID, quantity, router) => {
    try {
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/purchases`,
            {
                userId: Cookies.get('authToken'),
                productId: productID,
                quantity: quantity,
            }
        );
        return response.data.client_secret;
    } catch (error) {
        console.error("Error fetching client secret:", error);
    } finally {
        router.push("/success")
    }
}
const MainComponent = ({clientSecret, setClientSecret, productID, quantity}) => {
    const router = useRouter();

    const paymentElementsOptions = {
        clientSecret: clientSecret,
        appearance: {
            theme: "night",
        },
    }
    return (
        <div
            className={"overlay"} // Gray background
            onClick={() => setClientSecret(false)} // Close modal on background click
        >
            <div
                className={"modal"} // Centered modal
                onClick={(e) => e.stopPropagation()} // Prevent click bubbling
            >
                <Elements stripe={stripePromise} options={paymentElementsOptions}>
                    <CheckoutForm onSuccess={() => handleSuccess(productID, quantity, router)}/>
                </Elements>
            </div>
        </div>

    );
};

export default MainComponent;