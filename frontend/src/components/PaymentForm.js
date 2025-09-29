import React from "react";
import { CardElement } from "@stripe/react-stripe-js";

function PaymentForm({ onPay, loading, stripeReady }) {
  return (
    <div className="mb-4 p-4 border rounded bg-white shadow">
      <label className="block mb-2 font-medium">Card Details</label>
      <div className="p-2 border rounded bg-gray-50">
        <CardElement options={{ hidePostalCode: true }} />
      </div>

      <button
        onClick={onPay}
        disabled={!stripeReady || loading}
        className="mt-4 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </div>
  );
}

export default PaymentForm;

