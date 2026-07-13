// "use client"

// import { useState, useEffect } from "react"
// import axios from "axios"
// import { motion, AnimatePresence } from "framer-motion"
// import {
//   Search,
//   Filter,
//   Download,
//   Plus,
//   Eye,
//   Edit,
//   Trash2,
//   MoreHorizontal,
//   Calendar,
//   ChevronLeft,
//   ChevronRight,
// } from "lucide-react"

// import { get_dashboard, fetchOrdersAPI } from "./api/endpoints";
// // ✅ Axios setup
// // axios.defaults.baseURL = "http://127.0.0.1:8000/api/"
// axios.defaults.withCredentials = true

// const OrdersManagement = () => {
//   const [orders, setOrders] = useState([])
//   const [searchTerm, setSearchTerm] = useState("")
//   const [statusFilter, setStatusFilter] = useState("all")
//   const [dateRange, setDateRange] = useState({ from: "", to: "" })
//   const [currentPage, setCurrentPage] = useState(1)
//   const [itemsPerPage] = useState(10)
//   const [loading, setLoading] = useState(false)
//   const [totalPages, setTotalPages] = useState(1)

//   // 🔄 Fetch orders from Django
//   const fetchOrders = async () => {
//     setLoading(true)
//     try {
//       const data = await fetchOrdersAPI(searchTerm, statusFilter, dateRange.from, dateRange.to, currentPage, itemsPerPage);
//       setOrders(data.orders || [])
//       setTotalPages(data.total_pages || 1)
//     } catch (error) {
//       console.error("Error fetching orders:", error)
//       if (error.response?.status === 401) {
//         alert("Session expired. Please login again.")
//         window.location.href = "/login"
//       }
//     }
//     setLoading(false)
//   }

//   useEffect(() => {
//     fetchOrders()
//   }, [searchTerm, statusFilter, dateRange, currentPage])

//   // 🎨 Helper functions for UI colors
//   const getStatusColor = (status) => {
//     switch (status) {
//       case "Complete": return "text-success"
//       case "Processing": return "text-warning"
//       case "Pending": return "text-danger"
//       case "Cancelled": return "text-light bg-dark"
//       default: return "text-dark"
//     }
//   }
//   // 🎨 Helper function for payment status colors
//   const getPaymentStatusColor = (status) => {
//     // console.log("Getting color for payment status:", status)
//     switch (status) {
//       case true: return "text-success"
//       case "Pending": return "text-warning"
//       case "Failed": return "text-danger"
//       default: return "text-dark"
//     }
//   }

//   // 📑 Pagination Renderer
//   const renderPageNumbers = () => {
//     const pageNumbers = []
//     const maxPagesToShow = 5

//     if (totalPages <= maxPagesToShow) {
//       for (let i = 1; i <= totalPages; i++) pageNumbers.push(i)
//     } else {
//       const left = Math.max(1, currentPage - 2)
//       const right = Math.min(totalPages, currentPage + 2)

//       if (left > 1) {
//         pageNumbers.push(1)
//         if (left > 2) pageNumbers.push("...")
//       }

//       for (let i = left; i <= right; i++) pageNumbers.push(i)

//       if (right < totalPages) {
//         if (right < totalPages - 1) pageNumbers.push("...")
//         pageNumbers.push(totalPages)
//       }
//     }

//     return pageNumbers.map((num, index) =>
//       num === "..." ? (
//         <span key={index} className="dots">…</span>
//       ) : (
//         <button
//           key={index}
//           className={`btn-page ${currentPage === num ? "active" : ""}`}
//           onClick={() => setCurrentPage(num)}
//         >
//           {num}
//         </button>
//       )
//     )
//   }

//   const downloadFile = (url, filename) => {
//     fetch(url, {
//       method: "GET",
//       headers: {
//         // Add auth headers if needed
//       },
//     })
//       .then((res) => res.blob())
//       .then((blob) => {
//         const link = document.createElement("a")
//         link.href = window.URL.createObjectURL(blob)
//         link.download = filename
//         link.click()
//       })
//       .catch((err) => console.error(err))
//   }


//   return (
//     <motion.div
//       className="orders-management"
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5 }}
//     >
//       <style>
//         {`
//           .pagination {
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           gap: 6px;
//           margin-top: 1rem;
//         }

//         .btn-page {
//           border: none;
//           background: transparent;
//           padding: 6px 10px;
//           border-radius: 6px;
//           cursor: pointer;
//           transition: 0.2s;
//         }

//         .btn-page:hover {
//           background-color: rgba(0, 0, 0, 0.05);
//         }

//         .btn-page.active {
//           background-color: #0a2499;
//           color: white;
//           font-weight: bold;
//         }

//         .dots {
//           padding: 0 5px;
//           color: #777;
//         }

//         `}
//       </style>
//       <div className="page-header">
//         <div className="header-left">
//           <h1>Orders Management</h1>
//           <p>Manage and track all your customer print orders</p>
//         </div>
//         {/* <div className="header-actions">
//           <motion.button className="btn-secondary" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//             <Download size={16} /> Export
//           </motion.button>
//           <motion.button className="btn-primary" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//             <Plus size={16} /> New Order
//           </motion.button>
//         </div> */}
//       </div>

//       {/* 🔍 Filters */}
//       <motion.div
//         className="filters-container"
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.2 }}
//       >
//         <div className="search-box">
//           <Search size={16} />
//           <input
//             type="text"
//             placeholder="Search orders or customers..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>

//         <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="filter-select">
//           <option value="all">All Status</option>
//           <option value="pending">Pending</option>
//           <option value="in process">In Process</option>
//           <option value="complete">Completed</option>
//         </select>

//         <div className="date-range">
//           <Calendar size={16} />
//           <input
//             type="date"
//             value={dateRange.from}
//             onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
//           />
//           <span>to</span>
//           <input
//             type="date"
//             value={dateRange.to}
//             onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
//           />
//         </div>

//         <button onClick={fetchOrders} className="btn-primary">
//           Apply Filters
//         </button>
//       </motion.div>

//       {/* 📋 Orders Table */}
//       <motion.div
//         className="orders-table-container"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ delay: 0.3 }}
//       >
//         <div className="table-header">
//           <h3>Orders ({orders.length})</h3>
//           <div className="table-actions">
//             <button className="btn-icon"><Filter size={16} /></button>
//             <button className="btn-icon"><MoreHorizontal size={16} /></button>
//           </div>
//         </div>

//         {loading ? (
//           <p style={{ textAlign: "center", margin: "2rem" }}>Loading orders...</p>
//         ) : (
//           <div className="table-responsive">
//             <table className="orders-table">
//               <thead>
//                 <tr>
//                   <th>Order ID</th>
//                   <th>Customer</th>
//                   <th>Date</th>
//                   <th>Pages</th>
//                   <th>Amount</th>
//                   <th>Status</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 <AnimatePresence>
//                   {orders.length > 0 ? (
//                     orders.map((order, index) => (
//                       <motion.tr
//                         key={order.id}
//                         initial={{ opacity: 0, x: -20 }}
//                         animate={{ opacity: 1, x: 0 }}
//                         exit={{ opacity: 0, x: 20 }}
//                         transition={{ duration: 0.3, delay: index * 0.05 }}
//                         whileHover={{ backgroundColor: "rgba(10, 36, 99, 0.02)" }}
//                       >
//                         <td className="order-id">{order.OrderId}</td>
//                         <td>{order.CustomerName || "N/A"}</td>
//                         <td>{new Date(order.Created_at).toLocaleString()}</td>
//                         <td className="text-dark">{order.NoOfPages || "—"}</td>
//                         <td className={`amount ${getPaymentStatusColor(order.PaymentStatus)}`}>
//                           ₹{order.PaymentAmount || 0}
//                         </td>
//                         <td>
//                           <span className={`status ${getStatusColor(order.PrintStatus)}`}>
//                             {order.PrintStatus || "N/A"}
//                           </span>
//                         </td>
//                         {/* <td>
//                           <div className="action-buttons">
//                             <motion.button className="btn-icon" whileHover={{ scale: 1.1 }} title="View">
//                               <Eye size={16} />
//                             </motion.button>
//                             <motion.button className="btn-icon" whileHover={{ scale: 1.1 }} title="Edit">
//                               <Edit size={16} />
//                             </motion.button>
//                             <motion.button className="btn-icon danger" whileHover={{ scale: 1.1 }} title="Delete">
//                               <Trash2 size={16} />
//                             </motion.button>
//                           </div>
//                         </td> */}
//                         <td>
//                           <div className="action-buttons flex gap-2">
//                             {/* 👁 View File */}
//                             {order.FileUpload && (
//                               <motion.a
//                                 href={order.FileUpload}
//                                 target="_blank"
//                                 rel="noopener noreferrer"
//                                 className="btn-icon"
//                                 whileHover={{ scale: 1.1 }}
//                                 whileTap={{ scale: 0.9 }}
//                                 title="View File"
//                               >
//                                 <Eye size={16} />
//                               </motion.a>
//                             )}

//                             {/* ⬇ Download File */}
//                             {order.FileUpload && (
//                               // <motion.a
//                               //   href={`http://127.0.0.1:8000${order.FileUpload}`}
//                               //   download
//                               //   className="btn-icon"
//                               //   whileHover={{ scale: 1.1 }}
//                               //   whileTap={{ scale: 0.9 }}
//                               //   title="Download File"
//                               //   target="_blank"
//                               // >
//                               //   <Download size={16} />
//                               // </motion.a>
//                               <motion.button
//                                 className="btn-icon"
//                                 whileHover={{ scale: 1.1 }}
//                                 whileTap={{ scale: 0.9 }}
//                                 onClick={() => downloadFile(order.FileUpload, "file.pdf")}
//                                 title="Download File"
//                               >
//                                 <Download size={16} />
//                               </motion.button>

//                             )}

//                             {/* 🖨 Print
//                             <motion.button
//                               className="btn-icon"
//                               whileHover={{ scale: 1.1 }}
//                               whileTap={{ scale: 0.9 }}
//                               title="Print Order"
//                               // onClick={() => handlePrint(order.file_url, order.id, order.color_mode || "Color")}
//                             >
//                               <Printer size={16} />
//                             </motion.button> */}

//                             <motion.button
//                               className="btn-icon"
//                               whileHover={{ scale: 1.1 }}
//                               whileTap={{ scale: 0.9 }}
//                               title="More Actions"
//                             >
//                               <MoreHorizontal size={16} />
//                             </motion.button>
//                           </div>
//                         </td>
//                       </motion.tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan="7" style={{ textAlign: "center", padding: "1rem" }}>No orders found.</td>
//                     </tr>
//                   )}
//                 </AnimatePresence>
//               </tbody>
//             </table>
//           </div>
//         )}

//         {/* ✅ Pagination */}
//         <div className="pagination">
//           <button
//             className="btn-icon"
//             disabled={currentPage === 1}
//             onClick={() => setCurrentPage(currentPage - 1)}
//           >
//             <ChevronLeft size={16} />
//           </button>

//           {renderPageNumbers()}

//           <button
//             className="btn-icon"
//             disabled={currentPage === totalPages}
//             onClick={() => setCurrentPage(currentPage + 1)}
//           >
//             <ChevronRight size={16} />
//           </button>
//         </div>


//         {/* <div className="pagination">
//           <button className="btn-icon" disabled={currentPage === 1}>
//             <ChevronLeft size={16} />
//           </button>
//           <div className="page-numbers">
//             {[1, 2, 3, 4, 5].map((page) => (
//               <button
//                 key={page}
//                 className={`page-number ${currentPage === page ? "active" : ""}`}
//                 onClick={() => setCurrentPage(page)}
//               >
//                 {page}
//               </button>
//             ))}
//           </div>
//           <button className="btn-icon" disabled={currentPage === 5}>
//             <ChevronRight size={16} />
//           </button>
//         </div> */}
//       </motion.div>
//     </motion.div>
//   )
// }

// export default OrdersManagement








"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import axios from "axios"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search, Filter, Download, Eye, RefreshCw,
  Calendar, ChevronLeft, ChevronRight, X,
  FileText, Info, Clock, CreditCard, Layers, Hash,
  Printer
} from "lucide-react"
import { fetchOrdersAPI } from "./api/endpoints"

axios.defaults.withCredentials = true

// ─────────────────────────────────────────────
// FILE VIEWER POPUP
// ─────────────────────────────────────────────
const FileViewerPopup = ({ order, onClose }) => {
  const parseFiles = () => {
    const raw = order.FileUpload || order.file_url
    if (!raw) return []
    try {
      const parsed = JSON.parse(raw)
      if (typeof parsed === "object" && !Array.isArray(parsed))
        return Object.entries(parsed).map(([name, url]) => ({ name, url }))
    } catch { }
    if (typeof raw === "string" && raw.startsWith("http"))
      return [{ name: `${order.OrderId || "file"}.pdf`, url: raw }]
    return []
  }

  const files = parseFiles()
  const [activeIdx, setActiveIdx] = useState(0)
  const [loadState, setLoadState] = useState("loading") // "loading" | "loaded" | "error"
  const activeFile = files[activeIdx] || null

  // Reset load state whenever active file changes
  const handleTabChange = (i) => { setActiveIdx(i); setLoadState("loading") }

  const isPDF = (file) => file?.url?.toLowerCase().includes(".pdf") || file?.name?.toLowerCase().endsWith(".pdf")
  const isImage = (file) => /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(file?.url || file?.name || "")

  const handleDownload = (file) => {
    if (!file) return
    fetch(file.url)
      .then(r => { if (!r.ok) throw new Error("Failed"); return r.blob() })
      .then(blob => {
        const a = document.createElement("a")
        a.href = URL.createObjectURL(blob)
        a.download = file.name
        a.click()
        URL.revokeObjectURL(a.href)
      })
      .catch(err => console.error("Download failed:", err))
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: 16 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.93, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.93, y: 16 }}
        transition={{ type: "spring", stiffness: 320, damping: 26 }}
        onClick={e => e.stopPropagation()}
        style={{
          background: "#fff", borderRadius: 14, width: "100%", maxWidth: 860,
          height: "90vh", boxShadow: "0 24px 64px rgba(0,0,0,0.25)",
          display: "flex", flexDirection: "column", overflow: "hidden"
        }}
      >
        {/* ── Header ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderBottom: "1px solid #e5e7eb", background: "#f9fafb", flexShrink: 0 }}>
          {/* File icon + name */}
          <div style={{ width: 30, height: 30, borderRadius: 6, background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <FileText size={15} color="#3b82f6" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {activeFile?.name || "No file"}
            </div>
            <div style={{ fontSize: 11, color: "#9ca3af" }}>
              {order.OrderId} · {order.NoOfPages ? `${order.NoOfPages} pages` : ""} · {files.length} file{files.length !== 1 ? "s" : ""}
            </div>
          </div>

          {/* Tabs if multiple files */}
          {files.length > 1 && (
            <div style={{ display: "flex", gap: 4, overflowX: "auto" }}>
              {files.map((f, i) => (
                <button key={i} onClick={() => handleTabChange(i)} style={{
                  padding: "4px 10px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 500, whiteSpace: "nowrap",
                  background: activeIdx === i ? "#3b82f6" : "#e5e7eb",
                  color: activeIdx === i ? "#fff" : "#374151",
                }}>
                  {i + 1}. {f.name.length > 12 ? f.name.slice(0, 12) + "…" : f.name}
                </button>
              ))}
            </div>
          )}

          {/* Action buttons */}
          <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
            {activeFile && (
              <motion.button
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                onClick={() => handleDownload(activeFile)}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 8, border: "none", background: "#3b82f6", color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer" }}
              >
                <Download size={14} /> Download
              </motion.button>
            )}
            <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#6b7280" }}>
              <X size={16} />
            </button>
          </div>
        </div>

        {/* ── File viewer body ── */}
        <div style={{ flex: 1, overflow: "hidden", background: "#f1f5f9", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {!activeFile ? (
            <div style={{ textAlign: "center", color: "#9ca3af" }}>
              <FileText size={40} style={{ marginBottom: 12, opacity: 0.4 }} />
              <p>No file attached to this order</p>
            </div>
          ) : isPDF(activeFile) ? (
            <>
              {/* Loading spinner overlay */}
              {loadState === "loading" && (
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "#f1f5f9", zIndex: 2 }}>
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    style={{ width: 36, height: 36, border: "3px solid #e2e8f0", borderTopColor: "#3b82f6", borderRadius: "50%" }}
                  />
                </div>
              )}
              {loadState === "error" && (
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, zIndex: 2 }}>
                  <FileText size={40} color="#9ca3af" />
                  <p style={{ color: "#6b7280", fontSize: 14 }}>Cannot preview this file directly.</p>
                  <motion.button whileHover={{ scale: 1.04 }} onClick={() => window.open(activeFile.url, "_blank")}
                    style={{ padding: "8px 18px", borderRadius: 8, border: "none", background: "#3b82f6", color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                    Open in new tab
                  </motion.button>
                </div>
              )}
              <iframe
                key={activeFile.url}
                src={activeFile.url}
                title={activeFile.name}
                onLoad={() => setLoadState("loaded")}
                onError={() => setLoadState("error")}
                style={{ width: "100%", height: "100%", border: "none", display: loadState === "error" ? "none" : "block" }}
              />
            </>
          ) : isImage(activeFile) ? (
            <>
              {loadState === "loading" && (
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    style={{ width: 36, height: 36, border: "3px solid #e2e8f0", borderTopColor: "#3b82f6", borderRadius: "50%" }}
                  />
                </div>
              )}
              <img
                key={activeFile.url}
                src={activeFile.url}
                alt={activeFile.name}
                onLoad={() => setLoadState("loaded")}
                onError={() => setLoadState("error")}
                style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", display: loadState === "loading" ? "none" : "block" }}
              />
              {loadState === "error" && <p style={{ color: "#9ca3af" }}>Failed to load image</p>}
            </>
          ) : (
            /* Unsupported type — show open in tab fallback */
            <div style={{ textAlign: "center", color: "#6b7280" }}>
              <FileText size={44} style={{ marginBottom: 14, opacity: 0.4 }} />
              <p style={{ fontSize: 14, marginBottom: 12 }}>Preview not available for this file type.</p>
              <motion.button whileHover={{ scale: 1.04 }} onClick={() => window.open(activeFile.url, "_blank")}
                style={{ padding: "8px 18px", borderRadius: 8, border: "none", background: "#3b82f6", color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                Open in new tab
              </motion.button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────
// ORDER DETAIL POPUP
// ─────────────────────────────────────────────
const OrderDetailPopup = ({ order, onClose }) => {
  const rows = [
    { icon: Hash, label: "Order ID", value: order.OrderId },
    { icon: Clock, label: "Created", value: order.Created_at ? new Date(order.Created_at).toLocaleString() : "—" },
    { icon: FileText, label: "Customer", value: order.CustomerName || "—" },
    { icon: Layers, label: "Print Color", value: order.PrintColor || "—" },
    { icon: Layers, label: "Paper Size", value: order.PaperSize || "—" },
    { icon: Layers, label: "Paper Type", value: order.PaperType || "—" },
    { icon: Layers, label: "Print Side", value: order.PrintSide || "—" },
    { icon: Layers, label: "Binding", value: order.Binding || "None" },
    { icon: FileText, label: "Total Pages", value: order.NoOfPages || "—" },
    { icon: Hash, label: "Copies", value: order.NumberOfCopies || "1" },
    { icon: CreditCard, label: "Amount", value: `₹${order.PaymentAmount || 0}` },
    { icon: CreditCard, label: "Payment", value: order.PaymentStatus === true ? "✅ Paid" : order.PaymentStatus === false ? "❌ Unpaid" : order.PaymentStatus || "—" },
    { icon: CreditCard, label: "Payment Method", value: order.PaymentMethod || "—" },
    { icon: Hash, label: "Transaction ID", value: order.Transaction_id || "—" },
    { icon: Printer, label: "Print Status", value: order.PrintStatus || "—" },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: 16 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, y: 14 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 14 }}
        transition={{ type: "spring", stiffness: 320, damping: 26 }}
        onClick={e => e.stopPropagation()}
        style={{ background: "#fff", borderRadius: 14, width: "100%", maxWidth: 460, boxShadow: "0 20px 60px rgba(0,0,0,0.18)", overflow: "hidden" }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", background: "linear-gradient(135deg,#6366f1,#4f46e5)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Info size={16} color="#fff" />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>Order Details</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)" }}>{order.OrderId}</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 6, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff" }}>
            <X size={14} />
          </button>
        </div>

        {/* Details */}
        <div style={{ padding: "16px 20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, maxHeight: 420, overflowY: "auto" }}>
          {rows.map(({ icon: Icon, label, value }) => (
            <div key={label} style={{ padding: "10px 12px", borderRadius: 8, background: "#f9fafb", border: "1px solid #f0f0f0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 4 }}>
                <Icon size={11} color="#9ca3af" />
                <span style={{ fontSize: 10, color: "#9ca3af", textTransform: "uppercase", letterSpacing: ".4px", fontWeight: 500 }}>{label}</span>
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{value ?? "—"}</div>
            </div>
          ))}
        </div>

        <div style={{ padding: "12px 20px", borderTop: "1px solid #f0f0f0", display: "flex", justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid #e5e7eb", background: "#f9fafb", cursor: "pointer", fontSize: 13, fontWeight: 500, color: "#374151" }}>Close</button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
const OrdersManagement = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  // Filter state — changes here DON'T trigger a fetch automatically
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateRange, setDateRange] = useState({ from: "", to: "" })

  // Applied filter state — fetching only happens when these change
  const [appliedSearch, setAppliedSearch] = useState("")
  const [appliedStatus, setAppliedStatus] = useState("all")
  const [appliedDateRange, setAppliedDateRange] = useState({ from: "", to: "" })

  // Popup state
  const [viewerOrder, setViewerOrder] = useState(null)
  const [detailOrder, setDetailOrder] = useState(null)

  // ── Core fetch — always reads from refs so it's never stale ──
  const appliedSearchRef = useRef("")
  const appliedStatusRef = useRef("all")
  const appliedDateRangeRef = useRef({ from: "", to: "" })

  const fetchOrders = useCallback(async (page) => {
    setLoading(true)
    try {
      const data = await fetchOrdersAPI(
        appliedSearchRef.current,
        appliedStatusRef.current,
        appliedDateRangeRef.current.from,
        appliedDateRangeRef.current.to,
        page,
        itemsPerPage
      )
      setOrders(data.orders || [])
      setTotalPages(data.total_pages || 1)
      setCurrentPage(page)
    } catch (error) {
      console.error("Error fetching orders:", error)
      if (error.response?.status === 401) {
        alert("Session expired. Please login again.")
        window.location.href = "/login"
      }
    }
    setLoading(false)
  }, [itemsPerPage])

  // ── Initial fetch on mount ──
  useEffect(() => { fetchOrders(1) }, [])

  // ── Apply filters — commit to refs then fetch page 1 ──
  const handleApplyFilters = () => {
    appliedSearchRef.current = searchTerm
    appliedStatusRef.current = statusFilter
    appliedDateRangeRef.current = { ...dateRange }
    fetchOrders(1)
  }

  // ── Reset filters ──
  const handleResetFilters = () => {
    setSearchTerm("")
    setStatusFilter("all")
    setDateRange({ from: "", to: "" })
    appliedSearchRef.current = ""
    appliedStatusRef.current = "all"
    appliedDateRangeRef.current = { from: "", to: "" }
    fetchOrders(1)
  }

  // ── Colours ──
  const getStatusColor = (s) => ({
    Complete: "text-success", Completed: "text-success",
    Processing: "text-warning", Pending: "text-danger",
    Cancelled: "text-light bg-dark", Failed: "text-danger"
  }[s] || "text-dark")

  const getPaymentColor = (s) => s === true ? "text-success" : s === "Pending" ? "text-warning" : s === "Failed" ? "text-danger" : "text-dark"

  // ── Pagination numbers ──
  const renderPageNumbers = () => {
    const pages = []
    const max = 5
    if (totalPages <= max) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      const l = Math.max(1, currentPage - 2)
      const r = Math.min(totalPages, currentPage + 2)
      if (l > 1) { pages.push(1); if (l > 2) pages.push("...") }
      for (let i = l; i <= r; i++) pages.push(i)
      if (r < totalPages) { if (r < totalPages - 1) pages.push("..."); pages.push(totalPages) }
    }
    return pages.map((p, i) =>
      p === "..." ? <span key={i} style={{ padding: "0 5px", color: "#777" }}>…</span> : (
        <button key={i}
          onClick={() => { setCurrentPage(p); fetchOrders(p); }}
          style={{ border: "none", padding: "6px 10px", borderRadius: 6, cursor: "pointer", fontWeight: currentPage === p ? 700 : 400, background: currentPage === p ? "#0a2499" : "transparent", color: currentPage === p ? "#fff" : "inherit", transition: ".2s" }}
        >{p}</button>
      )
    )
  }

  return (
    <>
      <motion.div
        className="orders-management"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
      >
        {/* Page header */}
        <div className="page-header">
          <div className="header-left">
            <h1>Orders Management</h1>
            <p>Manage and track all your customer print orders</p>
          </div>
        </div>

        {/* Filters */}
        <motion.div className="filters-container" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="search-box">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search orders or customers..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleApplyFilters()}
            />
          </div>

          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="filter-select">
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in process">In Process</option>
            <option value="complete">Completed</option>
          </select>

          <div className="date-range">
            <Calendar size={16} />
            <input type="date" value={dateRange.from} onChange={e => setDateRange({ ...dateRange, from: e.target.value })} />
            <span>to</span>
            <input type="date" value={dateRange.to} onChange={e => setDateRange({ ...dateRange, to: e.target.value })} />
          </div>

          <button onClick={handleApplyFilters} className="btn-primary">Apply Filters</button>
          <button onClick={handleResetFilters} className="btn-secondary" style={{ whiteSpace: "nowrap" }}>Reset</button>
        </motion.div>

        {/* Table */}
        <motion.div className="orders-table-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <div className="table-header">
            <h3>Orders ({orders.length}{totalPages > 1 ? `  — page ${currentPage} of ${totalPages}` : ""})</h3>
            <div className="table-actions">
              <button className="btn-icon" onClick={() => fetchOrders(currentPage)} title="Refresh"><RefreshCw size={16} /></button>
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "40px 0", color: "#9ca3af" }}>
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} style={{ width: 28, height: 28, border: "3px solid #e5e7eb", borderTopColor: "#6366f1", borderRadius: "50%", margin: "0 auto 12px" }} />
              Loading orders...
            </div>
          ) : (
            <div className="table-responsive">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Pages</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {orders.length > 0 ? orders.map((order, i) => (
                      <motion.tr
                        key={order.id || order.OrderId}
                        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.25, delay: i * 0.04 }}
                      >
                        <td className="order-id">{order.OrderId}</td>
                        <td>{order.CustomerName || "N/A"}</td>
                        <td>{order.Created_at ? new Date(order.Created_at).toLocaleString() : "—"}</td>
                        <td>{order.NoOfPages || "—"}</td>
                        <td className={getPaymentColor(order.PaymentStatus)}>₹{order.PaymentAmount || 0}</td>
                        <td><span className={`status ${getStatusColor(order.PrintStatus)}`}>{order.PrintStatus || "N/A"}</span></td>
                        <td>
                          <div className="action-buttons flex gap-2">
                            {/* Eye → FileViewerPopup */}

                            {/* Eye → FileViewerPopup */}
                            <div style={{ position: "relative", display: "inline-flex" }}>
                              <motion.button
                                className="btn-icon" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                                title="View Files" onClick={() => setViewerOrder(order)}
                              >
                                <Eye size={16} />
                              </motion.button>
                              {(() => {
                                // Count files from FileUpload JSON
                                try {
                                  const parsed = JSON.parse(order.FileUpload || "")
                                  if (typeof parsed === "object" && !Array.isArray(parsed)) {
                                    const count = Object.keys(parsed).length
                                    if (count > 1) return (
                                      <span style={{ position: "absolute", top: -5, right: -5, width: 16, height: 16, borderRadius: "50%", background: "#3b82f6", color: "#fff", fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
                                        {count}
                                      </span>
                                    )
                                  }
                                } catch { }
                                return null
                              })()}
                            </div>



                            {/* Info → OrderDetailPopup */}
                            <motion.button
                              className="btn-icon" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                              title="Order Details" onClick={() => setDetailOrder(order)}
                              style={{ color: "#6366f1" }}
                            >
                              <Info size={16} />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    )) : (
                      <tr><td colSpan="7" style={{ textAlign: "center", padding: "2rem", color: "#9ca3af" }}>No orders found.</td></tr>
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 16 }}>
            <button className="btn-icon" disabled={currentPage === 1} onClick={() => fetchOrders(currentPage - 1)}><ChevronLeft size={16} /></button>
            {renderPageNumbers()}
            <button className="btn-icon" disabled={currentPage === totalPages} onClick={() => fetchOrders(currentPage + 1)}><ChevronRight size={16} /></button>
          </div>
        </motion.div>
      </motion.div>

      {/* Popups */}
      <AnimatePresence>
        {viewerOrder && <FileViewerPopup order={viewerOrder} onClose={() => setViewerOrder(null)} />}
      </AnimatePresence>
      <AnimatePresence>
        {detailOrder && <OrderDetailPopup order={detailOrder} onClose={() => setDetailOrder(null)} />}
      </AnimatePresence>
    </>
  )
}

export default OrdersManagement