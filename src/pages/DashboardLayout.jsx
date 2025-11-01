"use client"

import { useState } from "react"
import { Routes, Route } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import Sidebar from "../components/Dashboard/Sidebar"
import DashboardHeader from "../components/Dashboard/DashboardHeader"
import DashboardOverview from "../components/Dashboard/DashboardOverview"
import OrdersManagement from "../components/Dashboard/OrdersManagement"
import CustomersManagement from "../components/Dashboard/CustomersManagement"
import ProductsManagement from "../components/Dashboard/ProductsManagement"
import ReportsSection from "../components/Dashboard/ReportsSection"
import SettingsSection from "../components/Dashboard/SettingsSection"
import NotificationsPanel from "../components/Dashboard/NotificationsPanel"
import '../styles/dashboard/dashboard.css';
// Updated import path for dashboard styles
// import { is_authenticated } from "../api/endpoints";
import { useEffect } from "react";
const Dashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeSection, setActiveSection] = useState("dashboard")
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState([
    { id: 1, type: "order", message: "New order #ORD-0025 received", time: "2 min ago", read: false },
    { id: 2, type: "payment", message: "Payment confirmed for order #ORD-0024", time: "5 min ago", read: false },
    { id: 3, type: "delivery", message: "Order #ORD-0023 delivered successfully", time: "1 hour ago", read: true },
    { id: 4, type: "customer", message: "New customer registration: Sarah Johnson", time: "2 hours ago", read: true },
    { id: 5, type: "system", message: "System maintenance scheduled for tonight", time: "1 day ago", read: true },
  ])

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  const markNotificationAsRead = (id) => {
    setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  // const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    // const fetchData = async () => {
    //   const data = await get_dashboard();
    //   setDashboardData(data);
    document.title = 'AutoPrintX | Dashboard';
    // console.log("this is base url : ", import.meta.env.VITE_BaseURL)
  });

  //   fetchData();
  // }, [get_dashboard]);

  return (
    <div className="dashboard-container">
      <Sidebar collapsed={sidebarCollapsed} activeSection={activeSection} setActiveSection={setActiveSection} />

      <main className={`dashboard-main ${sidebarCollapsed ? "expanded" : ""}`}>
        <DashboardHeader
          toggleSidebar={toggleSidebar}
          showNotifications={showNotifications}
          setShowNotifications={setShowNotifications}
          unreadCount={unreadCount}
        />

        <AnimatePresence>
          {showNotifications && (
            <NotificationsPanel
              notifications={notifications}
              onClose={() => setShowNotifications(false)}
              onMarkAsRead={markNotificationAsRead}
            />
          )}
        </AnimatePresence>

        <motion.div
          className="dashboard-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Routes>
            <Route path="/" element={<DashboardOverview />} />
            <Route path="/orders" element={<OrdersManagement />} />
            <Route path="/customers" element={<CustomersManagement />} />
            <Route path="/products" element={<ProductsManagement />} />
            <Route path="/reports" element={<ReportsSection />} />
            <Route path="/settings/*" element={<SettingsSection />} />
          </Routes>
        </motion.div>
      </main>
    </div>
  )
}

export default Dashboard
