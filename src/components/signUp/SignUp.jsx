import React, { useState } from "react";
import { GiChefToque } from "react-icons/gi";
import LoginModal from "../login/Login";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa";

export default function SignUp() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.password) {
      return "All fields are required.";
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      return "Invalid email format.";
    }
    if (formData.password.length < 6) {
      return "Password must be at least 6 characters.";
    }
    if (formData.password !== formData.confirmPassword) {
      return "Passwords do not match.";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);

      // 🔹 Call backend API for signup
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Signup failed");
        return;
      }

      // 🔹 Save token and user info to localStorage
      localStorage.setItem("token", data.data.token);
      localStorage.setItem("user", JSON.stringify(data.data));

      // 🔹 Fetch user orders immediately after signup
      const ordersRes = await fetch("http://localhost:5000/api/orders", {
        headers: { Authorization: `Bearer ${data.data.token}` },
      });
      const ordersData = await ordersRes.json();
      if (ordersData.success) {
        localStorage.setItem("orders", JSON.stringify(ordersData.data));
      }

      // 🔹 Redirect to orders page
      navigate("/orders");
    } catch (err) {
      setError(err.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#2D1B0E] px-4">
      <div className="bg-[#2D1B0E] p-6 rounded-2xl w-80 sm:w-96 shadow-2xl relative border-2 border-amber-900/50">
        {/* Logo / Brand */}
        <div className="flex items-center justify-center space-x-2 mb-6">
          <GiChefToque className="text-3xl text-amber-500" />
          <h1 className="text-2xl font-bold text-amber-400">Foodie-Frenzy</h1>
        </div>

        <h2 className="text-xl font-semibold text-center text-amber-300 mb-4">
          Create Account
        </h2>

        {/* Error Message */}
        {error && (
          <p className="text-red-400 text-center mb-3 text-sm">{error}</p>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Full Name"
            className="px-4 py-2 rounded-xl border border-amber-700 bg-[#3A2413] text-amber-100 placeholder-amber-400 focus:ring-2 focus:ring-amber-500 outline-none transition"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email Address"
            className="px-4 py-2 rounded-xl border border-amber-700 bg-[#3A2413] text-amber-100 placeholder-amber-400 focus:ring-2 focus:ring-amber-500 outline-none transition"
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="px-4 py-2 rounded-xl border border-amber-700 bg-[#3A2413] text-amber-100 placeholder-amber-400 focus:ring-2 focus:ring-amber-500 outline-none transition"
          />
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
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
            {loading ? "Signing Up..." : "Sign Up"}
          </motion.button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center space-y-3">
          <p className="text-sm text-amber-300">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => setIsLoginOpen(true)}
              className="text-orange-400 font-semibold hover:underline"
            >
              Login
            </button>
          </p>

          {/* Back to Home */}
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 bg-[#3A2413] text-amber-200 px-5 py-2 rounded-lg font-medium shadow hover:bg-[#4B2F18] transition"
          >
            <FaHome className="text-lg" />
            Back to Home
          </button>
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </div>
  );
}
