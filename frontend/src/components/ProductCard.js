import React, { memo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const ProductCard = memo(({ product, cartItem, addToCart, decrementFromCart }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      className="bg-white shadow-md rounded-lg p-4 flex flex-col hover:shadow-xl transition-transform duration-200 ease-in-out"
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
    >
      <img
        src={product.image || "/placeholder.png"}
        alt={product.name}
        className="h-40 w-full object-contain mb-4"
      />
      <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
      <p className="text-gray-700 font-medium mb-4">${product.price}</p>

      {cartItem ? (
        <div className="flex items-center justify-between mt-auto">
          <button
            className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
            onClick={() => decrementFromCart(product.id)}
            aria-label={`Remove one ${product.name} from cart`}
          >
            -
          </button>
          <span>{cartItem.quantity}</span>
          <button
            className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
            onClick={() => addToCart(product)}
            aria-label={`Add one ${product.name} to cart`}
          >
            +
          </button>
        </div>
      ) : (
        <button
          className="mt-auto bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition focus:outline-none focus:ring-2 focus:ring-blue-600"
          onClick={() => addToCart(product)}
          aria-label={`Add ${product.name} to cart`}
        >
          Add to Cart
        </button>
      )}

      {cartItem && (
        <div className="mt-2 flex justify-between space-x-2">
          {/* Secondary Action: Go to Cart */}
          <button
            className="flex-1 border border-blue-500 text-blue-500 py-1 rounded hover:bg-blue-50 transition focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            onClick={() => navigate("/cart")}
          >
            Go to Cart
          </button>

          {/* Primary Action: Checkout */}
          <button
            className="flex-1 bg-blue-500 text-white py-1 rounded hover:bg-blue-600 transition focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
            onClick={() => navigate("/checkout")}
          >
            Checkout
          </button>
        </div>
      )}
    </motion.div>
  );
});

export default ProductCard;
