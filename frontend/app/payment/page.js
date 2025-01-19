"use client";

import {Elements} from "@stripe/react-stripe-js";
import {loadStripe} from "@stripe/stripe-js";
import {useState} from "react";
import axios from "axios";
import CheckoutForm from "./checkoutForm";
import {useRouter} from "next/navigation";

const stripePromise = loadStripe(`${process.env.NEXT_PUBLIC_KEY_STRIPE_API}`);

export default function Page() {
    const [clientSecret, setClientSecret] = useState(undefined);
    const [fetching, setFetching] = useState(false);

    const [email, setEmail] = useState("example@example.com");

    const router = useRouter();

    const fetchClientSecret = async () => {
        setFetching(true);
        return await axios.post(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/stripe/payment-intent`,
            {
                amount: 100000,
                currency: "usd",
                receiptEmail: email,
                products: ["v-dolce"]
            })
            .then((response) => {
                setClientSecret(response.data.client_secret);
            })
            .catch((error) => {
                console.error("Error fetching client secret:", error);
            })
            .finally(() => {
                setFetching(false)
            });
    };

    const paymentElementsOptions = {
        clientSecret: clientSecret,
        appearance: {
            theme: "night",
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-lg w-full" style={{marginTop: "6vh"}}>
                <h2 className="text-2xl font-semibold mb-4 text-gray-100 text-center">
                    Checkout
                </h2>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                        Email
                    </label>
                    <div className="flex flex-row gap-3">
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-700 text-gray-100 border-gray-600"
                            disabled={fetching}
                        />
                        <button
                            className={`py-2 px-4 font-medium rounded-md shadow-sm mt-1 text-white
                  ${fetching ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                            onClick={fetchClientSecret}
                            disabled={fetching}
                        >
                            Save
                        </button>
                    </div>
                </div>
                {clientSecret &&
                    <Elements stripe={stripePromise} options={paymentElementsOptions}>
                        <CheckoutForm onSuccess={() => router.push("/success")}/>
                    </Elements>
                }
            </div>
        </div>
    );
}
