import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useAuth } from "react-oidc-context";

export default function PaymentForm({ items, total, onPaymentSuccess }) {
  const auth = useAuth();
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePayment = async () => {
    if (!stripe || !elements) return;
    if (!auth.user || !auth.isAuthenticated) {
      setError("You must be logged in to pay.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Create PaymentIntent on server
      const res = await fetch(
        "https://api.piyushkumartadvi.link/api/payment/create-payment-intent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.user.access_token}`,
          },
          body: JSON.stringify({
            amount: Math.round(total * 100),
            currency: "usd",
          }),
        }
      );

      if (!res.ok) throw new Error("Failed to create payment intent");

      const { clientSecret } = await res.json();
      if (!clientSecret) throw new Error("Missing client secret from server");

      // 2. Confirm card payment
      const cardElement = elements.getElement(CardElement);
      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: { email: auth.user.profile?.email },
        },
      });

      if (paymentResult.error) throw new Error(paymentResult.error.message);
      if (paymentResult.paymentIntent.status !== "succeeded")
        throw new Error("Payment failed");

      // 3. Create order after payment success
      const orderRes = await fetch(
        "https://api.piyushkumartadvi.link/api/orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.user.access_token}`,
          },
          body: JSON.stringify({
            items,
            total,
            paymentIntentId: paymentResult.paymentIntent.id,
          }),
        }
      );

      if (!orderRes.ok) throw new Error("Failed to create order");

      const orderData = await orderRes.json();
      onPaymentSuccess(orderData); // callback to parent
    } catch (err) {
      console.error(err);
      setError(err.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-4 p-4 border rounded bg-white shadow">
      <CardElement className="p-2 border rounded" />
      {error && <p className="text-red-500 mt-2">{error}</p>}
      <button
        onClick={handlePayment}
        disabled={!stripe || !elements || loading}
        className="mt-4 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </div>
  );
}
