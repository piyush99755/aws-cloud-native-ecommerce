import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "./CartContext";

function Cart({ guestMode }) {
  const { cart, addToCart, decrementFromCart, removeFromCart, isEmpty } = useCart();
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!guestMode && isEmpty) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-lg text-gray-700">Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">Shopping Cart</h2>

      {isEmpty ? (
        <p className="text-gray-700">Your cart is empty.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex flex-col bg-white rounded-lg shadow p-4"
            >
              <img
                src={item.image || "/placeholder.png"}
                alt={item.name}
                className="h-40 object-contain mb-4"
              />
              <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
              <p className="text-gray-700 mb-4">
                ${item.price} × {item.quantity}
              </p>

              <div className="flex items-center justify-between mt-auto space-x-2">
                <button
                  onClick={() => decrementFromCart(item.id)}
                  className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => addToCart(item)}
                  className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                >
                  +
                </button>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isEmpty && (
        <div className="mt-6 text-right">
          <h3 className="text-xl font-bold mb-2">Total: ${total.toFixed(2)}</h3>
          <Link
            to="/checkout"
            className="inline-block bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition"
          >
            Proceed to Checkout
          </Link>
        </div>
      )}
    </div>
  );
}

export default Cart;
