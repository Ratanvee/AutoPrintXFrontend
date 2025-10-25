"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Eye, Printer, MoreHorizontal, Search, Download } from "lucide-react"
import { recentOrders } from "./api/endpoints"
import { printDocument } from "./api/printerAgentapi"
import { getSelectedPrinter } from "../../global"
import { c } from "framer-motion/dist/types.d-Cjd591yU"

const RecentOrders = ({ selectedPrinter }) => {
  const [orders, setOrders] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [loading, setLoading] = useState(true)
  const [autoPrint, setAutoPrint] = useState(false) // ✅ Auto Print toggle
  const [autoPrintedOrders, setAutoPrintedOrders] = useState([]) // track printed orders

  // ✅ Fetch recent orders
  useEffect(() => {
    const fetchRecentOrders = async () => {
      try {
        const data = await recentOrders()
        if (data && data.orders) {
          setOrders(data.orders.slice(0, 10))
        } else {
          setOrders([])
        }
      } catch (err) {
        console.error("Error fetching recent orders:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchRecentOrders()
  }, [])

  // ✅ Auto Print effect
  useEffect(() => {
    if (autoPrint) {
      const printerName = getSelectedPrinter()
      if (!printerName) {
        alert("⚠️ Please select a printer first.")
        setAutoPrint(false)
        return
      }
      console.log("these are oreder : ", orders)

      // Filter first 5 pending orders that have not been auto-printed yet
      const pendingOrders = orders
        .filter((order) => order.status === "pending" && !autoPrintedOrders.includes(order.id))
        .slice(0, 5)

      pendingOrders.forEach(async (order) => {
        console.log("Auto printing order:", order)
        try {
          const response = await printDocument(order.file_url, order.id, printerName, order.print_color)
          console.log("Auto print response:", response)
          // handlePrint(order.file_url, order.id, order.print_color)
          if (response.message) {
            console.log(`✅ Auto Printed: Order ID ${order.id}`)
            setAutoPrintedOrders((prev) => [...prev, order.id])
          } else {
            console.error(`❌ Auto Print failed: Order ID ${order.id}`)
          }
        } catch (err) {
          console.error("Error auto printing order:", err)
        }
      })
    }
  }, [autoPrint, orders, autoPrintedOrders])

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status) => {
    // console.log("Getting color for status:", status)
    switch (status) {
      case "Complete": return "text-success"
      case "Processing": return "text-warning"
      case "Pending": return "text-danger"
      case "Cancelled": return "text-light bg-dark"
      default: return "text-dark"
    }
  }

  const getPaymentStatusColor = (status) => {
    // console.log("Getting color for payment status:", status)
    switch (status) {
      case true: return "text-success"
      case "Pending": return "text-warning"
      case "Failed": return "text-danger"
      default: return "text-dark"
    }
  }

  const handlePrint = async (fileUrl, order_id, printColor) => {
    const printerName = getSelectedPrinter()
    if (!printerName) {
      alert("⚠️ Please select a printer first.")
      return
    }
    const response = await printDocument(fileUrl, order_id, printerName, printColor)
    if (response.message) {
      alert(`✅ Printed successfully on ${printerName}, Order ID: ${order_id}`)
    } else {
      alert(`❌ Print failed: ${response.error}`)
    }
  }

  const downloadFile = (url, filename) => {
    fetch(url)
      .then((res) => res.blob())
      .then((blob) => {
        const link = document.createElement("a")
        link.href = window.URL.createObjectURL(blob)
        link.download = filename
        link.click()
      })
      .catch((err) => console.error(err))
  }

  if (loading) return <p>Loading recent orders...</p>

  return (
    <motion.div
      className="recent-orders"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="section-header flex justify-between items-center">
        <div>
          <h3>Recent Orders</h3>
        </div>
        <p>{filteredOrders.length} orders found</p>
        <div>
          <label className="switch">
            <input type="checkbox" checked={autoPrint} onChange={(e) => setAutoPrint(e.target.checked)} />
            <span className="slider round"></span>
          </label>
          <span style={{ marginLeft: "8px" }}>Auto Print First 5 Pending</span>
        </div>
        <div className="flex items-center gap-4">
          {/* Auto Print Switch */}
          {/* <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={autoPrint}
              onChange={(e) => setAutoPrint(e.target.checked)}
            />
            <span>Auto Print First 5 Pending</span>
          </label> */}

          <div className="orders-actions flex items-center gap-2">
            <div className="search-box">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="status-filter"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="processing">Processing</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {filteredOrders.map((order, index) => (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ backgroundColor: "rgba(10, 36, 99, 0.02)" }}
                >
                  <td className="order-id">{order.id}</td>
                  <td className="order-customer">{order.customer}</td>
                  <td className="order-date">{order.date}</td>
                  <td className={`${getPaymentStatusColor(order.payment_status)}`}>{order.amount}</td>
                  <td>
                    <motion.span className={`${getStatusColor(order.status)} status`}>
                      {order.status}
                    </motion.span>
                  </td>
                  <td className="flex gap-2">
                    {order.file_url && (
                      <motion.a
                        href={order.file_url}
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

                    {order.file_url && (
                      <motion.button
                        className="btn-icon"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => downloadFile(order.file_url, "file.pdf")}
                        title="Download File"
                      >
                        <Download size={16} />
                      </motion.button>
                    )}

                    <motion.button
                      className="btn-icon"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="Print Order"
                      onClick={() => handlePrint(order.file_url, order.id, order.print_color)}
                    >
                      <Printer size={16} />
                    </motion.button>

                    <motion.button
                      className="btn-icon"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="More Actions"
                    >
                      <MoreHorizontal size={16} />
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}

export default RecentOrders
