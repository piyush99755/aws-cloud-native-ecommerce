import React, { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";

function PaymentForm({ items, total, auth }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const onPay = async () => {
    if (!stripe || !elements) return;
    setLoading(true);
    setError(null);

    try {
      // 1️⃣ Create PaymentIntent
      const res = await fetch("https://api.piyushkumartadvi.link/api/payment/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.user?.access_token}`,
        },
        body: JSON.stringify({
          amount: Math.round(total * 100), // convert dollars to cents
          currency: "usd",
        }),
      });

      if (!res.ok) throw new Error("Failed to create payment intent");

      const { clientSecret } = await res.json();
      if (!clientSecret) throw new Error("Missing client secret from server");

      // 2️⃣ Confirm payment
      const cardElement = elements.getElement(CardElement);
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: { email: auth.user?.profile?.email },
        },
      });

      if (result.error) throw new Error(result.error.message);
      if (result.paymentIntent.status !== "succeeded") throw new Error("Payment failed");

      // 3️⃣ Create order in backend
      const orderRes = await fetch("https://api.piyushkumartadvi.link/api/orders", {
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
    <div className="mb-4 p-4 border rounded bg-white shadow">
      <CardElement className="p-2 border rounded" />
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {success && <p className="text-green-500 mt-2">Payment successful!</p>}
      <button
        onClick={onPay}
        disabled={!stripe || loading}
        className="mt-4 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </div>
  );
}

export default PaymentForm;
