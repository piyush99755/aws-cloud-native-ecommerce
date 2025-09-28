import React, { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { getProducts } from "../api/productService";
import { useCart } from "./CartContext";
import ProductCard from "./ProductCard";
import SkeletonProduct from "./SkeletonProduct";

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
          data = await getProducts();
        }
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [auth.isAuthenticated, auth.user?.access_token, guestMode]);

  if (!auth.isAuthenticated && !guestMode) {
    return <p className="text-center mt-10 text-lg">Please sign in to view products.</p>;
  }

  if (loading)
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <SkeletonProduct key={i} />
        ))}
      </div>
    );

  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!products.length) return <p className="text-center mt-10 text-lg">No products found.</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => {
          const cartItem = cart.find((item) => item.id === product.id);
          return (
            <ProductCard
              key={product.id}
              product={product}
              cartItem={cartItem}
              addToCart={addToCart}
              decrementFromCart={decrementFromCart}
            />
          );
        })}
      </div>
    </div>
  );
}

export default Products;
