  /**
 * ListItemsPage Component
 * 
 * Purpose:
 * - Displays all menu items fetched from the backend API.
 * - Provides a management interface for admin users to view, monitor, and delete menu items.
 * - Includes rating, popularity, and image previews for better visual clarity.
 * 
 * Key Features:
 * - Fetch and render menu data dynamically from API.
 * - Handle item deletion with confirmation.
 * - Display user-friendly empty/loading states.
 * - Use responsive design and Tailwind CSS styling.
 * 
 * Author: Muzamil Ahmad
 * Environment: Production Ready
 */

import React, { useState, useEffect } from "react";
import { Star, Heart, Trash2, DollarSign } from "lucide-react";

export default function ListItemsPage() {
  // Application state
  const [items, setItems] = useState([]);      // Stores menu items
  const [loading, setLoading] = useState(false); // Controls loading spinner

  /**
   * Fetch all menu items from backend API.
   * This function runs once on component mount.
   * Uses async/await with proper error handling for production reliability.
   */
  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await fetch("https://1e20a7ed-cc85-497b-b510-b41debc2f036-00-1p28dt788ywz9.pike.replit.dev//api/menu");
      const data = await res.json();

      if (data.success) {
        setItems(data.data);
      } else {
        alert("Failed to fetch items");
      }
    } catch (err) {
      console.error("Error fetching items:", err);
      alert("Error fetching items");
    } finally {
      setLoading(false);
    }
  };

  // Trigger data fetch on mount
  useEffect(() => {
    fetchItems();
  }, []);

  /**
   * Handle deletion of a specific menu item.
   * Includes user confirmation for safety.
   * Updates UI optimistically after successful deletion.
   */
  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this item?");
    if (!confirm) return;

    try {
      const res = await fetch(`https://1e20a7ed-cc85-497b-b510-b41debc2f036-00-1p28dt788ywz9.pike.replit.dev//api/menu/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success) {
        setItems(items.filter((item) => item._id !== id)); // Update UI
      } else {
        alert(data.message || "Failed to delete item");
      }
    } catch (err) {
      console.error("Error deleting item:", err);
      alert("Error deleting item");
    }
  };

  /**
   * Utility: Render visual star rating for each item.
   * Stars are color-filled based on current rating value.
   */
  const renderStars = (rating) => (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            star <= rating ? "text-amber-400 fill-amber-400" : "text-gray-500"
          }`}
        />
      ))}
    </div>
  );

  /**
   * Main component render.
   * Displays a dynamic list or fallback states (loading, empty list).
   */
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-900 via-orange-900 to-red-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gray-800/90 backdrop-blur-sm border border-gray-700 p-8 rounded-xl shadow-lg">
          <h1 className="text-2xl font-bold text-amber-400 text-center mb-8">
            Manage Menu Items
          </h1>

          {/* Loading State */}
          {loading ? (
            <div className="text-center text-white py-12">Loading...</div>
          ) : items.length === 0 ? (
            // Empty State
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg">No menu items found</div>
              <div className="text-gray-500 text-sm mt-2">
                Add some items to get started
              </div>
            </div>
          ) : (
            // Item Table
            <div className="overflow-x-auto">
              <div className="min-w-[900px]">
                {/* Header Row */}
                <div className="grid grid-cols-[80px_1.5fr_100px_80px_100px_80px_60px] gap-4 mb-6 pb-4 border-b border-gray-600">
                  <div className="text-amber-400 font-medium">Image</div>
                  <div className="text-amber-400 font-medium">Description</div>
                  <div className="text-amber-400 font-medium">Category</div>
                  <div className="text-amber-400 font-medium">Price</div>
                  <div className="text-amber-400 font-medium">Rating</div>
                  <div className="text-amber-400 font-medium">Hearts</div>
                  <div className="text-amber-400 font-medium">Delete</div>
                </div>

                {/* Item Rows */}
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item._id}
                      className="grid grid-cols-[80px_1.5fr_100px_80px_100px_80px_60px] gap-4 items-center py-4 border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors rounded-lg px-2"
                    >
                      {/* Item Image */}
                      <div className="flex justify-start">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      </div>

                      {/* Name + Description */}
                      <div>
                        <div className="text-white font-medium">{item.name}</div>
                        <div className="text-gray-400 text-sm">{item.description}</div>
                      </div>

                      {/* Category */}
                      <div className="text-gray-300">{item.category}</div>

                      {/* Price */}
                      <div className="flex items-center text-amber-400 font-medium gap-1">
                        <DollarSign className="w-4 h-4" />
                        {item.price}
                      </div>

                      {/* Rating */}
                      <div>{renderStars(item.rating)}</div>

                      {/* Popularity */}
                      <div className="flex items-center space-x-2">
                        <Heart className="w-4 h-4 text-amber-400" />
                        <span className="text-white">{item.popularity}</span>
                      </div>

                      {/* Delete Button */}
                      <div>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="flex items-center justify-center p-2 rounded-lg text-orange-500 hover:text-orange-400 hover:bg-orange-500/10 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
