/**
 * @file AdminLoginModal.jsx
 * @description Admin Login Modal component responsible for authenticating
 * admin users via backend API and restricting access to authorized roles only.
 * Includes form validation, smooth animations, and secure token persistence.
 *
 * @version 1.0.0
 * @since 2025-10-14
 * @author
 * Muzamil Ahmad
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GiChefToque } from "react-icons/gi";
import { FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

/**
 * AdminLoginModal Component
 *
 * @component
 * @param {boolean} isOpen - Determines if the modal is currently visible.
 * @param {Function} onClose - Function to close the modal.
 *
 * @description
 * - Provides a secure login interface for administrators.
 * - Integrates with backend authentication API.
 * - Validates input, handles errors, and ensures role-based access.
 * - Implements keyboard accessibility (Escape key support).
 */
export default function AdminLoginModal({ isOpen, onClose }) {
  // Local component state
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  /**
   * Updates the form input values in state dynamically.
   * @param {object} e - Input change event.
   */
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  /**
   * Handles login submission, validation, and navigation.
   * - Performs basic field validation.
   * - Sends credentials to backend API for authentication.
   * - Checks for admin role before granting access.
   * - Persists the token securely in localStorage.
   *
   * @param {object} e - Form submission event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Basic client-side validation
    if (!formData.email || !formData.password) {
      setError("All fields are required.");
      return;
    }

    try {
      setLoading(true);

      // Backend API request
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      // Ensure the user has admin privileges
      if (data.data.role !== "admin") {
        setError("Access denied. Admin only.");
        return;
      }

      // Save admin session securely
      localStorage.setItem("adminToken", data.data.token);
      localStorage.setItem("adminUser", JSON.stringify(data.data));

      // Redirect to admin dashboard
      onClose();
      navigate("/orders", {
        state: { message: "Admin login successful" },
      });
    } catch (err) {
      setError(err.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Enables closing the modal using the Escape key.
   */
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // Modal UI
  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#2D1B0E] p-6 rounded-2xl w-80 sm:w-96 shadow-2xl relative border-2 border-amber-900/50"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-amber-400 hover:text-amber-200 transition text-lg"
              aria-label="Close Modal"
            >
              <FaTimes />
            </button>

            {/* Logo and title */}
            <div className="flex items-center space-x-2 justify-center mb-6">
              <GiChefToque className="text-3xl text-amber-500" />
              <h2 className="text-2xl font-bold text-amber-400">
                Admin Panel
              </h2>
            </div>

            {/* Error message */}
            {error && (
              <p className="text-red-400 text-center mb-3 text-sm" role="alert">
                {error}
              </p>
            )}

            {/* Login form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Admin Email"
                autoComplete="email"
                className="px-4 py-2 rounded-xl border border-amber-700 bg-[#3A2413] text-amber-100 placeholder-amber-400 focus:ring-2 focus:ring-amber-500 outline-none transition"
              />

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                autoComplete="current-password"
                className="px-4 py-2 rounded-xl border border-amber-700 bg-[#3A2413] text-amber-100 placeholder-amber-400 focus:ring-2 focus:ring-amber-500 outline-none transition"
              />

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`bg-gradient-to-r from-orange-500 to-orange-700 text-white py-2 rounded-xl font-semibold shadow-lg transition-transform ${
                  loading ? "opacity-60 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Logging In..." : "Login as Admin"}
              </motion.button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
