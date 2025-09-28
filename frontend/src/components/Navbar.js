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

  const username = user?.profile?.email
    ? user.profile.email.split("@")[0]
    : "User";

  return (
    <header className="bg-white shadow-md mb-6 relative">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center relative z-10">
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
              <span className="text-gray-700 text-sm">{username}</span>
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

      {/* Mobile Navigation (slide-in, half screen) */}
      {isMenuOpen && (
        <div className="sm:hidden fixed top-0 right-0 h-full w-1/2 bg-white shadow-lg z-50 p-6 flex flex-col justify-start">
          <nav className="flex flex-col space-y-4">
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
          </nav>

          <div className="mt-6 border-t border-gray-200 pt-4 flex flex-col space-y-2">
            {isAuthenticated && user ? (
              <>
                <span className="text-gray-700 text-sm">{username}</span>
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
      )}
    </header>
  );
}

export default Navbar;
