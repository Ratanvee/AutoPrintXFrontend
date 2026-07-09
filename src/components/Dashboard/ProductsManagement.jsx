"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search, Plus, Eye, Edit, Trash2, Package,
  DollarSign, TrendingUp, Filter, Grid, List,
  X, Save, IndianRupee, ShoppingCart,
} from "lucide-react"
import toast from "react-hot-toast"
import axios from "axios"

const API = import.meta.env.VITE_BaseURL1

// ── API helpers ──
const fetchProducts = () => axios.get(`${API}products/`, { withCredentials: true })
const updatePricing = (service_id, price) =>
  axios.patch(`${API}products/`, { service_id, price }, { withCredentials: true })

// ── Edit Modal ──
const EditModal = ({ service, onClose, onSave }) => {
  const [price, setPrice] = useState(service.price ?? 0)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (price === "" || isNaN(price) || Number(price) < 0) {
      toast.error("Please enter a valid price")
      return
    }
    setSaving(true)
    try {
      await onSave(service.id, Number(price))
      toast.success(`✅ Pricing updated for ${service.name}`)
      onClose()
    } catch {
      toast.error("Failed to update pricing")
    } finally {
      setSaving(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 1000, padding: "16px",
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
        onClick={e => e.stopPropagation()}
        style={{
          background: "#fff", borderRadius: "16px", padding: "28px",
          width: "100%", maxWidth: "420px", boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div>
            <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 700, color: "#111827" }}>Edit Pricing</h3>
            <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#6b7280" }}>{service.name}</p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280" }}>
            <X size={20} />
          </button>
        </div>

        {/* Stats row */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px",
          marginBottom: "20px", padding: "14px", background: "#f9fafb",
          borderRadius: "10px", border: "1px solid #e5e7eb"
        }}>
          {[
            { label: "Total Sales", value: service.sales },
            { label: "Total Revenue", value: `₹${service.revenue}` },
            { label: "Pages Printed", value: service.pages || "—" },
          ].map(({ label, value }) => (
            <div key={label} style={{ textAlign: "center" }}>
              <p style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "#111827" }}>{value}</p>
              <p style={{ margin: 0, fontSize: "11px", color: "#6b7280" }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Price input */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "8px" }}>
            Price ({service.unit})
          </label>
          <div style={{ position: "relative" }}>
            <span style={{
              position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)",
              color: "#6b7280", fontWeight: 700
            }}>₹</span>
            <input
              type="number"
              min="0"
              step="0.5"
              value={price}
              onChange={e => setPrice(e.target.value)}
              style={{
                width: "100%", padding: "11px 12px 11px 30px", borderRadius: "8px",
                border: "1.5px solid #d1d5db", fontSize: "16px",
                fontWeight: 600, boxSizing: "border-box", outline: "none",
              }}
              autoFocus
            />
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={onClose} style={{
            flex: 1, padding: "11px", borderRadius: "8px",
            border: "1px solid #d1d5db", background: "#f9fafb",
            cursor: "pointer", fontWeight: 600, fontSize: "14px", color: "#374151"
          }}>
            Cancel
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={handleSave}
            disabled={saving}
            style={{
              flex: 2, padding: "11px", borderRadius: "8px",
              background: saving ? "#e5e7eb" : "linear-gradient(135deg, #6366f1, #4f46e5)",
              color: saving ? "#9ca3af" : "#fff", border: "none",
              cursor: saving ? "not-allowed" : "pointer",
              fontWeight: 700, fontSize: "14px",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "6px"
            }}
          >
            <Save size={15} /> {saving ? "Saving..." : "Save Price"}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ── Main Component ──
const ProductsManagement = () => {
  const [services, setServices] = useState([])
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [viewMode, setViewMode] = useState("list")
  const [editService, setEditService] = useState(null)

  // ── Fetch data ──
  const loadData = async () => {
    setLoading(true)
    try {
      const { data } = await fetchProducts()
      setServices(data.services || [])
      setSummary(data.summary || null)
    } catch (err) {
      toast.error("Failed to load services data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  // ── Save price ──
  const handleSavePrice = async (serviceId, price) => {
    await updatePricing(serviceId, price)
    setServices(prev =>
      prev.map(s => s.id === serviceId ? { ...s, price } : s)
    )
  }

  const filtered = services.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchCat = categoryFilter === "all" || s.category === categoryFilter
    return matchSearch && matchCat
  })

  const categories = [...new Set(services.map(s => s.category))]

  const statusColor = (s) => s === "active" ? "#10b981" : "#9ca3af"
  const statusBg = (s) => s === "active" ? "#f0fdf4" : "#f9fafb"

  if (loading) return (
    <div style={{ padding: "40px", textAlign: "center", color: "#6b7280" }}>
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        style={{ width: "32px", height: "32px", border: "3px solid #e5e7eb", borderTopColor: "#6366f1", borderRadius: "50%", margin: "0 auto 12px" }} />
      Loading services...
    </div>
  )

  return (
    <motion.div
      className="products-management"
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
    >
      {/* ── Header ── */}
      <div className="page-header">
        <div className="header-left">
          <h1>Services & Pricing</h1>
          <p>View sales, revenue and manage pricing for each service</p>
        </div>
      </div>

      {/* ── Summary Stats ── */}
      {summary && (
        <motion.div className="product-stats" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          {[
            {
              icon: <ShoppingCart size={24} />,
              title: "Total Orders",
              value: summary.total_orders,
              sub: `+${summary.this_month_orders} this month`,
              positive: true,
            },
            {
              icon: <IndianRupee size={24} />,
              title: "Total Revenue",
              value: `₹${summary.total_revenue.toLocaleString("en-IN")}`,
              sub: `${summary.revenue_change_pct >= 0 ? "+" : ""}${summary.revenue_change_pct}% vs last month`,
              positive: summary.revenue_change_pct >= 0,
            },
            {
              icon: <TrendingUp size={24} />,
              title: "Best Seller",
              value: summary.best_seller,
              sub: `${summary.best_seller_sales} sales`,
              positive: true,
            },
            {
              icon: <Package size={24} />,
              title: "Active Services",
              value: `${summary.active_services} / ${summary.total_services}`,
              sub: "Currently active",
              positive: true,
            },
          ].map(({ icon, title, value, sub, positive }) => (
            <div key={title} className="stat-card">
              <div className="stat-icon">{icon}</div>
              <div className="stat-info">
                <h3>{title}</h3>
                <p className="stat-number">{value}</p>
                <span className={`stat-change ${positive ? "positive" : "negative"}`}>{sub}</span>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {/* ── Filters ── */}
      <motion.div className="filters-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <div className="search-box">
          <Search size={20} />
          <input
            type="text" placeholder="Search services..."
            value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="filter-select">
          <option value="all">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <div className="view-toggle">
          <button className={`btn-icon ${viewMode === "list" ? "active" : ""}`} onClick={() => setViewMode("list")}><List size={16} /></button>
          <button className={`btn-icon ${viewMode === "grid" ? "active" : ""}`} onClick={() => setViewMode("grid")}><Grid size={16} /></button>
        </div>
      </motion.div>

      {/* ── List View ── */}
      <motion.div className={`products-container ${viewMode}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        {viewMode === "list" ? (
          <div className="products-table-container">
            <div className="table-header">
              <h3>Services ({filtered.length})</h3>
            </div>
            <div className="table-responsive">
              <table className="products-table">
                <thead>
                  <tr>
                    <th>Service</th>
                    <th>Category</th>
                    <th>Unit</th>
                    <th>Price (₹)</th>
                    <th>Orders</th>
                    <th>Pages</th>
                    <th>Revenue (₹)</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filtered.map((s, i) => (
                      <motion.tr
                        key={s.id}
                        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3, delay: i * 0.04 }}
                      >
                        <td>
                          <div className="product-info">
                            <div style={{
                              width: "36px", height: "36px", borderRadius: "8px",
                              background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                            }}>
                              <Package size={16} color="#fff" />
                            </div>
                            <span className="product-name">{s.name}</span>
                          </div>
                        </td>
                        <td>{s.category}</td>
                        <td style={{ fontSize: "12px", color: "#6b7280" }}>{s.unit}</td>
                        <td className="price">
                          {s.price > 0
                            ? <span style={{ fontWeight: 700, color: "#059669" }}>₹{s.price}</span>
                            : <span style={{ color: "#9ca3af", fontSize: "12px" }}>Not set</span>
                          }
                        </td>
                        <td style={{ fontWeight: 600 }}>{s.sales}</td>
                        <td style={{ color: "#6b7280" }}>{s.pages || "—"}</td>
                        <td className="revenue" style={{ fontWeight: 700, color: "#059669" }}>
                          ₹{Number(s.revenue).toLocaleString("en-IN")}
                        </td>
                        <td>
                          <span style={{
                            padding: "3px 10px", borderRadius: "20px", fontSize: "12px",
                            fontWeight: 600, background: statusBg(s.status), color: statusColor(s.status),
                            border: `1px solid ${statusColor(s.status)}30`
                          }}>
                            {s.status}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <motion.button
                              className="btn-icon" title="Edit Pricing"
                              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                              onClick={() => setEditService(s)}
                            >
                              <Edit size={16} />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>

        ) : (
          /* ── Grid View ── */
          <div className="products-grid">
            <AnimatePresence>
              {filtered.map((s, i) => (
                <motion.div
                  key={s.id} className="product-card"
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.3, delay: i * 0.07 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <div className="product-image-container" style={{
                    background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                    display: "flex", alignItems: "center", justifyContent: "center", minHeight: "80px"
                  }}>
                    <Package size={32} color="#fff" />
                    <span style={{
                      position: "absolute", top: "10px", right: "10px",
                      padding: "3px 10px", borderRadius: "20px", fontSize: "11px",
                      fontWeight: 700, background: statusBg(s.status), color: statusColor(s.status),
                    }}>
                      {s.status}
                    </span>
                  </div>
                  <div className="product-details">
                    <h4>{s.name}</h4>
                    <p className="product-category">{s.category} · {s.unit}</p>
                    <div className="product-pricing">
                      <span className="price">
                        {s.price > 0 ? `₹${s.price}` : <span style={{ color: "#9ca3af", fontSize: "12px" }}>Price not set</span>}
                      </span>
                    </div>
                    <div className="product-stats">
                      <div className="stat"><span className="label">Orders:</span><span className="value">{s.sales}</span></div>
                      <div className="stat"><span className="label">Revenue:</span><span className="value">₹{Number(s.revenue).toLocaleString("en-IN")}</span></div>
                      <div className="stat"><span className="label">Pages:</span><span className="value">{s.pages || "—"}</span></div>
                    </div>
                    <div className="product-actions">
                      <motion.button className="btn-icon" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                        onClick={() => setEditService(s)} title="Edit Pricing">
                        <Edit size={16} />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>

      {/* ── Edit Modal ── */}
      <AnimatePresence>
        {editService && (
          <EditModal
            service={editService}
            onClose={() => setEditService(null)}
            onSave={handleSavePrice}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default ProductsManagement