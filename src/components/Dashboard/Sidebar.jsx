"use client"
import { Link, useLocation } from "react-router-dom"
import { motion } from "framer-motion"
import { BarChart3, ShoppingCart, Users, Package, FileText, Settings, LogOut } from "lucide-react"
import { get_dashboard, logout } from "./api/endpoints";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';



const Sidebar = ({ collapsed, activeSection, setActiveSection }) => {
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


  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await get_dashboard();
      setDashboardData(data);
    };

    fetchData();
  }, [get_dashboard]);

  const handleLogout = () => {
    logout();
    // navigate("/login");
  };

  // const logout = document.getElementById("logout");
  // if (logout) {
  //   logout.addEventListener("click", handleLogout);
  //   console.log("Logout event listener added");
  // }


  return (
    <motion.aside
      className={`sidebar ${collapsed ? "collapsed" : ""}`}
      initial={false}
      animate={{ width: collapsed ? "80px" : "250px" }}
      transition={{ duration: 0.3 }}
    >
      <div className="sidebar-header">
        <motion.img initial={false} animate={{ opacity: collapsed ? 1 : 1 }} transition={{ duration: 0.2 }} src="/SmartDocXCircleLogo.png" alt="Logo" />
        <motion.h2 initial={false} animate={{ opacity: collapsed ? 0 : 1 }} transition={{ duration: 0.2 }}>
          Smart<span>DocX</span>
          {/* {dashboardData && (
            <pre>{JSON.stringify(dashboardData, null, 2)}</pre>
          )} */}
        </motion.h2>
      </div>

      <div className="sidebar-user">
        <img src="https://placehold.co/100x100/0a2463/white?text=A" alt="Admin User" />
        <motion.div initial={false} animate={{ opacity: collapsed ? 0 : 1 }} transition={{ duration: 0.2 }}>
          <h4>{dashboardData && dashboardData.user ? dashboardData.user.username : "Loading..."}</h4>
          <p>Shop Owner</p>
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
