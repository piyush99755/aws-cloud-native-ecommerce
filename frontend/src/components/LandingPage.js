import React from "react";
import { useAuth } from "react-oidc-context";

function LandingPage({ onGuestMode }) {
  const auth = useAuth();

  // Cognito / Google login using react-oidc-context
  const handleCognitoSignIn = () => {
    auth.signinRedirect();
  };

  const handleGoogleSignIn = () => {
    auth.signinRedirect({
      data: { identity_provider: "Google" }, // tells Cognito to use Google
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
      <h1 className="text-5xl font-bold mb-6 text-blue-600">
        Welcome to <span className="text-gray-800">Cloud E-Commerce</span>
      </h1>
      <p className="text-lg text-gray-700 mb-8 max-w-2xl">
        Explore our E-commerce platform. Browse products, add to cart, and experience
        checkout—all without creating an account!
      </p>
      <div className="space-x-4 flex flex-col sm:flex-row gap-4">
        {/* Cognito Sign In */}
        <button
          onClick={handleCognitoSignIn}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Sign In
        </button>

        {/* Google Sign In */}
        <button
          onClick={handleGoogleSignIn}
          className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          Sign In with Google
        </button>

        {/* Guest Mode */}
        <button
          onClick={onGuestMode}
          className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
        >
          Start Shopping (Guest)
        </button>
      </div>
    </div>
  );
}

export default LandingPage;
