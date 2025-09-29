import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useAuth } from "react-oidc-context";

const API_URL = "https://api.piyushkumartadvi.link";

function PaymentForm({ items, total }) {
  const auth = useAuth();
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handlePayment = async () => {
    if (!stripe || !elements) return;
    if (!auth.user?.access_token) {
      setError("You must be logged in to pay.");
      return;
    }

    const amountInCents = Math.round(total * 100);
    if (!amountInCents || amountInCents <= 0) {
      setError("Invalid payment amount.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("Creating payment intent with:", { amount: amountInCents, currency: "usd" });

      const res = await fetch(`${API_URL}/api/payment/create-payment-intent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.user.access_token}`,
        },
        body: JSON.stringify({
          amount: amountInCents,
          currency: "usd",
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to create payment intent: ${res.status} ${text}`);
      }

      const { clientSecret } = await res.json();
      if (!clientSecret) throw new Error("Missing client secret from server");

      const cardElement = elements.getElement(CardElement);
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: { email: auth.user.profile?.email },
        },
      });

      if (result.error) throw new Error(result.error.message);
      if (result.paymentIntent.status !== "succeeded") throw new Error("Payment failed");

      // Create order after payment
      const orderRes = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.user.access_token}`,
        },
        body: JSON.stringify({
          items,
          total,
          paymentIntentId: result.paymentIntent.id,
        }),
      });

      if (!orderRes.ok) {
        const text = await orderRes.text();
        throw new Error(`Failed to create order: ${orderRes.status} ${text}`);
      }

      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded shadow bg-white">
      <CardElement className="p-2 border rounded" />
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {success && <p className="text-green-500 mt-2">Payment successful!</p>}
      <button
        onClick={handlePayment}
        disabled={!stripe || loading}
        className="mt-4 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </div>
  );
}

export default PaymentForm;
