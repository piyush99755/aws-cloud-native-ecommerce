import React from "react";
import { Link } from "react-router-dom";

function ConfirmationStep({ paymentSuccess }) {
  return (
    <div className="text-center mt-10">
      {paymentSuccess ? (
        <>
          <h2 className="text-3xl font-bold mb-4 text-green-600">Payment Successful!</h2>
          <p>Your order has been placed successfully.</p>
          <Link
            to="/orders"
            className="mt-4 inline-block bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            View Orders
          </Link>
        </>
      ) : (
        <h2 className="text-2xl font-bold text-red-500">Payment failed</h2>
      )}
    </div>
  );
}

export default ConfirmationStep;
