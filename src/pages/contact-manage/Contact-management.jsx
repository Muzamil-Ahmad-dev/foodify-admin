import React, { useState, useEffect } from "react";
import { FaTrashAlt, FaFileExcel } from "react-icons/fa";
import * as XLSX from "xlsx";

// Helper for file download
const downloadFile = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
};

// Detect environment for API URLs
const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://1e20a7ed-cc85-497b-b510-b41debc2f036-00-1p28dt788ywz9.pike.replit.dev";

const CONTACT_API = `${BASE_URL}/api/contact`;

const formatDate = (d) =>
  d ? new Date(d).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" }) : "—";

export default function ContactManagement() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper: safe JSON parse
  async function parseJsonSafely(response) {
    const text = await response.text();
    try {
      return JSON.parse(text);
    } catch {
      throw new Error("Invalid server response (not JSON).");
    }
  }

  // Fetch contacts
  useEffect(() => {
    async function fetchContacts() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(CONTACT_API, {
          headers: { "Content-Type": "application/json" },
        });

        const data = await parseJsonSafely(res);

        if (!res.ok) throw new Error(data.message || "Failed to fetch contacts");

        setContacts(Array.isArray(data) ? data : data.data || []);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchContacts();
  }, []);

  // Delete contact
  async function deleteContact(id) {
    if (!window.confirm("Delete this contact message?")) return;
    try {
      const res = await fetch(`${CONTACT_API}/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      const data = await parseJsonSafely(res);
      if (!res.ok) throw new Error(data.message || "Failed to delete contact");

      setContacts((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error("Delete contact error:", err);
      alert("Error deleting contact: " + err.message);
    }
  }

  // Export to Excel
  const exportContactsToExcel = () => {
    const formatted = contacts.map((c) => ({
      ID: c._id,
      Name: c.fullName,
      Email: c.emailAddress,
      Phone: c.phoneNumber,
      Address: c.address,
      Dish: c.dishName,
      Message: c.query,
      CreatedAt: formatDate(c.createdAt),
    }));

    const ws = XLSX.utils.json_to_sheet(formatted);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Contacts");
    const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    downloadFile(new Blob([buf]), "Contacts_Report.xlsx");
  };

  return (
    <section className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-lg sm:text-xl font-semibold text-amber-200">
          Contact Messages
        </h1>
        <button
          onClick={exportContactsToExcel}
          className="flex items-center gap-2 bg-blue-700 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs"
        >
          <FaFileExcel className="w-4 h-4" /> Export Excel
        </button>
      </div>

      <div className="rounded-xl border border-amber-800/40 bg-amber-900/30 shadow-sm overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-amber-700/60 scrollbar-track-transparent">
          <table className="min-w-[720px] w-full text-left text-xs sm:text-sm">
            <thead className="sticky top-0 bg-amber-950/90">
              <tr className="text-amber-300">
                <th className="px-3 py-3 font-semibold">Full Name</th>
                <th className="px-3 py-3 font-semibold">Email</th>
                <th className="px-3 py-3 font-semibold">Phone</th>
                <th className="px-3 py-3 font-semibold">Dish</th>
                <th className="px-3 py-3 font-semibold">Query</th>
                <th className="px-3 py-3 font-semibold">Date</th>
                <th className="px-3 py-3 font-semibold">Delete</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-amber-200">
                    Loading contacts…
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-red-200">
                    {error}
                  </td>
                </tr>
              ) : contacts.length ? (
                contacts.map((c) => (
                  <tr
                    key={c._id}
                    className="border-t border-amber-800/40 hover:bg-amber-900/40 transition-colors"
                  >
                    <td className="px-3 py-3 text-amber-200">{c.fullName}</td>
                    <td className="px-3 py-3 text-amber-300">{c.emailAddress}</td>
                    <td className="px-3 py-3 text-amber-300">{c.phoneNumber}</td>
                    <td className="px-3 py-3 text-amber-300">{c.dishName}</td>
                    <td className="px-3 py-3 text-amber-300">{c.query}</td>
                    <td className="px-3 py-3 text-amber-300">{formatDate(c.createdAt)}</td>
                    <td className="px-3 py-3 text-center">
                      <button
                        onClick={() => deleteContact(c._id)}
                        className="text-red-400 hover:text-red-300 transition"
                        title="Delete Contact"
                      >
                        <FaTrashAlt className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-amber-200">
                    No contact messages found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
