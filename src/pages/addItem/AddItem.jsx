/**
 * @file AddItemPage.jsx
 * @description Admin interface for adding new menu items to the backend.
 * Supports image upload with preview, form validation, rating, popularity metrics,
 * and integration with REST API endpoint `/api/menu`.
 *
 * @version 1.0.0
 * @since 2025-10-14
 * @author
 * Muzamil Ahmad
 */

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Upload, Star, Heart, DollarSign } from "lucide-react";

/**
 * AddItemPage Component
 *
 * @component
 * @description
 * Provides a form for admins to create new menu items including image upload,
 * product details, category selection, and rating.
 * Submits data to backend using FormData for handling both text and file uploads.
 */
export default function AddItemPage() {
  // Component state for form data
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    rating: 0,
    popularity: 0,
  });

  // Image upload state
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // API loading state
  const [loading, setLoading] = useState(false);

  /**
   * Handles image file selection and generates a preview.
   * @param {object} event - Input file change event.
   */
  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  /**
   * Updates the selected star rating for the product.
   * @param {number} rating - Star rating value between 1 and 5.
   */
  const handleRatingClick = (rating) => {
    setFormData((prev) => ({ ...prev, rating }));
  };

  /**
   * Handles form submission.
   * Validates required fields and sends multipart/form-data to the backend API.
   *
   * @async
   * @function handleSubmit
   * @param {object} e - Form submission event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation for required fields
    if (!formData.name || !formData.category || !formData.price) {
      alert("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      const data = new FormData();

      // Append all form fields including rating and popularity
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });

      // Append image if available
      if (selectedImage) data.append("image", selectedImage);

      // API call to backend
      const response = await fetch("https://1e20a7ed-cc85-497b-b510-b41debc2f036-00-1p28dt788ywz9.pike.replit.dev/api/menu", {
        method: "POST",
        body: data,
      });

      const result = await response.json();

      // Success response handling
      if (response.ok && result.success) {
        alert("Item added successfully");
        setFormData({
          name: "",
          description: "",
          category: "",
          price: "",
          rating: 0,
          popularity: 0,
        });
        setSelectedImage(null);
        setImagePreview(null);
      } else {
        alert("Failed: " + (result.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // UI: Form layout with Tailwind styling and Framer Motion animation
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-900 via-orange-900 to-red-900 p-6 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl bg-gray-800/90 backdrop-blur-sm border border-gray-700 rounded-xl p-8 shadow-lg"
      >
        <h1 className="text-2xl font-bold text-amber-400 text-center mb-8">
          Add New Menu Item
        </h1>

        {/* Main form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div className="flex flex-col items-center">
            <div
              className="w-full max-w-sm h-32 border-2 border-dashed border-amber-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-amber-500 transition-colors bg-gray-700/50"
              onClick={() => document.getElementById("image-upload")?.click()}
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <>
                  <Upload className="w-8 h-8 text-amber-500 mb-2" />
                  <span className="text-amber-400 text-sm">
                    Click to upload product image
                  </span>
                </>
              )}
            </div>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* Product Name */}
          <div>
            <label className="block text-amber-400 text-sm font-medium mb-2">
              Product Name
            </label>
            <input
              type="text"
              placeholder="Enter product name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-amber-400 text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              placeholder="Enter product description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition min-h-[100px] resize-none"
            ></textarea>
          </div>

          {/* Category and Price Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-amber-400 text-sm font-medium mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, category: e.target.value }))
                }
                className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                required
              >
                <option value="">Select Category</option>
                <option value="Pizza">Pizza</option>
                <option value="Burger">Burger</option>
                <option value="Drinks">Drinks</option>
                <option value="Dessert">Dessert</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-amber-400 text-sm font-medium mb-2">
                Price
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-400">
                  <DollarSign className="w-4 h-4 inline" />
                </span>
                <input
                  type="number"
                  placeholder="Enter price"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, price: e.target.value }))
                  }
                  className="w-full pl-8 p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                  required
                />
              </div>
            </div>
          </div>

          {/* Rating and Popularity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-amber-400 text-sm font-medium mb-2">
                Rating
              </label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-6 h-6 cursor-pointer transition-colors ${
                      star <= formData.rating
                        ? "text-amber-400 fill-amber-400"
                        : "text-gray-500 hover:text-amber-300"
                    }`}
                    onClick={() => handleRatingClick(star)}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-amber-400 text-sm font-medium mb-2">
                Popularity
              </label>
              <div className="flex items-center space-x-2">
                <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                <input
                  type="number"
                  placeholder="0"
                  value={formData.popularity}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      popularity: parseInt(e.target.value) || 0,
                    }))
                  }
                  className="w-20 p-2 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <motion.div whileHover={{ scale: 1.05 }} className="mt-4">
            <button
              type="submit"
              disabled={loading}
              className={`w-full ${
                loading
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-orange-600 hover:bg-orange-700"
              } text-white font-semibold py-3 rounded-lg transition-colors`}
            >
              {loading ? "Adding..." : "Add to Menu"}
            </button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
}
