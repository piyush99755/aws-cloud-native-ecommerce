import React from "react";
import { useCart } from "../CartContext";
import CartItem from "../CartItem";

function CartStep({ nextStep }) {
  const { cart, addToCart, decrementFromCart, removeFromCart, isEmpty } = useCart();
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (isEmpty) return <p className="text-center mt-10 text-lg">Your cart is empty.</p>;

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cart.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            addToCart={addToCart}
            decrementFromCart={decrementFromCart}
            removeFromCart={removeFromCart}
          />
        ))}
      </div>

      <div className="mt-6 text-right">
        <h3 className="text-xl font-bold mb-2">Total: ${total.toFixed(2)}</h3>
        <button
          onClick={nextStep}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          Next: Shipping
        </button>
      </div>
    </div>
  );
}

export default CartStep;
