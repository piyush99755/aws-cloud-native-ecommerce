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
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let data = [];
        if (auth.isAuthenticated && auth.user?.access_token) {
          data = await getProducts(auth.user.access_token);
        } else if (guestMode) {
          data = await getProducts();
        }
        const productArray = Array.isArray(data) ? data : [];
        setProducts(productArray);
        setFilteredProducts(productArray);
      } catch (err) {
        console.error(err);
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [auth.isAuthenticated, auth.user?.access_token, guestMode]);

  // Filter products by search term
  useEffect(() => {
    let filtered = [...products];
    if (searchTerm) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    if (sortOption === "price-asc") filtered.sort((a, b) => a.price - b.price);
    if (sortOption === "price-desc") filtered.sort((a, b) => b.price - a.price);
    if (sortOption === "name-asc") filtered.sort((a, b) => a.name.localeCompare(b.name));
    if (sortOption === "name-desc") filtered.sort((a, b) => b.name.localeCompare(a.name));

    setFilteredProducts(filtered);
  }, [searchTerm, sortOption, products]);

  if (!auth.isAuthenticated && !guestMode) {
    return <p className="text-center mt-10 text-lg">Please sign in to view products.</p>;
  }

  if (loading)
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => <SkeletonProduct key={i} />)}
      </div>
    );

  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!products.length) return <p className="text-center mt-10 text-lg">No products found.</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">Products</h2>

      {/* Search + Sort */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border rounded w-full sm:w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="px-4 py-2 border rounded w-full sm:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Sort By</option>
          <option value="price-asc">Price: Low → High</option>
          <option value="price-desc">Price: High → Low</option>
          <option value="name-asc">Name: A → Z</option>
          <option value="name-desc">Name: Z → A</option>
        </select>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => {
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
