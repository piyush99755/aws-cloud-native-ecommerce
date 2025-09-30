import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../images/logo.png"; 

function Navbar({ isAuthenticated, user, onSignIn, onSignOut }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { path: "/products", label: "Products" },
    { path: "/cart", label: "Cart" },
    { path: "/checkout", label: "Checkout" },
    { path: "/orders", label: "Orders" },
  ];

  const username = user?.profile?.email ? user.profile.email.split("@")[0] : "User";

  return (
    <header className="bg-white shadow-md mb-6 relative">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center relative z-10">
        
        {/* --- Brand Logo + App Name --- */}
        <div
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img src={logo} alt="Brand Logo" className="h-8 w-8 object-contain" />
          <h1 className="text-2xl font-bold text-blue-600 tracking-wide">
            Cloud <span className="text-gray-800">E-Commerce</span>
          </h1>
        </div>

        {/* --- Desktop Nav Links --- */}
        <nav className="hidden sm:flex space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`${
                location.pathname === link.path
                  ? "text-blue-600 font-semibold"
                  : "text-gray-700 hover:text-blue-500"
              } transition focus:outline-none focus:ring-2 focus:ring-blue-600 rounded`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* --- Auth Buttons --- */}
        <div className="hidden sm:flex items-center space-x-4">
          {isAuthenticated && user ? (
            <>
              <span className="text-blue-600 font-semibold text-lg truncate max-w-xs">
                {username}
              </span>
              <button
                onClick={onSignOut}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition focus:outline-none focus:ring-2 focus:ring-red-600"
              >
                Sign Out
              </button>
            </>
          ) : (
            <button
              onClick={onSignIn}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              Sign In
            </button>
          )}
        </div>

        {/* --- Mobile Menu Toggle --- */}
        <button
          className="sm:hidden focus:outline-none"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
        </button>
      </div>

      {/* --- Mobile Menu --- */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3 }}
            className="sm:hidden fixed top-0 right-0 h-full w-1/2 bg-white shadow-lg z-50 p-6 flex flex-col justify-start"
          >
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
                  } transition focus:outline-none focus:ring-2 focus:ring-blue-600 rounded`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="mt-6 border-t border-gray-200 pt-4 flex flex-col space-y-2">
              {isAuthenticated && user ? (
                <>
                  <span className="text-blue-600 font-semibold text-lg truncate max-w-full">
                    {username}
                  </span>
                  <button
                    onClick={onSignOut}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition focus:outline-none focus:ring-2 focus:ring-red-600"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <button
                  onClick={onSignIn}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  Sign In
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Navbar;
