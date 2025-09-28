import React from "react";
import { Link, useLocation } from "react-router-dom";

function Navbar({ isAuthenticated, user, onSignIn, onSignOut }) {
  const location = useLocation();

  const navLinks = [
    { path: "/products", label: "Products" },
    { path: "/cart", label: "Cart" },
    { path: "/checkout", label: "Checkout" },
    { path: "/orders", label: "Orders" },
  ];

  return (
    <header className="bg-white shadow-md mb-6">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-2xl font-bold text-blue-600 tracking-wide">
          Cloud <span className="text-gray-800">E-Commerce</span>
        </h1>

        {/* Navigation */}
        <nav className="space-x-6 hidden sm:flex">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`${
                location.pathname === link.path
                  ? "text-blue-600 font-semibold"
                  : "text-gray-700 hover:text-blue-500"
              } transition`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Auth Controls */}
        <div className="flex items-center space-x-4">
          {isAuthenticated && user ? (
            <>
              <span className="text-gray-700 text-sm">
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
            <>
              <button
                onClick={onSignIn}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                Sign In
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
