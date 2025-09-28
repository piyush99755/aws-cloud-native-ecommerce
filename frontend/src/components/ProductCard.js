import React, { memo } from "react";

const ProductCard = memo(({ product, cartItem, addToCart, decrementFromCart }) => (
  <div className="bg-white shadow-md rounded-lg p-4 flex flex-col hover:shadow-xl transition">
    <img
      src={product.image || "/placeholder.png"}
      alt={product.name}
      className="h-40 w-full object-contain mb-4"
    />
    <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
    <p className="text-gray-700 mb-4">${product.price}</p>

    {cartItem ? (
      <div className="flex items-center justify-between mt-auto">
        <button
          className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
          onClick={() => decrementFromCart(product.id)}
        >
          -
        </button>
        <span>{cartItem.quantity}</span>
        <button
          className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
          onClick={() => addToCart(product)}
        >
          +
        </button>
      </div>
    ) : (
      <button
        className="mt-auto bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
        onClick={() => addToCart(product)}
      >
        Add to Cart
      </button>
    )}

    {cartItem && (
      <div className="mt-2 flex justify-between space-x-2">
        <button
          className="flex-1 bg-green-500 text-white py-1 rounded hover:bg-green-600 transition text-sm"
          onClick={() => (window.location.href = "/cart")}
        >
          Go to Cart
        </button>
        <button
          className="flex-1 bg-yellow-500 text-white py-1 rounded hover:bg-yellow-600 transition text-sm"
          onClick={() => (window.location.href = "/checkout")}
        >
          Checkout
        </button>
      </div>
    )}
  </div>
));

export default ProductCard;
