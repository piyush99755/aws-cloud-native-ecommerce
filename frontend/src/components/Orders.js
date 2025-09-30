import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "react-oidc-context";

const API_URL = "https://api.piyushkumartadvi.link";

function Orders() {
  const auth = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState({ visible: false, message: "", onConfirm: null });

  const fetchOrders = useCallback(async () => {
    if (!auth.user?.access_token) return;
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/orders`, {
        headers: { Authorization: `Bearer ${auth.user.access_token}`, "Cache-Control": "no-cache" },
      });
      if (!res.ok) throw new Error("Failed to fetch orders");
      setOrders(await res.json());
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Error fetching orders");
    } finally {
      setLoading(false);
    }
  }, [auth.user?.access_token]);

  useEffect(() => { if (auth.isAuthenticated) fetchOrders(); }, [auth.isAuthenticated, fetchOrders]);

  const handleDelete = (orderId) => {
    setModal({
      visible: true,
      message: "Are you sure you want to delete this order?",
      onConfirm: async () => {
        try {
          const res = await fetch(`${API_URL}/api/orders/${orderId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${auth.user?.access_token}` },
          });
          if (!res.ok) throw new Error("Failed to delete order");
          await fetchOrders();
          setModal({ visible: true, message: "Order deleted successfully", onConfirm: null });
        } catch (err) {
          console.error(err);
          setModal({ visible: true, message: "Failed to delete order", onConfirm: null });
        }
      },
    });
  };

  const SkeletonOrder = () => (
    <motion.div className="bg-white shadow p-4 rounded-lg animate-pulse h-40 mb-4" />
  );

  if (loading)
    return <div className="px-4 py-8 max-w-4xl mx-auto">{[...Array(3)].map((_, i) => <SkeletonOrder key={i} />)}</div>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!orders.length) return <p className="text-center mt-10">No orders yet.</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <AnimatePresence>
        {orders.map((order) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            layout
            className="bg-white shadow p-4 rounded-lg"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-lg">Order #{order.id}</h3>
              <button
                onClick={() => handleDelete(order.id)}
                className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition focus:outline-none focus:ring-2 focus:ring-red-500"
                aria-label={`Delete order ${order.id}`}
              >
                Delete
              </button>
            </div>
            <p>Total: ${order.total}</p>
            <div className="mt-2 border-t pt-2 space-y-2">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-1">
                  <div className="flex items-center space-x-2">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    )}
                    <span>{item.name}</span>
                  </div>
                  <span>{item.quantity} × ${item.price}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Modal */}
      {modal.visible && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            className="bg-white rounded-lg shadow-lg p-6 w-96 text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <p className="mb-4">{modal.message}</p>
            <div className="flex justify-center gap-4">
              {modal.onConfirm ? (
                <>
                  <button
                    onClick={async () => { if (modal.onConfirm) await modal.onConfirm(); setModal({ visible: false, message: "", onConfirm: null }); }}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setModal({ visible: false, message: "", onConfirm: null })}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition focus:outline-none focus:ring-2 focus:ring-gray-400"
                  >
                    No
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setModal({ visible: false, message: "", onConfirm: null })}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                  OK
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default Orders;
