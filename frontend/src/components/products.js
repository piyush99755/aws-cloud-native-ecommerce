import React, { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { getProducts } from "../api/productService";
import { useCart } from "./CartContext";

function Products({ guestMode }) {
  const auth = useAuth();
  const { cart, addToCart, decrementFromCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let data = [];
        if (auth.isAuthenticated && auth.user?.access_token) {
          data = await getProducts(auth.user.access_token);
        } else if (guestMode) {
          data = await getProducts(); // guest fetch
        }

        setProducts(data || []);
      } catch (err) {
        console.error(err);
        if (err.response?.status === 403) {
          setError("Access denied. Please sign in to view products.");
        } else {
          setError("Failed to load products.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [auth.isAuthenticated, auth.user?.access_token, guestMode]);

  if (!auth.isAuthenticated && !guestMode)
    return <p className="text-center mt-10 text-lg">Please sign in to view products.</p>;
  if (loading) return <p className="text-center mt-10 text-lg">Loading Products...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!products.length) return <p className="text-center mt-10 text-lg">No products found.</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => {
          const cartItem = cart.find((item) => item.id === product.id);

          return (
            <div
              key={product.id}
              className="bg-white shadow-md rounded-lg p-4 flex flex-col hover:shadow-xl transition"
            >
              {/* Product Image */}
              <img
                src={product.image || "/placeholder.png"}
                alt={product.name}
                className="h-40 w-full object-contain mb-4"
              />

              {/* Product Info */}
              <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
              <p className="text-gray-700 mb-4">${product.price}</p>

              {/* Cart Controls */}
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
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Products;
