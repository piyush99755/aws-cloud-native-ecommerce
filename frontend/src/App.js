import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
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

function App() {
  const auth = useAuth();
  const navigate = useNavigate();

  // Persist guestMode across reloads
  const [guestMode, setGuestMode] = useState(() => {
    const saved = localStorage.getItem("guestMode");
    return saved ? JSON.parse(saved) : false;
  });

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
    navigate("/products");
  };

  // Only show loading screen while Auth is initializing
  if (auth.isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-xl font-semibold text-gray-700 animate-pulse">
          Loading...
        </p>
      </div>
    );

  if (auth.error) return <div>Error: {auth.error.message}</div>;

  const isUser = auth.isAuthenticated || guestMode;

  return (
    <Elements stripe={stripePromise}>
      <CartProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar
            isAuthenticated={isUser}
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
                  isUser ? (
                    <Products guestMode={guestMode} />
                  ) : (
                    <LandingPage
                      onSignIn={handleSignIn}
                      onGuestMode={handleGuestMode}
                    />
                  )
                }
              />

              {/* Main app routes */}
              <Route path="/products" element={<Products guestMode={guestMode} />} />
              <Route path="/cart" element={<Cart guestMode={guestMode} auth={auth} />} />
              <Route path="/checkout" element={<Checkout guestMode={guestMode} auth={auth} />} />

              <Route
                path="/orders"
                element={
                  auth.isAuthenticated ? (
                    <Orders />
                  ) : (
                    <p className="text-center mt-10 text-lg text-gray-700">
                      Please log in to view your past orders.
                    </p>
                  )
                }
              />

              {/* Catch-all: redirect to Products if logged in or guestMode */}
              <Route
                path="*"
                element={isUser ? (
                  <Products guestMode={guestMode} />
                ) : (
                  <LandingPage
                    onSignIn={handleSignIn}
                    onGuestMode={handleGuestMode}
                  />
                )}
              />
            </Routes>
          </main>
        </div>
      </CartProvider>
    </Elements>
  );
}

export default App;
