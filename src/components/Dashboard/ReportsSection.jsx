"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Download, Calendar, DollarSign, ShoppingCart, Users, Printer, Filter, RefreshCw } from "lucide-react"
import InteractiveChart from "./InteractiveChart"

const ReportsSection = () => {
  const [dateRange, setDateRange] = useState("30d")
  const [reportType, setReportType] = useState("revenue")

  const revenueData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Revenue",
        data: [12000, 19000, 15000, 25000, 22000, 30000],
        borderColor: "#0a2463",
        backgroundColor: "rgba(10, 36, 99, 0.1)",
        tension: 0.4,
      },
    ],
  }

  const ordersData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Orders",
        data: [120, 190, 150, 250, 220, 300],
        backgroundColor: "#2176ff",
      },
    ],
  }

  const customersData = {
    labels: ["New", "Returning", "VIP"],
    datasets: [
      {
        data: [45, 35, 20],
        backgroundColor: ["#0a2463", "#2176ff", "#3e92cc"],
      },
    ],
  }

  return (
    <motion.div
      className="reports-section"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="page-header">
        <div className="header-left">
          <h1>Reports & Analytics</h1>
          <p>Track your business performance and insights</p>
        </div>
        <div className="header-actions">
          <div className="date-range-selector">
            <Calendar size={16} />
            <select value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
          </div>
          <motion.button className="btn-secondary" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <RefreshCw size={16} />
            Refresh
          </motion.button>
          <motion.button className="btn-primary" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Download size={16} />
            Export Report
          </motion.button>
        </div>
      </div>

      {/* Key Metrics */}
      <motion.div
        className="metrics-grid"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="metric-card">
          <div className="metric-icon revenue">
            <DollarSign size={24} />
          </div>
          <div className="metric-info">
            <h3>Total Revenue</h3>
            <p className="metric-value">$24,512</p>
            <span className="metric-change positive">+18% vs last period</span>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon orders">
            <ShoppingCart size={24} />
          </div>
          <div className="metric-info">
            <h3>Total Orders</h3>
            <p className="metric-value">1,254</p>
            <span className="metric-change positive">+15% vs last period</span>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon customers">
            <Users size={24} />
          </div>
          <div className="metric-info">
            <h3>New Customers</h3>
            <p className="metric-value">156</p>
            <span className="metric-change positive">+22% vs last period</span>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon pages">
            <Printer size={24} />
          </div>
          <div className="metric-info">
            <h3>Pages Printed</h3>
            <p className="metric-value">45,678</p>
            <span className="metric-change positive">+12% vs last period</span>
          </div>
        </div>
      </motion.div>

      {/* Charts Section */}
      <div className="charts-grid">
        <motion.div
          className="chart-container large"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="chart-header">
            <h3>Revenue Trend</h3>
            <div className="chart-controls">
              <select value={reportType} onChange={(e) => setReportType(e.target.value)}>
                <option value="revenue">Revenue</option>
                <option value="orders">Orders</option>
                <option value="customers">Customers</option>
              </select>
              <button className="btn-icon">
                <Filter size={16} />
              </button>
            </div>
          </div>
          <InteractiveChart data={reportType === "revenue" ? revenueData : ordersData} type="line" height={350} />
        </motion.div>

        <motion.div
          className="chart-container"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="chart-header">
            <h3>Customer Distribution</h3>
          </div>
          <InteractiveChart data={customersData} type="doughnut" height={300} />
        </motion.div>

        <motion.div
          className="chart-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="chart-header">
            <h3>Monthly Orders</h3>
          </div>
          <InteractiveChart data={ordersData} type="bar" height={300} />
        </motion.div>

        <motion.div
          className="performance-summary"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3>Performance Summary</h3>
          <div className="summary-items">
            <div className="summary-item">
              <span className="label">Average Order Value</span>
              <span className="value">$19.54</span>
              <span className="change positive">+8%</span>
            </div>
            <div className="summary-item">
              <span className="label">Customer Retention</span>
              <span className="value">68%</span>
              <span className="change positive">+5%</span>
            </div>
            <div className="summary-item">
              <span className="label">Order Completion Rate</span>
              <span className="value">94%</span>
              <span className="change positive">+2%</span>
            </div>
            <div className="summary-item">
              <span className="label">Revenue Growth</span>
              <span className="value">18%</span>
              <span className="change positive">+3%</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Top Products */}
      <motion.div
        className="top-products"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="section-header">
          <h3>Top Performing Products</h3>
          <button className="view-all">View All</button>
        </div>
        <div className="products-list">
          {[
            { name: "Black & White Printing", sales: 1250, revenue: "$125.00", growth: "+15%" },
            { name: "Color Printing Premium", sales: 890, revenue: "$222.50", growth: "+22%" },
            { name: "Spiral Binding Service", sales: 156, revenue: "$546.00", growth: "+8%" },
            { name: "Express Delivery", sales: 234, revenue: "$1,170.00", growth: "+35%" },
          ].map((product, index) => (
            <motion.div key={index} className="product-item" whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
              <div className="product-info">
                <h4>{product.name}</h4>
                <p>{product.sales} sales</p>
              </div>
              <div className="product-metrics">
                <span className="revenue">{product.revenue}</span>
                <span className="growth positive">{product.growth}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ReportsSection
