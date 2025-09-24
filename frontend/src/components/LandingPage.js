import React from "react";

function LandingPage({ onSignIn, onGuestMode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
      <h1 className="text-5xl font-bold mb-6 text-blue-600">
        Welcome to <span className="text-gray-800">Cloud E-Commerce</span>
      </h1>
      <p className="text-lg text-gray-700 mb-8 max-w-2xl">
        Explore our demo e-commerce platform. Browse products, add to cart, and experience
        checkout—all without creating an account!
      </p>
      <div className="space-x-4">
        <button
          onClick={onSignIn}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Sign In
        </button>
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
