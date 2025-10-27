"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  Filter,
  Download,
  Plus,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

import { get_dashboard, fetchOrdersAPI } from "./api/endpoints";
// ✅ Axios setup
axios.defaults.baseURL = "http://127.0.0.1:8000/api/"
axios.defaults.withCredentials = true

const OrdersManagement = () => {
  const [orders, setOrders] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateRange, setDateRange] = useState({ from: "", to: "" })
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [loading, setLoading] = useState(false)
  const [totalPages, setTotalPages] = useState(1)

  // 🔄 Fetch orders from Django
  const fetchOrders = async () => {
    setLoading(true)
    try {
      // const res = await axios.get("filter-orders/", {
      //   params: {
      //     search: searchTerm,
      //     status: statusFilter,
      //     from: dateRange.from,
      //     to: dateRange.to,
      //     page: currentPage,
      //     per_page: itemsPerPage,
      //   },
      // })
      const data = await fetchOrdersAPI(searchTerm, statusFilter, dateRange.from, dateRange.to, currentPage, itemsPerPage);
      setOrders(data.orders || [])
      setTotalPages(data.total_pages || 1)
    } catch (error) {
      console.error("Error fetching orders:", error)
      if (error.response?.status === 401) {
        alert("Session expired. Please login again.")
        window.location.href = "/login"
      }
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchOrders()
  }, [searchTerm, statusFilter, dateRange, currentPage])

  // 🎨 Helper functions for UI colors
  const getStatusColor = (status) => {
    switch (status) {
      case "Complete": return "text-success"
      case "Processing": return "text-warning"
      case "Pending": return "text-danger"
      case "Cancelled": return "text-light bg-dark"
      default: return "text-dark"
    }
  }
  // 🎨 Helper function for payment status colors
  const getPaymentStatusColor = (status) => {
    // console.log("Getting color for payment status:", status)
    switch (status) {
      case true: return "text-success"
      case "Pending": return "text-warning"
      case "Failed": return "text-danger"
      default: return "text-dark"
    }
  }

  // 📑 Pagination Renderer
  const renderPageNumbers = () => {
    const pageNumbers = []
    const maxPagesToShow = 5

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) pageNumbers.push(i)
    } else {
      const left = Math.max(1, currentPage - 2)
      const right = Math.min(totalPages, currentPage + 2)

      if (left > 1) {
        pageNumbers.push(1)
        if (left > 2) pageNumbers.push("...")
      }

      for (let i = left; i <= right; i++) pageNumbers.push(i)

      if (right < totalPages) {
        if (right < totalPages - 1) pageNumbers.push("...")
        pageNumbers.push(totalPages)
      }
    }

    return pageNumbers.map((num, index) =>
      num === "..." ? (
        <span key={index} className="dots">…</span>
      ) : (
        <button
          key={index}
          className={`btn-page ${currentPage === num ? "active" : ""}`}
          onClick={() => setCurrentPage(num)}
        >
          {num}
        </button>
      )
    )
  }

  const downloadFile = (url, filename) => {
    fetch(url, {
      method: "GET",
      headers: {
        // Add auth headers if needed
      },
    })
      .then((res) => res.blob())
      .then((blob) => {
        const link = document.createElement("a")
        link.href = window.URL.createObjectURL(blob)
        link.download = filename
        link.click()
      })
      .catch((err) => console.error(err))
  }


  return (
    <motion.div
      className="orders-management"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <style>
        {`
          .pagination {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          margin-top: 1rem;
        }

        .btn-page {
          border: none;
          background: transparent;
          padding: 6px 10px;
          border-radius: 6px;
          cursor: pointer;
          transition: 0.2s;
        }

        .btn-page:hover {
          background-color: rgba(0, 0, 0, 0.05);
        }

        .btn-page.active {
          background-color: #0a2499;
          color: white;
          font-weight: bold;
        }

        .dots {
          padding: 0 5px;
          color: #777;
        }

        `}
      </style>
      <div className="page-header">
        <div className="header-left">
          <h1>Orders Management</h1>
          <p>Manage and track all your customer print orders</p>
        </div>
        <div className="header-actions">
          <motion.button className="btn-secondary" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Download size={16} /> Export
          </motion.button>
          <motion.button className="btn-primary" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Plus size={16} /> New Order
          </motion.button>
        </div>
      </div>

      {/* 🔍 Filters */}
      <motion.div
        className="filters-container"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="search-box">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search orders or customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="filter-select">
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="in process">In Process</option>
          <option value="complete">Completed</option>
        </select>

        <div className="date-range">
          <Calendar size={16} />
          <input
            type="date"
            value={dateRange.from}
            onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
          />
          <span>to</span>
          <input
            type="date"
            value={dateRange.to}
            onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
          />
        </div>

        <button onClick={fetchOrders} className="btn-primary">
          Apply Filters
        </button>
      </motion.div>

      {/* 📋 Orders Table */}
      <motion.div
        className="orders-table-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="table-header">
          <h3>Orders ({orders.length})</h3>
          <div className="table-actions">
            <button className="btn-icon"><Filter size={16} /></button>
            <button className="btn-icon"><MoreHorizontal size={16} /></button>
          </div>
        </div>

        {loading ? (
          <p style={{ textAlign: "center", margin: "2rem" }}>Loading orders...</p>
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
                  {orders.length > 0 ? (
                    orders.map((order, index) => (
                      <motion.tr
                        key={order.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        whileHover={{ backgroundColor: "rgba(10, 36, 99, 0.02)" }}
                      >
                        <td className="order-id">{order.OrderId}</td>
                        <td>{order.CustomerName || "N/A"}</td>
                        <td>{new Date(order.Created_at).toLocaleString()}</td>
                        <td className="text-dark">{order.NoOfPages || "—"}</td>
                        <td className={`amount ${getPaymentStatusColor(order.PaymentStatus)}`}>
                          ₹{order.PaymentAmount || 0}
                        </td>
                        <td>
                          <span className={`status ${getStatusColor(order.PrintStatus)}`}>
                            {order.PrintStatus || "N/A"}
                          </span>
                        </td>
                        {/* <td>
                          <div className="action-buttons">
                            <motion.button className="btn-icon" whileHover={{ scale: 1.1 }} title="View">
                              <Eye size={16} />
                            </motion.button>
                            <motion.button className="btn-icon" whileHover={{ scale: 1.1 }} title="Edit">
                              <Edit size={16} />
                            </motion.button>
                            <motion.button className="btn-icon danger" whileHover={{ scale: 1.1 }} title="Delete">
                              <Trash2 size={16} />
                            </motion.button>
                          </div>
                        </td> */}
                        <td>
                          <div className="action-buttons flex gap-2">
                            {/* 👁 View File */}
                            {order.FileUpload && (
                              <motion.a
                                href={order.FileUpload}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-icon"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                title="View File"
                              >
                                <Eye size={16} />
                              </motion.a>
                            )}

                            {/* ⬇ Download File */}
                            {order.FileUpload && (
                              // <motion.a
                              //   href={`http://127.0.0.1:8000${order.FileUpload}`}
                              //   download
                              //   className="btn-icon"
                              //   whileHover={{ scale: 1.1 }}
                              //   whileTap={{ scale: 0.9 }}
                              //   title="Download File"
                              //   target="_blank"
                              // >
                              //   <Download size={16} />
                              // </motion.a>
                              <motion.button
                                className="btn-icon"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => downloadFile(order.FileUpload, "file.pdf")}
                                title="Download File"
                              >
                                <Download size={16} />
                              </motion.button>

                            )}

                            {/* 🖨 Print
                            <motion.button
                              className="btn-icon"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              title="Print Order"
                              // onClick={() => handlePrint(order.file_url, order.id, order.color_mode || "Color")}
                            >
                              <Printer size={16} />
                            </motion.button> */}

                            <motion.button
                              className="btn-icon"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              title="More Actions"
                            >
                              <MoreHorizontal size={16} />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" style={{ textAlign: "center", padding: "1rem" }}>No orders found.</td>
                    </tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}

        {/* ✅ Pagination */}
        <div className="pagination">
          <button
            className="btn-icon"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            <ChevronLeft size={16} />
          </button>

          {renderPageNumbers()}

          <button
            className="btn-icon"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            <ChevronRight size={16} />
          </button>
        </div>


        {/* <div className="pagination">
          <button className="btn-icon" disabled={currentPage === 1}>
            <ChevronLeft size={16} />
          </button>
          <div className="page-numbers">
            {[1, 2, 3, 4, 5].map((page) => (
              <button
                key={page}
                className={`page-number ${currentPage === page ? "active" : ""}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
          </div>
          <button className="btn-icon" disabled={currentPage === 5}>
            <ChevronRight size={16} />
          </button>
        </div> */}
      </motion.div>
    </motion.div>
  )
}

export default OrdersManagement
