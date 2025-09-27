import React from "react";

function LandingPage({ onSignIn, onGuestMode }) {
  // Google login handler
  const handleGoogleSignIn = () => {
    const cognitoDomain =
      "https://us-east-1zylluw6ax.auth.us-east-1.amazoncognito.com";
    const clientId = "1hbjetddcmf4hp5cmpl5tae8l9";
    const redirectUri = "https://app.piyushkumartadvi.link";
    const scope = "openid email profile";

    window.location.href = `${cognitoDomain}/login?client_id=${clientId}&response_type=code&scope=${encodeURIComponent(
      scope
    )}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&identity_provider=Google`;
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
          onClick={onSignIn}
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
