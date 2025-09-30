import React, { useState } from "react";
import { useCart } from "../CartContext";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useAuth } from "react-oidc-context";
import PaymentForm from "../PaymentForm";

const API_URL = "https://api.piyushkumartadvi.link";

function PaymentStep({ nextStep, prevStep, guestMode, shippingData, setPaymentSuccess }) {
  const { cart, clearCart } = useCart();
  const stripe = useStripe();
  const elements = useElements();
  const auth = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePay = async () => {
    if (!stripe || !elements) return;

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${API_URL}/api/payment/create-payment-intent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.user?.access_token || ""}`,
        },
        body: JSON.stringify({ amount: Math.round(total * 100), currency: "usd" }),
      });

      const { clientSecret } = await res.json();
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: { email: auth.user?.profile?.email || "" },
        },
      });

      if (result.error) throw new Error(result.error.message);

      if (result.paymentIntent.status === "succeeded") {
        setPaymentSuccess(true);

        if (!guestMode) {
          await fetch(`${API_URL}/api/orders`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.user?.access_token}`,
            },
            body: JSON.stringify({
              items: cart,
              total: total.toFixed(2),
              paymentIntentId: result.paymentIntent.id,
              shipping: shippingData,
            }),
          });
        }

        clearCart();
        nextStep();
      }
    } catch (err) {
      setMessage(err.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {guestMode && (
        <div className="bg-yellow-100 text-yellow-800 p-3 rounded mb-4">
          You are checking out as a guest. Sign in to save your order history.
        </div>
      )}

      <h2 className="text-2xl font-bold mb-4">Payment</h2>

      <PaymentForm onPay={handlePay} loading={loading} stripeReady={!!stripe} />

      {message && (
        <p
          className={`mt-4 ${
            message.toLowerCase().includes("success") ? "text-green-600" : "text-red-500"
          }`}
        >
          {message}
        </p>
      )}

      <div className="flex justify-between mt-6">
        <button
          onClick={prevStep}
          className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
        >
          Back
        </button>
      </div>
    </div>
  );
}

export default PaymentStep;
