/**
 * AdminNavbar.jsx
 * 
 * Responsive admin navigation bar component.
 * Handles navigation between admin routes, login/logout actions,
 * and responsive behavior for mobile and desktop views.
 * 
 * Key Features:
 * - Responsive design (hamburger toggle for mobile)
 * - Auth-based button switching (Login/Logout)
 * - Smooth hover animations with Tailwind gradients
 * - Maintains active link highlighting
 * 
 * Author: Muzamil Ahmad
 * Environment: React + Tailwind CSS
 * Last Updated: October 2025
 */

import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { FiMenu, FiX, FiClipboard } from "react-icons/fi";
import { FaBoxOpen, FaSignOutAlt, FaSignInAlt } from "react-icons/fa";
import { GiChefToque, GiForkKnifeSpoon } from "react-icons/gi";
import { MdListAlt } from "react-icons/md";
import LoginModal from "../../components/adminNav/login/Login.jsx";

// Navigation link configuration
const navLinks = [
  { name: "Add Item", path: "/additem", icon: <FaBoxOpen /> },
  { name: "List Items", path: "/listitem", icon: <FiClipboard /> },
  { name: "Orders", path: "/orders", icon: <MdListAlt /> },
];

const AdminNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false); // Mobile menu toggle
  const [isLoginOpen, setIsLoginOpen] = useState(false); // Login modal visibility
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Auth state

  /**
   * Check user authentication state on mount.
   */
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  /**
   * Handles user logout and redirects to home.
   */
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/");
  };

  /**
   * Common button style for consistency across Login/Logout buttons.
   */
  const buttonClass =
    "px-3 py-1.5 flex items-center gap-2 rounded-2xl text-sm font-semibold " +
    "bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow hover:scale-105 " +
    "transition-all duration-300 justify-center";

  return (
    <>
      {/* Main Navigation */}
      <nav className="bg-[#2D1B0E] border-b-8 border-amber-900/30 shadow-amber-900/30 sticky top-0 z-50 font-sans shadow-[0_25px_50px_-12px]">

        {/* Decorative top gradient line */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-full max-w-7xl px-4">
          <div className="h-[6px] bg-gradient-to-r from-transparent via-amber-600/50 to-transparent shadow-[0_0_20px] shadow-amber-500/30" />
        </div>

        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16 lg:h-18 xl:h-20">

            {/* Left decorative icon */}
            <GiForkKnifeSpoon className="text-amber-500/40 -mt-4 -ml-2 rotate-45" size={32} />

            {/* Logo + Brand Section */}
            <div className="flex items-center space-x-2 group relative">
              <div className="absolute -inset-4 bg-amber-500/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <GiChefToque className="text-2xl lg:text-3xl xl:text-4xl text-amber-500 transition-all group-hover:rotate-12 group-hover:text-amber-400 hover:drop-shadow-[0_0_15px]" />
              <div className="flex flex-col ml-2">
                <NavLink
                  to="/"
                  className="text-2xl lg:text-xl xl:text-3xl bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent tracking-wider drop-shadow-[0_2px_2px] truncate"
                >
                  Admin Panel
                </NavLink>
                <div className="h-[3px] bg-gradient-to-r from-amber-600/30 via-amber-400/50 to-amber-600/30 mt-1 ml-1 shadow-[0_2px_5px] shadow-amber-500/20" />
              </div>
            </div>

            {/* Right decorative icon */}
            <GiForkKnifeSpoon className="text-amber-500/40 -mt-4 -mr-2 rotate-45" size={32} />

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-4 ml-auto">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `px-4 py-2 flex items-center gap-2 rounded-2xl border-2 transition-all duration-300 ${
                      isActive
                        ? "bg-[linear-gradient(to_right,oklab(0.414_0.0779_0),oklab(0.666_0.094_0.152))] text-white shadow-lg scale-105 border-amber-400"
                        : "text-amber-300 border-transparent hover:border-amber-400 hover:bg-[linear-gradient(to_right,oklab(0.414_0.0779_0),oklab(0.666_0.094_0.152))] hover:text-white hover:shadow-lg hover:scale-105"
                    }`
                  }
                >
                  {link.icon} {link.name}
                </NavLink>
              ))}

              {/* Login/Logout button */}
              {isLoggedIn ? (
                <button onClick={handleLogout} className={buttonClass}>
                  <FaSignInAlt /> Logout
                </button>
              ) : (
                <button onClick={() => setIsLoginOpen(true)} className={buttonClass}>
                  <FaSignOutAlt /> Login
                </button>
              )}
            </div>

            {/* Mobile menu toggle */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-amber-400 focus:outline-none"
              >
                {isOpen ? <FiX size={28} /> : <FiMenu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="lg:hidden bg-[#2D1B0E] border-t border-amber-900/50 px-4 py-3 space-y-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-2 flex items-center gap-2 rounded-2xl border-2 transition-all duration-300 ${
                    isActive
                      ? "bg-[linear-gradient(to_right,oklab(0.414_0.0779_0),oklab(0.666_0.094_0.152))] text-white shadow-md scale-105 border-amber-400"
                      : "text-amber-300 border-transparent hover:border-amber-400 hover:bg-[linear-gradient(to_right,oklab(0.414_0.0779_0),oklab(0.666_0.094_0.152))] hover:text-white hover:shadow-md hover:scale-105"
                  }`
                }
              >
                {link.icon} {link.name}
              </NavLink>
            ))}

            {/* Mobile Login/Logout Button */}
            <button
              onClick={isLoggedIn ? handleLogout : () => setIsLoginOpen(true)}
              className={`${buttonClass} w-full mt-2`}
            >
              {isLoggedIn ? <FaSignInAlt /> : <FaSignOutAlt />}{" "}
              {isLoggedIn ? "Logout" : "Login"}
            </button>
          </div>
        )}
      </nav>

      {/* Login Modal */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
};

export default AdminNavbar;
