import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "./PaymentForm";

const stripePromise = loadStripe("pk_test_your_public_key"); // replace with your Stripe public key

export default function CheckoutWrapper({ items, total, onPaymentSuccess }) {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm
        items={items}
        total={total}
        onPaymentSuccess={onPaymentSuccess}
      />
    </Elements>
  );
}
