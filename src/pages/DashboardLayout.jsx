// "use client"

// import { useState } from "react"
// import { Routes, Route } from "react-router-dom"
// import { motion, AnimatePresence } from "framer-motion"
// import Sidebar from "../components/Dashboard/Sidebar"
// import DashboardHeader from "../components/Dashboard/DashboardHeader"
// import DashboardOverview from "../components/Dashboard/DashboardOverview"
// import OrdersManagement from "../components/Dashboard/OrdersManagement"
// import CustomersManagement from "../components/Dashboard/CustomersManagement"
// import ProductsManagement from "../components/Dashboard/ProductsManagement"
// import ReportsSection from "../components/Dashboard/ReportsSection"
// import SettingsSection from "../components/Dashboard/SettingsSection"
// import NotificationsPanel from "../components/Dashboard/NotificationsPanel"
// import '../styles/dashboard/dashboard.css';
// import { get_dashboard, logout } from "../components/Dashboard/api/endpoints";
// import { setQRData } from "../global";

// // Updated import path for dashboard styles
// // import { is_authenticated } from "../api/endpoints";
// import { useEffect } from "react";
// const Dashboard = () => {
//   const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
//   const [activeSection, setActiveSection] = useState("dashboard")
//   const [showNotifications, setShowNotifications] = useState(false)
//   const [notifications, setNotifications] = useState([
//     { id: 1, type: "order", message: "New order #ORD-0025 received", time: "2 min ago", read: false },
//     { id: 2, type: "payment", message: "Payment confirmed for order #ORD-0024", time: "5 min ago", read: false },
//     { id: 3, type: "delivery", message: "Order #ORD-0023 delivered successfully", time: "1 hour ago", read: true },
//     { id: 4, type: "customer", message: "New customer registration: Sarah Johnson", time: "2 hours ago", read: true },
//     { id: 5, type: "system", message: "System maintenance scheduled for tonight", time: "1 day ago", read: true },
//   ])

//   const toggleSidebar = () => {
//     setSidebarCollapsed(!sidebarCollapsed)
//   }

//   const markNotificationAsRead = (id) => {
//     setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
//   }

//   const unreadCount = notifications.filter((n) => !n.read).length

//   const [dashboardData, setDashboardData] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       const data = await get_dashboard();
//       setDashboardData(data);
//       setQRData(data.user);
//       document.title = 'AutoPrintX | Dashboard';
//       // console.log("this is check modfied or not : ", data.user)
//       if (!data.user.is_modified) {
//         toast.error("Please Update your info First !!")
//         // < Navigate to = "/target-page"/>
//         navigate('/dashboard/settings');
//       }
//     };

//     fetchData();
//   }, [get_dashboard]);
//   //   fetchData();
//   // }, [get_dashboard]);

//   return (
//     <div className="dashboard-container">
//       <Sidebar collapsed={sidebarCollapsed} activeSection={activeSection} setActiveSection={setActiveSection} dashboardData={dashboardData} />

//       <main className={`dashboard-main ${sidebarCollapsed ? "expanded" : ""}`}>
//         <DashboardHeader
//           toggleSidebar={toggleSidebar}
//           showNotifications={showNotifications}
//           setShowNotifications={setShowNotifications}
//           unreadCount={unreadCount}
//           dashboardData={dashboardData}
//         />

//         <AnimatePresence>
//           {showNotifications && (
//             <NotificationsPanel
//               notifications={notifications}
//               onClose={() => setShowNotifications(false)}
//               onMarkAsRead={markNotificationAsRead}
//             />
//           )}
//         </AnimatePresence>

//         <motion.div
//           className="dashboard-content"
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.3 }}
//         >
//           <Routes>
//             <Route path="/" element={<DashboardOverview />} />
//             <Route path="/orders" element={<OrdersManagement />} />
//             <Route path="/customers" element={<CustomersManagement />} />
//             <Route path="/products" element={<ProductsManagement />} />
//             <Route path="/reports" element={<ReportsSection />} />
//             <Route path="/settings/*" element={<SettingsSection />} />
//           </Routes>
//         </motion.div>
//       </main>
//     </div>
//   )
// }

// export default Dashboard


"use client"

import { useState, useEffect } from "react"
import { Routes, Route, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { useQuery } from "@tanstack/react-query"
import { toast } from "react-hot-toast"
import Sidebar from "../components/Dashboard/Sidebar"
import DashboardHeader from "../components/Dashboard/DashboardHeader"
import DashboardOverview from "../components/Dashboard/DashboardOverview"
import OrdersManagement from "../components/Dashboard/OrdersManagement"
import CustomersManagement from "../components/Dashboard/CustomersManagement"
import ProductsManagement from "../components/Dashboard/ProductsManagement"
import ReportsSection from "../components/Dashboard/ReportsSection"
import SettingsSection from "../components/Dashboard/SettingsSection"
import NotificationsPanel from "../components/Dashboard/NotificationsPanel"
import '../styles/dashboard/dashboard.css'
import { get_dashboard, recentActivity } from "../components/Dashboard/api/endpoints"
import { setQRData } from "../global"

const Dashboard = () => {
  const navigate = useNavigate()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeSection, setActiveSection] = useState("dashboard")
  const [showNotifications, setShowNotifications] = useState(false)
  const [dashboardData, setDashboardData] = useState(null)

  // ✅ Fetch ALL recent activities (no limit to get all activities)
  const {
    data: activitiesData,
    isLoading: activitiesLoading,
    isError: activitiesError,
    refetch: refetchActivities
  } = useQuery({
    queryKey: ['recentActivities'],
    queryFn: async () => {
      // Call without limit or with a very high limit to get all activities
      const data = await recentActivity() // Remove limit or pass null
      return data
    },
    refetchInterval: 30000, // Refetch every 30 seconds
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    staleTime: 10000, // Data fresh for 10 seconds
    placeholderData: (previousData) => previousData, // Keep old data while fetching
    onError: (error) => {
      console.error('Error fetching activities:', error)
    }
  })

  // Extract activities array from response
  const recentActivities = activitiesData?.activities || []

  // Calculate unread count
  const unreadCount = recentActivities.length

  useEffect(() => {
    const fetchData = async () => {
      const data = await get_dashboard()
      setDashboardData(data)
      setQRData(data.user)
      document.title = 'AutoPrintX | Dashboard'

      if (!data.user.is_modified) {
        toast.error("Please Update your info First !!")
        navigate('/dashboard/settings')
      }
    }

    fetchData()
  }, [navigate])

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  const handleToggleNotifications = () => {
    setShowNotifications(prev => !prev)
    // Refetch when opening notifications to get latest data
    if (!showNotifications) {
      refetchActivities()
    }
  }

  return (
    <div className="dashboard-container">
      <Sidebar
        collapsed={sidebarCollapsed}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        dashboardData={dashboardData}
      />

      <main className={`dashboard-main ${sidebarCollapsed ? "expanded" : ""}`}>
        <DashboardHeader
          toggleSidebar={toggleSidebar}
          showNotifications={showNotifications}
          setShowNotifications={handleToggleNotifications}
          unreadCount={unreadCount}
          dashboardData={dashboardData}
        />

        <AnimatePresence>
          {showNotifications && (
            <NotificationsPanel
              activities={recentActivities}
              onClose={() => setShowNotifications(false)}
              isLoading={activitiesLoading}
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
            <Route path="/" element={<DashboardOverview recentActivities={recentActivities} showNotifications={showNotifications} setShowNotifications={handleToggleNotifications} />} />
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