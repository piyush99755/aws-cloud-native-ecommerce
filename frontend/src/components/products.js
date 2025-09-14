import React, { useEffect, useState } from 'react';
import { useAuth } from 'react-oidc-context';
import { getProducts } from '../api/productService';
import axios from 'axios';

function Products() {
    const auth = useAuth(); 
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
        return <p>Please sign in to view products.</p>;
    }

    if (loading) return <p>Loading Products...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h2>Products</h2>
            <ul>
                {products.map((product) => (
                    <li key={product.id}>
                        <strong>{product.name}</strong> - ${product.price}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Products;
