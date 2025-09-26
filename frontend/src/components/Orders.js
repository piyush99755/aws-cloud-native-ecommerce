import React, { useState, useEffect } from "react";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // For custom modal
  const [modal, setModal] = useState({ visible: false, message: "", onConfirm: null });

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/orders");
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error(err);
      setError("Error fetching orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Show confirmation modal
  const showConfirm = (message, onConfirm) => {
    setModal({ visible: true, message, onConfirm });
  };

  const handleDelete = async (orderId) => {
  showConfirm("Are you sure you want to delete this order?", async () => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete order");

      // Refetch orders after deletion to ensure frontend is synced
      await fetchOrders();

      showAlert("Order deleted successfully");
    } catch (err) {
      console.error(err);
      showAlert("Failed to delete order");
    }
  });
};


  // Show alert modal
  const showAlert = (message) => {
    setModal({ visible: true, message, onConfirm: () => setModal({ visible: false }) });
  };

  if (loading)
    return <p className="text-center mt-10 text-gray-700">Loading orders...</p>;

  if (error)
    return <p className="text-center mt-10 text-red-500">{error}</p>;

  if (!orders.length)
    return <p className="text-center mt-10 text-gray-700">No orders yet.</p>;

  return (
    <>
      {/* Orders List */}
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-white shadow p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-lg">Order #{order.id}</h3>
              <button
                onClick={() => handleDelete(order.id)}
                className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
            <p className="text-gray-600">Total: ${order.total}</p>
            <div className="mt-2 border-t pt-2">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center py-1"
                >
                  <div className="flex items-center space-x-2">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <span>{item.name}</span>
                  </div>
                  <span>
                    {item.quantity} x ${item.price}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modal.visible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96 text-center">
            <p className="mb-4">{modal.message}</p>
            <div className="flex justify-center gap-4">
              {modal.onConfirm && (
                <button
                  onClick={() => {
                    modal.onConfirm();
                    setModal({ visible: false });
                  }}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Yes
                </button>
              )}
              <button
                onClick={() => setModal({ visible: false })}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                {modal.onConfirm ? "No" : "OK"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Orders;
