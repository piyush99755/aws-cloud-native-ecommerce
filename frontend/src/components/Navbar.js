import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

function Navbar({ isAuthenticated, user, onSignIn, onSignOut }) {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

        {/* Desktop Navigation */}
        <nav className="hidden sm:flex space-x-6">
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

        {/* Auth Controls (desktop) */}
        <div className="hidden sm:flex items-center space-x-4">
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
            <button
              onClick={onSignIn}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Sign In
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="sm:hidden focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <XMarkIcon className="w-6 h-6" />
          ) : (
            <Bars3Icon className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav className="sm:hidden bg-white border-t border-gray-200">
          <div className="px-6 py-4 flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`${
                  location.pathname === link.path
                    ? "text-blue-600 font-semibold"
                    : "text-gray-700 hover:text-blue-500"
                } transition`}
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-4 border-t border-gray-200 flex flex-col space-y-2">
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
                <button
                  onClick={onSignIn}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}

export default Navbar;
