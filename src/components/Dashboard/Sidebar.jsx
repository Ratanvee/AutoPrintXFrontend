"use client"
import { Link, useLocation } from "react-router-dom"
import { motion } from "framer-motion"
import { BarChart3, ShoppingCart, Users, Package, FileText, Settings, LogOut } from "lucide-react"
import { get_dashboard, logout } from "./api/endpoints";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
const Sidebar = ({ collapsed, activeSection, setActiveSection, dashboardData }) => {
  const location = useLocation()
  const navigate = useNavigate();

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3, path: "/dashboard" },
    { id: "orders", label: "Orders", icon: ShoppingCart, path: "/dashboard/orders" },
    { id: "customers", label: "Customers", icon: Users, path: "/dashboard/customers" },
    { id: "products", label: "Products", icon: Package, path: "/dashboard/products" },
    { id: "reports", label: "Reports", icon: FileText, path: "/dashboard/reports" },
    { id: "settings", label: "Settings", icon: Settings, path: "/dashboard/settings" },
  ]

  const handleLogout = () => {
    logout();
    // navigate("/login");
  };


  return (
    <motion.aside
      className={`sidebar ${collapsed ? "collapsed" : ""}`}
      initial={false}
      animate={{ width: collapsed ? "80px" : "250px" }}
      transition={{ duration: 0.3 }}
    >
      <div className="sidebar-header">
        <motion.img initial={false} animate={{ opacity: collapsed ? 1 : 1 }} transition={{ duration: 0.2 }} src="/logo12.png" alt="Logo" />
        <motion.h2 initial={false} animate={{ opacity: collapsed ? 0 : 1 }} transition={{ duration: 0.2 }}>
          Auto<span>PrintX</span>
          {/* {dashboardData && (
            <pre>{JSON.stringify(dashboardData, null, 2)}</pre>
          )} */}
        </motion.h2>
      </div>

      <div className="sidebar-user">
        <img src={dashboardData && dashboardData.user ? dashboardData.user.shop_image : "https://placehold.co/100x100/0a2463/white?text=A"} alt="" onError={(e) => {
          e.target.onerror = null
          e.target.src = `https://placehold.co/120x120/4f46e5/ffffff?text=U`
        }} />
        <motion.div initial={false} animate={{ opacity: collapsed ? 0 : 1 }} transition={{ duration: 0.2 }}>
          <h4>{dashboardData && dashboardData.user ? dashboardData.user.owner_name : "Loading..."}</h4>
          <p>{dashboardData && dashboardData.user ? dashboardData.user.username : "Loading..."}</p>
        </motion.div>
      </div>

      <nav className="sidebar-nav">
        <ul>
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path

            return (
              <motion.li
                key={item.id}
                className={isActive ? "active" : ""}
                whileHover={{ x: collapsed ? 0 : 5 }}
                transition={{ duration: 0.2 }}
              >
                <Link to={item.path} onClick={() => setActiveSection(item.id)} title={collapsed ? item.label : ""}>
                  <Icon size={20} />
                  <motion.span initial={false} animate={{ opacity: collapsed ? 0 : 1 }} transition={{ duration: 0.2 }}>
                    {item.label}
                  </motion.span>
                </Link>
              </motion.li>
            )
          })}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <Link id="logout" to={"/login"} onClick={handleLogout} title={collapsed ? "Logout" : ""}>
          <LogOut size={20} />
          <motion.span initial={false} animate={{ opacity: collapsed ? 0 : 1 }} transition={{ duration: 0.2 }}>
            Logout
          </motion.span>
        </Link>
        
      </div>
    </motion.aside>
  )
}

export default Sidebar
