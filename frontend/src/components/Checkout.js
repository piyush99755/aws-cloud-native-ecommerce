import React, { useState, useEffect } from "react";
import { useCart } from "./CartContext";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import CheckoutItem from "./CheckoutItem";
import SkeletonCheckoutItem from "./SkeletonCheckoutItem";
import PaymentForm from "./PaymentForm";
import { motion, AnimatePresence } from "framer-motion";

const API_URL = "https://api.piyushkumartadvi.link";

function Checkout({ guestMode }) {
  const { cart, clearCart } = useCart();
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const auth = useAuth();

  const [loading, setLoading] = useState(false);
  const [loadingItems, setLoadingItems] = useState(true);
  const [message, setMessage] = useState("");

  const total = cart.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);

  useEffect(() => {
    const timer = setTimeout(() => setLoadingItems(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (!guestMode && cart.length === 0) {
    return <p className="text-center mt-10 text-lg">Add items to cart to checkout.</p>;
  }

  const handlePay = async () => {
    if (!stripe || !elements) return;
    const amountInCents = Math.round(total * 100);
    if (isNaN(amountInCents) || amountInCents <= 0) {
      setMessage("Invalid payment amount.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${API_URL}/api/payment/create-payment-intent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.user?.access_token || ""}`,
        },
        body: JSON.stringify({ amount: amountInCents, currency: "usd" }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData?.error || "Failed to create payment intent");
      }

      const { clientSecret } = await res.json();
      if (!clientSecret) throw new Error("Missing client secret from server");

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: { email: auth.user?.profile?.email || "" },
        },
      });

      if (result.error) throw new Error(result.error.message);

      if (result.paymentIntent.status === "succeeded") {
        setMessage("Payment successful!");
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
            }),
          });
        }
        clearCart();
        navigate("/orders");
      }
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Something went wrong, please try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">Checkout</h2>

      <AnimatePresence>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          layout
        >
          {loadingItems
            ? [...Array(cart.length || 3)].map((_, i) => <SkeletonCheckoutItem key={i} />)
            : cart.map((item) => <CheckoutItem key={item.id} item={item} />)}
        </motion.div>
      </AnimatePresence>

      <h3 className="text-xl font-bold mb-4">Total: ${total.toFixed(2)}</h3>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
      >
        <PaymentForm
          onPay={handlePay}
          loading={loading}
          stripeReady={!!stripe}
        />
      </motion.div>

      {message && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`mt-4 ${
            message.toLowerCase().includes("success") ? "text-green-600" : "text-red-500"
          }`}
          role="alert"
        >
          {message}
        </motion.p>
      )}
    </div>
  );
}

export default Checkout;
