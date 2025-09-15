import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Products from './components/products';
import Cart from './components/Cart';
import Orders from './components/Orders';
import Checkout from './components/Checkout';
import './App.css';
import { useAuth } from 'react-oidc-context';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import './styles/components.css';


// Initialize Stripe
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

console.log("Stripe Key in App.js:", process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
console.log("Stripe Promise:", stripePromise);

function App() {
  const auth = useAuth();

  const signOutRedirect = () => {
    const clientId = "1hbjetddcmf4hp5cmpl5tae8l9";
    const logoutUri = "https://app.piyushkumartadvi.link"; 
    const cognitoDomain = "https://us-east-1zylluw6ax.auth.us-east-1.amazoncognito.com";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.error) {
    return <div>Error: {auth.error.message}</div>;
  }

  return (
    <Router>
      <Elements stripe={stripePromise}>
        <div>
          <h2>Cloud E-Commerce App</h2>
          {auth.isAuthenticated && auth.user ? (
            <>
              <pre>Access Token: {auth.user.access_token}</pre>
              <button onClick={() => auth.removeUser()}>Clear Sessions</button>
              <button onClick={signOutRedirect}>Sign out</button>
            </>
          ) : (
            <>
              <h3>Welcome, {auth.user?.profile?.email || "Guest"}</h3>
              <button onClick={() => auth.signinRedirect()}>Sign in</button>
            </>
          )}

          <nav>
            <Link to="/products">Products</Link> |{" "}
            <Link to="/cart">Cart</Link> |{" "}
            <Link to="/checkout">Checkout</Link> |{" "}
            <Link to="/orders">Orders</Link>
          </nav>

          <Routes>
            {/* Public routes */}
            <Route path="/products" element={<Products />} />
            <Route path="/cart" element={<Cart />} />

            {/* Protected routes */}
            <Route
              path="/checkout"
              element={
                auth.isAuthenticated ? (
                  <Checkout />
                ) : (
                  <p>Please log in to access Checkout</p>
                )
              }
            />
            <Route
              path="/orders"
              element={
                auth.isAuthenticated ? (
                  <Orders />
                ) : (
                  <p>Please log in to view your orders</p>
                )
              }
            />

            {/* Default route */}
            <Route path="*" element={<Products />} />
          </Routes>
        </div>
      </Elements>
    </Router>
  );
}

export default App;
