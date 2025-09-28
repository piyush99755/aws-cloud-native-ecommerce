import React from "react";
import { useCart } from "./CartContext";
import { Link } from "react-router-dom";

function ProductCard({ product }) {
  const { cart, addToCart, decrementFromCart, removeFromCart } = useCart();

  const cartItem = cart.find((item) => item.id === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  return (
    <div className="bg-white shadow rounded-lg p-4 flex flex-col">
      {/* Product Image */}
      <img
        src={product.image || "/placeholder.png"}
        alt={product.name}
        className="w-full h-40 object-cover rounded mb-4"
      />

      {/* Product Info */}
      <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
      <p className="text-gray-700 mb-4">${product.price}</p>

      {/* Bottom Action Area */}
      <div className="mt-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        {/* Left: Add / Quantity Controls */}
        {quantity === 0 ? (
          <button
            onClick={() => addToCart(product)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition w-full sm:w-auto"
          >
            Add to Cart
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => decrementFromCart(product.id)}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            >
              -
            </button>
            <span className="px-2">{quantity}</span>
            <button
              onClick={() => addToCart(product)}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            >
              +
            </button>
          </div>
        )}

        {/* Right: Cart / Checkout Buttons */}
        {quantity > 0 && (
          <div className="flex gap-2 mt-2 sm:mt-0">
            <Link
              to="/cart"
              className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition text-sm"
            >
              Cart
            </Link>
            <Link
              to="/checkout"
              className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition text-sm"
            >
              Checkout
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductCard;
