import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useCart } from "./CartContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "react-oidc-context";

function Checkout({ guestMode }) {
  const { cart, clearCart } = useCart();
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const auth = useAuth();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  if (!guestMode && cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-lg text-gray-700">Add items to cart to checkout.</p>
      </div>
    );
  }

  const handlePay = async () => {
    if (!stripe || !elements) return;
    setLoading(true);
    try {
      const res = await fetch("/api/payment/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Math.round(total * 100), currency: "usd" }),
      });
      const { clientSecret } = await res.json();

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: elements.getElement(CardElement) },
      });

      if (result.error) setMessage(result.error.message);
      else if (result.paymentIntent.status === "succeeded") {
        setMessage("Payment successful!");
        if (!guestMode) {
          const token = auth.user?.access_token;
          await fetch("/api/orders", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ items: cart, total: total.toFixed(2) }),
          });
        }
        clearCart();
        setTimeout(() => navigate("/orders"), 1500);
      }
    } catch {
      setMessage("Something went wrong, please try again!");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">Checkout</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {cart.map((item) => (
          <div
            key={item.id}
            className="flex flex-col bg-white shadow rounded-lg p-4"
          >
            <img
              src={item.image || "/placeholder.png"}
              alt={item.name}
              className="h-32 object-contain mb-2"
            />
            <div className="flex flex-col flex-1">
              <p className="font-semibold">{item.name}</p>
              <p className="text-gray-700">${item.price} × {item.quantity}</p>
            </div>
          </div>
        ))}
      </div>

      <h3 className="text-xl font-bold mb-4">Total: ${total.toFixed(2)}</h3>

      <div className="mb-4 p-4 border rounded bg-white shadow">
        <CardElement className="p-2 border rounded" />
      </div>

      <button
        onClick={handlePay}
        disabled={!stripe || loading}
        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>

      {message && (
        <p
          className={`mt-4 ${
            message.toLowerCase().includes("success") ? "text-green-600" : "text-red-500"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}

export default Checkout;
