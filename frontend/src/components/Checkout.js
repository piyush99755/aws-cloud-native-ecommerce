import React, { useState, useEffect } from "react";
import { useCart } from "./CartContext";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import CheckoutItem from "./CheckoutItem";
import SkeletonCheckoutItem from "./SkeletonCheckoutItem";
import PaymentForm from "./PaymentForm";

const API_URL = "https://api.piyushkumartadvi.link";

function Checkout({ guestMode }) {
  // ===== Hooks =====
  const { cart, clearCart } = useCart();
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const auth = useAuth();

  // ===== State =====
  const [loading, setLoading] = useState(false);
  const [loadingItems, setLoadingItems] = useState(true);
  const [message, setMessage] = useState("");

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // ===== Skeleton Loader Simulation =====
  useEffect(() => {
    const timer = setTimeout(() => setLoadingItems(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // ===== Early return for empty cart =====
  if (!guestMode && cart.length === 0) {
    return <p className="text-center mt-10 text-lg">Add items to cart to checkout.</p>;
  }

  // ===== Handle Payment =====
  const handlePay = async () => {
    if (!stripe || !elements) return;

    setLoading(true);
    try {
      // Create payment intent
      const res = await fetch(`${API_URL}/api/payment/create-payment-intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Math.round(total * 100), currency: "usd" }),
      });
      const { clientSecret } = await res.json();

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: elements.getElement(CardElement) },
      });

      if (result.error) {
        setMessage(result.error.message);
      } else if (result.paymentIntent.status === "succeeded") {
        setMessage("Payment successful!");

        if (!guestMode) {
          const token = auth.user?.access_token;
          await fetch(`${API_URL}/api/orders`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ items: cart, total: total.toFixed(2) }),
          });
        }

        clearCart();
        navigate("/orders");
      }
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong, please try again!");
    } finally {
      setLoading(false);
    }
  };

  // ===== Render =====
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">Checkout</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {loadingItems
          ? [...Array(cart.length || 3)].map((_, i) => <SkeletonCheckoutItem key={i} />)
          : cart.map((item) => <CheckoutItem key={item.id} item={item} />)}
      </div>

      <h3 className="text-xl font-bold mb-4">Total: ${total.toFixed(2)}</h3>

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
    </div>
  );
}

export default Checkout;
