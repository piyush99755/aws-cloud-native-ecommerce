import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { MenuIcon, XMarkIcon } from "@heroicons/react/24/outline";

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

        {/* Auth Controls Desktop */}
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
        <div className="sm:hidden flex items-center">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-700 focus:outline-none"
          >
            {isMenuOpen ? (
              <XMarkIcon className="w-6 h-6" />
            ) : (
              <MenuIcon className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="sm:hidden px-6 pb-4 space-y-2 bg-white shadow-md">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsMenuOpen(false)}
              className={`block ${
                location.pathname === link.path
                  ? "text-blue-600 font-semibold"
                  : "text-gray-700 hover:text-blue-500"
              } transition`}
            >
              {link.label}
            </Link>
          ))}

          <div className="mt-4 border-t pt-2 space-y-2">
            {isAuthenticated && user ? (
              <>
                <span className="block text-gray-700">{user?.profile?.email || "User"}</span>
                <button
                  onClick={() => {
                    onSignOut();
                    setIsMenuOpen(false);
                  }}
                  className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  onSignIn();
                  setIsMenuOpen(false);
                }}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
