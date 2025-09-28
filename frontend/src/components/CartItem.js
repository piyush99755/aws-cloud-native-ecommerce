import React, { memo } from "react";

const CartItem = memo(({ item, addToCart, decrementFromCart, removeFromCart }) => (
  <div className="flex flex-col bg-white rounded-lg shadow p-4">
    <img
      src={item.image || "/placeholder.png"}
      alt={item.name}
      className="w-20 h-20 object-cover mb-4 rounded"
    />
    <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
    <p className="text-gray-700 mb-4">${item.price} × {item.quantity}</p>
    <div className="flex items-center justify-between mt-auto space-x-2">
      <button onClick={() => decrementFromCart(item.id)} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">-</button>
      <span>{item.quantity}</span>
      <button onClick={() => addToCart(item)} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">+</button>
      <button onClick={() => removeFromCart(item.id)} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition">Remove</button>
    </div>
  </div>
));

export default CartItem;
