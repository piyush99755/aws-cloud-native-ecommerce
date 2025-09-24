import React, { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";

function Orders() {
  const auth = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!auth.isAuthenticated || auth.isLoading) return;

    const fetchOrders = async () => {
      try {
        const token = auth.user?.access_token;
        const res = await fetch("/api/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [auth.isAuthenticated, auth.isLoading, auth.user]);

  if (auth.isLoading || loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-xl text-gray-700 animate-pulse">Loading orders...</p>
      </div>
    );

  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (orders.length === 0)
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6">Your Orders</h2>
        <p className="text-gray-600">No orders found yet.</p>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">Your Orders</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-lg shadow p-4 flex flex-col"
          >
            <h3 className="font-semibold text-lg mb-2">
              Order #{order.id} — ${order.total}
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Placed on {new Date(order.created_at).toLocaleString()}
            </p>

            <div className="space-y-4 flex-1">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center space-x-4 bg-gray-50 p-2 rounded"
                >
                  <img
                    src={item.image || "/placeholder.png"}
                    alt={item.name}
                    className="w-16 h-16 object-contain border rounded"
                  />
                  <div className="flex flex-col">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-gray-600">
                      ${item.price} × {item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Orders;
