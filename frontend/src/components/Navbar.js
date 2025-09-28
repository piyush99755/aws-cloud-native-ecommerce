import React from "react";
import { Link } from "react-router-dom";

function Navbar({ isAuthenticated, user, onSignIn, onSignOut }) {
  return (
    <nav className="bg-white shadow px-6 py-4 flex items-center justify-between">
      <Link to="/" className="text-2xl font-bold text-blue-600">
        Cloud E-Commerce
      </Link>

      <div className="space-x-4">
        {isAuthenticated && (
          <>
            <Link to="/products" className="hover:underline">
              Products
            </Link>
            <Link to="/cart" className="hover:underline">
              Cart
            </Link>
            <Link to="/checkout" className="hover:underline">
              Checkout
            </Link>
            <Link to="/orders" className="hover:underline">
              Orders
            </Link>
          </>
        )}
      </div>

      <div className="flex items-center space-x-4">
        {isAuthenticated ? (
          <>
            <span className="text-gray-700">
              {user?.profile?.email || "User"}
            </span>
            <button
              onClick={onSignOut}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Sign Out
            </button>
          </>
        ) : (
          <button
            onClick={onSignIn}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Sign In
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
