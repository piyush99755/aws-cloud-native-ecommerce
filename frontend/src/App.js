import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import Products from "./components/Products";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import Orders from "./components/Orders";
import LandingPage from "./components/LandingPage";
import Navbar from "./components/Navbar";
import { useAuth } from "react-oidc-context";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { CartProvider } from "./components/CartContext";
import "./App.css";
import "./styles/components.css";

// Stripe
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

// PrivateRoute wrapper for protected pages
function PrivateRoute({ children, auth }) {
  if (!auth.isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function App() {
  const auth = useAuth();
  const navigate = useNavigate();

  // Persist guestMode across reloads
  const [guestMode, setGuestMode] = useState(() => {
    const saved = localStorage.getItem("guestMode");
    return saved ? JSON.parse(saved) : false;
  });

  // Redirect logged-in users to /products automatically
  useEffect(() => {
    if (!auth.isLoading && auth.isAuthenticated && auth.user) {
      setGuestMode(false);
      localStorage.setItem("guestMode", false);
      navigate("/products", { replace: true });
    }
  }, [auth.isLoading, auth.isAuthenticated, auth.user, navigate]);

  // Sign in / out handlers
  const handleSignOut = () => {
    auth.removeUser();
    setGuestMode(false);
    localStorage.setItem("guestMode", false);

    const clientId = "1hbjetddcmf4hp5cmpl5tae8l9";
    const logoutUri = "https://app.piyushkumartadvi.link";
    const cognitoDomain =
      "https://us-east-1zylluw6ax.auth.us-east-1.amazoncognito.com";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(
      logoutUri
    )}`;
  };

  const handleSignIn = () => {
    setGuestMode(false);
    localStorage.setItem("guestMode", false);
    auth.signinRedirect();
  };

  const handleGuestMode = () => {
    setGuestMode(true);
    localStorage.setItem("guestMode", true);
    navigate("/products", { replace: true });
  };

  // Loading / error states
  if (auth.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-xl font-semibold text-gray-700 animate-pulse">
          Loading authentication...
        </p>
      </div>
    );
  }

  if (auth.error) return <div>Error: {auth.error.message}</div>;

  return (
    <Elements stripe={stripePromise}>
      <CartProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar
            isAuthenticated={auth.isAuthenticated || guestMode}
            user={auth.user}
            onSignIn={handleSignIn}
            onSignOut={handleSignOut}
          />

          <main className="max-w-6xl mx-auto px-4">
            <Routes>
              {/* Landing page */}
              <Route
                path="/"
                element={
                  auth.isAuthenticated ? (
                    <Navigate to="/products" replace />
                  ) : (
                    <LandingPage
                      onSignIn={handleSignIn}
                      onGuestMode={handleGuestMode}
                    />
                  )
                }
              />

              {/* Public pages */}
              <Route
                path="/products"
                element={<Products guestMode={guestMode} />}
              />
              <Route
                path="/cart"
                element={<Cart guestMode={guestMode} auth={auth} />}
              />

              {/* Protected pages */}
              <Route
                path="/checkout"
                element={
                  <PrivateRoute auth={auth}>
                    <Checkout guestMode={guestMode} auth={auth} />
                  </PrivateRoute>
                }
              />
              <Route
                path="/orders"
                element={
                  <PrivateRoute auth={auth}>
                    <Orders />
                  </PrivateRoute>
                }
              />

              {/* Catch-all */}
              <Route
                path="*"
                element={
                  auth.isAuthenticated || guestMode ? (
                    <Navigate to="/products" replace />
                  ) : (
                    <LandingPage
                      onSignIn={handleSignIn}
                      onGuestMode={handleGuestMode}
                    />
                  )
                }
              />
            </Routes>
          </main>
        </div>
      </CartProvider>
    </Elements>
  );
}

export default App;
