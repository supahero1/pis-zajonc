import {
  useStripe,
  useElements, PaymentElement,
} from "@stripe/react-stripe-js";
import { useState } from "react";

export default function CheckoutForm({onSuccess}) {
  const stripe = useStripe();
  const elements = useElements();

  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsProcessing(true);

    if (!stripe || !elements) {
      setError("Stripe has not yet loaded.");
      setIsProcessing(false);
      return;
    }

    console.log("Payment processing...");

    await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    }).then(() => {
      onSuccess();
    }).catch((error) => {
      console.error(error.message);
    }).finally(() => {
      setIsProcessing(false);
    });
  };

  return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="card-element" className="block text-sm font-medium text-gray-300">
            Card Details
          </label>
          <div
              id="card-element"
              className="mt-1 px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-700 text-gray-100 border-gray-600"
          >
            <PaymentElement />
          </div>
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button
            type="submit"
            disabled={!stripe || isProcessing}
            className={`w-full py-2 px-4 font-medium rounded-md shadow-sm ${
                isProcessing
                    ? "bg-gray-600 cursor-not-allowed text-gray-400"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white"
            }`}
        >
          {isProcessing ? "Processing..." : "Pay Now"}
        </button>
      </form>
  );
};
