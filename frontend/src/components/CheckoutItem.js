import React from "react";
import { motion } from "framer-motion";

function CheckoutItem({ item }) {
  return (
    <motion.div
      className="flex items-center bg-white shadow rounded-lg p-4"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      layout
    >
      <img
        src={item.image || "/placeholder.png"}
        alt={item.name}
        className="w-20 h-20 object-cover rounded mr-4"
      />
      <div className="flex flex-col flex-1">
        <p className="font-semibold">{item.name}</p>
        <p>${item.price} × {item.quantity}</p>
      </div>
    </motion.div>
  );
}

export default React.memo(CheckoutItem);
