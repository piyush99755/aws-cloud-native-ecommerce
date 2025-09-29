import React, { useState } from "react";
import { useAuth } from "react-oidc-context";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe("pk_test_your_public_key"); // replace with your Stripe public key
const API_URL = "https://api.piyushkumartadvi.link";

function CheckoutForm({ items, total }) {
  const auth = useAuth();
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!stripe || !elements) return;

    try {
      //  Create PaymentIntent on the server
      const res = await fetch(`${API_URL}/api/payment/create-payment-intent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.user?.access_token}`,
        },
        body: JSON.stringify({
          amount: Math.round(total * 100), // convert to cents
          currency: "usd",
        }),
      });

      if (!res.ok) throw new Error("Failed to create payment intent");

      const { clientSecret } = await res.json();
      if (!clientSecret) throw new Error("Missing client secret from server");

      //  Confirm card payment
      const cardElement = elements.getElement(CardElement);
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: { email: auth.user?.profile?.email },
        },
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      if (result.paymentIntent.status !== "succeeded") {
        throw new Error("Payment failed");
      }

      // Create order after successful payment
      const orderRes = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.user?.access_token}`,
        },
        body: JSON.stringify({
          items,
          total,
          paymentIntentId: result.paymentIntent.id,
        }),
      });

      if (!orderRes.ok) throw new Error("Failed to create order");

      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handlePayment} className="space-y-4">
      <CardElement />
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">Payment successful!</p>}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {loading ? "Processing..." : "Pay"}
      </button>
    </form>
  );
}

// Wrap CheckoutForm with Elements
export default function CheckoutWrapper({ items, total }) {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm items={items} total={total} />
    </Elements>
  );
}
