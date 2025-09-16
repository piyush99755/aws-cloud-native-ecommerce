import React, { useEffect, useState } from 'react';
import { useAuth } from 'react-oidc-context';
import { getProducts } from '../api/productService';
import { useCart } from '../components/CartContext';


function Products() {
    const auth = useAuth(); 
    const { addToCart } = useCart();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

   

   useEffect(() => {
  if (auth.isAuthenticated && auth.user?.access_token) {
    getProducts(auth.user.access_token)
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch products from backend:", err);
        setError("Failed to load products.");
        setLoading(false);
      });
  }
}, [auth.isAuthenticated, auth.user?.access_token]);



        

    if (!auth.isAuthenticated) {
        return <p className="text-center mt-10 text-lg">Please sign in to view products.</p>;
    }

    if (loading) return <p className="text-center mt-10 text-lg">Loading Products...</p>;
    if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

   return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <div key={product.id} className="bg-white shadow-md rounded-lg p-4 flex flex-col">
            <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
            <p className="text-gray-700 mb-4">${product.price}</p>
            <button
              className="mt-auto bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
              onClick={() => addToCart(product)}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;
