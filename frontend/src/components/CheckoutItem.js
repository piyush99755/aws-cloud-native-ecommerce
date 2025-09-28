import React from "react";

function CheckoutItem({ item }) {
  return (
    <div className="flex items-center bg-white shadow rounded-lg p-4">
      <img
        src={item.image || "/placeholder.png"}
        alt={item.name}
        className="w-20 h-20 object-cover rounded mr-4"
      />
      <div className="flex flex-col flex-1">
        <p className="font-semibold">{item.name}</p>
        <p>${item.price} × {item.quantity}</p>
      </div>
    </div>
  );
}

export default React.memo(CheckoutItem);
