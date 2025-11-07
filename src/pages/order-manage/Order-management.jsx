import { useState, useEffect, useMemo } from "react"
import { Truck, CreditCard, Wallet, DollarSign, Trash2, FileSpreadsheet } from "lucide-react"
import * as XLSX from "xlsx"

// Detect environment for API URLs
const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://1e20a7ed-cc85-497b-b510-b41debc2f036-00-1p28dt788ywz9.pike.replit.dev"

const API = `${BASE_URL}/api/orders`

// ✅ Status Pill Component
function StatusPill({ tone, icon, children }) {
  const colors = {
    green: "bg-green-800/30 text-green-300 border-green-700/40",
    amber: "bg-amber-800/30 text-amber-300 border-amber-700/40",
    red: "bg-red-800/30 text-red-300 border-red-700/40",
    blue: "bg-blue-800/30 text-blue-300 border-blue-700/40",
    slate: "bg-slate-800/30 text-slate-300 border-slate-700/40",
  }
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs border whitespace-nowrap ${colors[tone]}`}
    >
      {icon}
      {children}
    </span>
  )
}

// ✅ Helpers
const getDeliveryPill = (status) => {
  switch (status) {
    case "delivered":
      return { label: "Delivered", tone: "green", icon: <Truck className="h-3.5 w-3.5" /> }
    case "cancelled":
      return { label: "Cancelled", tone: "red", icon: <Truck className="h-3.5 w-3.5" /> }
    default:
      return { label: "Out for Delivery", tone: "blue", icon: <Truck className="h-3.5 w-3.5" /> }
  }
}

const getPaymentPill = (method) => {
  const m = (method || "").toLowerCase()
  if (m.includes("cod") || m.includes("cash"))
    return { label: "COD", tone: "amber", icon: <Wallet className="h-3.5 w-3.5" /> }
  if (m.includes("online") || m.includes("card") || m.includes("upi"))
    return { label: "Online", tone: "blue", icon: <CreditCard className="h-3.5 w-3.5" /> }
  return { label: method || "Pending", tone: "slate", icon: <DollarSign className="h-3.5 w-3.5" /> }
}

const currency = (v) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(v)

const totalQty = (items = []) => items.reduce((n, i) => n + (i.quantity || 0), 0)

const formatDate = (d) => (d ? new Date(d).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" }) : "—")

export default function OrderManagement() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const token = localStorage.getItem("token")

  // ✅ Safe JSON parse helper
  async function parseJsonSafely(response) {
    const text = await response.text()
    try {
      return JSON.parse(text)
    } catch {
      throw new Error("Invalid server response (not JSON).")
    }
  }

  // ✅ Fetch Orders
  useEffect(() => {
    async function fetchOrders() {
      setLoading(true)
      setError(null)
      try {
        const orderRes = await fetch(API, {
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        })

        const orderData = await parseJsonSafely(orderRes)

        if (!orderRes.ok) throw new Error(orderData.message || "Failed to fetch orders")

        setOrders(orderData.data || [])
      } catch (err) {
        console.error("Fetch error:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [token])

  // ✅ Update order status
  async function updateStatus(id, newStatus) {
    try {
      const res = await fetch(`${API}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      const data = await parseJsonSafely(res)

      if (!res.ok || !data.success) throw new Error(data.message || "Failed to update order")

      setOrders((prev) => prev.map((o) => (o._id === id ? { ...o, status: newStatus } : o)))
    } catch (err) {
      console.error("Update Error:", err)
      alert("Error updating status: " + err.message)
    }
  }

  // ✅ Delete order
  async function deleteOrder(id) {
    if (!window.confirm("Delete this order?")) return
    try {
      const res = await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      })

      const data = await parseJsonSafely(res)

      if (!res.ok || !data.success) throw new Error(data.message || "Failed to delete order")

      setOrders((prev) => prev.filter((o) => o._id !== id))
    } catch (err) {
      console.error("Delete Error:", err)
      alert("Error deleting order: " + err.message)
    }
  }

  // ✅ Excel Export
  const exportOrdersToExcel = () => {
    const formatted = orders.map((o) => ({
      ID: o._id,
      Name: `${o.firstName || ""} ${o.lastName || ""}`,
      Email: o.email,
      Phone: o.phone,
      Address: o.address,
      City: o.city,
      ZipCode: o.zipCode,
      Payment: o.paymentMethod,
      Status: o.status,
      TotalItems: totalQty(o.items),
      TotalPrice: o.totalPrice,
      CreatedAt: formatDate(o.createdAt),
    }))
    const ws = XLSX.utils.json_to_sheet(formatted)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Orders")
    const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" })
    downloadFile(new Blob([buf]), "Orders_Report.xlsx")
  }

  // ✅ Orders Table Content
  const orderContent = useMemo(() => {
    if (loading)
      return (
        <tr>
          <td colSpan={9} className="py-6 text-center text-amber-200">
            Loading orders…
          </td>
        </tr>
      )
    if (error)
      return (
        <tr>
          <td colSpan={9} className="py-6 text-center text-red-200">
            {error}
          </td>
        </tr>
      )
    if (!orders.length)
      return (
        <tr>
          <td colSpan={9} className="py-6 text-center text-amber-200">
            No orders found
          </td>
        </tr>
      )

    return orders.map((order) => {
      const payment = getPaymentPill(order.paymentMethod)
      const delivery = getDeliveryPill(order.status)
      return (
        <tr key={order._id} className="border-t border-amber-800/40 hover:bg-amber-900/40 transition-colors">
          <td className="px-3 py-3 text-amber-200 text-xs">{order.email || order.phone || "—"}</td>
          <td className="px-3 py-3 text-xs text-amber-300">
            {order.address}, {order.city}
          </td>
          <td className="px-3 py-3 text-center text-amber-300">{totalQty(order.items)}</td>
          <td className="px-3 py-3 text-amber-300">{currency(order.totalPrice || 0)}</td>
          <td className="px-3 py-3 text-xs text-amber-300">{formatDate(order.createdAt)}</td>
          <td className="px-3 py-3">
            <StatusPill tone={payment.tone} icon={payment.icon}>
              {payment.label}
            </StatusPill>
          </td>
          <td className="px-3 py-3">
            <select
              value={order.status}
              onChange={(e) => updateStatus(order._id, e.target.value)}
              className="bg-amber-900/40 text-amber-200 text-xs rounded px-2 py-1"
            >
              <option value="pending">Processing</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </td>
          <td className="px-3 py-3">
            <StatusPill tone={delivery.tone} icon={delivery.icon}>
              {delivery.label}
            </StatusPill>
          </td>
          <td className="px-3 py-3">
            <button
              onClick={() => deleteOrder(order._id)}
              className="text-red-400 hover:text-red-300 transition"
              title="Delete Order"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </td>
        </tr>
      )
    })
  }, [orders, loading, error])

  return (
    <section>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-lg sm:text-xl font-semibold text-amber-200">Orders Management</h1>
        <button
          onClick={exportOrdersToExcel}
          className="flex items-center gap-2 bg-green-700 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs"
        >
          <FileSpreadsheet className="w-4 h-4" /> Export Excel
        </button>
      </div>

      <div className="rounded-xl border border-amber-800/40 bg-amber-900/30 shadow-sm overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-amber-700/60 scrollbar-track-transparent">
          <table className="min-w-[960px] w-full text-left text-xs sm:text-sm">
            <thead className="sticky top-0 bg-amber-950/90">
              <tr className="text-amber-300">
                <th className="px-3 py-3 font-semibold">Login</th>
                <th className="px-3 py-3 font-semibold">Address</th>
                <th className="px-3 py-3 text-center font-semibold">Total Items</th>
                <th className="px-3 py-3 font-semibold">Price</th>
                <th className="px-3 py-3 font-semibold">Created</th>
                <th className="px-3 py-3 font-semibold">Payment</th>
                <th className="px-3 py-3 font-semibold">Status</th>
                <th className="px-3 py-3 font-semibold">Delivery</th>
                <th className="px-3 py-3 font-semibold">Delete</th>
              </tr>
            </thead>
            <tbody>{orderContent}</tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
