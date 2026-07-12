// "use client"
// import { Link, useLocation } from "react-router-dom"
// import { motion } from "framer-motion"
// import { BarChart3, ShoppingCart, Users, Package, FileText, Settings, LogOut } from "lucide-react"
// import { get_dashboard, logout } from "./api/endpoints";
// import { useState, useEffect } from "react";
// import { useNavigate } from 'react-router-dom';
// const Sidebar = ({ collapsed, activeSection, setActiveSection, dashboardData }) => {
//   const location = useLocation()
//   const navigate = useNavigate();

//   const menuItems = [
//     { id: "dashboard", label: "Dashboard", icon: BarChart3, path: "/dashboard" },
//     { id: "orders", label: "Orders", icon: ShoppingCart, path: "/dashboard/orders" },
//     // { id: "customers", label: "Customers", icon: Users, path: "/dashboard/customers" },
//     { id: "products", label: "Products", icon: Package, path: "/dashboard/products" },
//     // { id: "reports", label: "Reports", icon: FileText, path: "/dashboard/reports" },
//     { id: "settings", label: "Settings", icon: Settings, path: "/dashboard/settings" },
//   ]

//   const handleLogout = () => {
//     logout();
//     // navigate("/login");
//   };


//   return (
//     <motion.aside
//       className={`sidebar ${collapsed ? "collapsed" : ""}`}
//       initial={false}
//       animate={{ width: collapsed ? "80px" : "250px" }}
//       transition={{ duration: 0.3 }}
//     >
//       <div className="sidebar-header">
//         <motion.img initial={false} animate={{ opacity: collapsed ? 1 : 1 }} transition={{ duration: 0.2 }} src="/logo12.png" alt="Logo" />
//         <motion.h2 initial={false} animate={{ opacity: collapsed ? 0 : 1 }} transition={{ duration: 0.2 }}>
//           Auto<span>PrintX</span>
//           {/* {dashboardData && (
//             <pre>{JSON.stringify(dashboardData, null, 2)}</pre>
//           )} */}
//         </motion.h2>
//       </div>

//       <div className="sidebar-user">
//         <img src={dashboardData && dashboardData.user.shop_image ? dashboardData.user.shop_image : "https://placehold.co/100x100/0a2463/white?text=A"} alt="" />
//         <motion.div initial={false} animate={{ opacity: collapsed ? 0 : 1 }} transition={{ duration: 0.2 }}>
//           <h4>{dashboardData && dashboardData.user ? dashboardData.user.owner_name : "Loading..."}</h4>
//           <p>{dashboardData && dashboardData.user ? dashboardData.user.username : "Loading..."}</p>
//         </motion.div>
//       </div>

//       <nav className="sidebar-nav">
//         <ul>
//           {menuItems.map((item) => {
//             const Icon = item.icon
//             const isActive = location.pathname === item.path

//             return (
//               <motion.li
//                 key={item.id}
//                 className={isActive ? "active" : ""}
//                 whileHover={{ x: collapsed ? 0 : 5 }}
//                 transition={{ duration: 0.2 }}
//               >
//                 <Link to={item.path} onClick={() => setActiveSection(item.id)} title={collapsed ? item.label : ""}>
//                   <Icon size={20} />
//                   <motion.span initial={false} animate={{ opacity: collapsed ? 0 : 1 }} transition={{ duration: 0.2 }}>
//                     {item.label}
//                   </motion.span>
//                 </Link>
//               </motion.li>
//             )
//           })}
//         </ul>
//       </nav>

//       <div className="sidebar-footer">
//         <Link id="logout" to={"/login"} onClick={handleLogout} title={collapsed ? "Logout" : ""}>
//           <LogOut size={20} />
//           <motion.span initial={false} animate={{ opacity: collapsed ? 0 : 1 }} transition={{ duration: 0.2 }}>
//             Logout
//           </motion.span>
//         </Link>

//       </div>
//     </motion.aside>
//   )
// }

// export default Sidebar




"use client"
import { Link, useLocation } from "react-router-dom"
import { motion } from "framer-motion"
import { BarChart3, ShoppingCart, Users, Package, FileText, Settings, LogOut } from "lucide-react"
import { logout } from "./api/endpoints"
import { useNavigate } from "react-router-dom"

// ── Shimmer (injected once) ───────────────────────────────────
if (!document.getElementById("sk-style")) {
  const el = document.createElement("style")
  el.id = "sk-style"
  el.textContent = `
    @keyframes shimmer {
      0%   { background-position: -400px 0 }
      100% { background-position:  400px 0 }
    }
    .sk {
      background: linear-gradient(90deg, #e8e8e8 25%, #d8d8d8 50%, #e8e8e8 75%);
      background-size: 400px 100%;
      animation: shimmer 1.4s infinite linear;
      border-radius: 6px;
      flex-shrink: 0;
    }
  `
  document.head.appendChild(el)
}

const Sk = ({ w = "100%", h = 12, r = 6, style = {} }) => (
  <div className="sk" style={{ width: w, height: h, borderRadius: r, ...style }} />
)

// ── Sidebar User Skeleton ─────────────────────────────────────
// matches .sidebar-user padding / avatar size / text lines
const SidebarUserSkeleton = ({ collapsed }) => (
  <div className="sidebar-user" style={{ display: "flex", alignItems: "center", gap: 10 }}>
    {/* Avatar circle */}
    <Sk w={40} h={40} r="50%" style={{ flexShrink: 0 }} />

    {/* Name + username — hidden when collapsed */}
    {!collapsed && (
      <motion.div
        initial={false}
        animate={{ opacity: 1 }}
        style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1, overflow: "hidden" }}
      >
        <Sk w="70%" h={13} />
        <Sk w="50%" h={11} />
      </motion.div>
    )}
  </div>
)

// ── Full Sidebar ──────────────────────────────────────────────
const Sidebar = ({ collapsed, activeSection, setActiveSection, dashboardData }) => {
  const location = useLocation()
  const navigate = useNavigate()

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3, path: "/dashboard" },
    { id: "orders", label: "Orders", icon: ShoppingCart, path: "/dashboard/orders" },
    { id: "products", label: "Products", icon: Package, path: "/dashboard/products" },
    { id: "settings", label: "Settings", icon: Settings, path: "/dashboard/settings" },
  ]

  const handleLogout = () => { logout() }

  // Show skeleton only while dashboardData hasn't loaded yet
  const isLoading = !dashboardData

  return (
    <motion.aside
      className={`sidebar ${collapsed ? "collapsed" : ""}`}
      initial={false}
      animate={{ width: collapsed ? "80px" : "250px" }}
      transition={{ duration: 0.3 }}
    >
      {/* ── Header ── */}

      <div className="sidebar-header">
        <motion.img
          initial={false}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          src="/logo12.png"
          alt="Logo"
        />
        <motion.h2
          initial={false}
          animate={{ opacity: collapsed ? 0 : 1 }}
          transition={{ duration: 0.2 }}
        >
          Auto<span>PrintX</span>
        </motion.h2>
      </div>


      {/* ── User profile ── */}
      {isLoading ? (
        <SidebarUserSkeleton collapsed={collapsed} />
      ) : (
        <div className="sidebar-user">
          <img
            src={dashboardData?.user?.shop_image || "https://placehold.co/100x100/0a2463/white?text=A"}
            alt=""
          />
          <motion.div
            initial={false}
            animate={{ opacity: collapsed ? 0 : 1 }}
            transition={{ duration: 0.2 }}
          >
            <h4>{dashboardData?.user?.owner_name || "—"}</h4>
            <p>{dashboardData?.user?.username || "—"}</p>
          </motion.div>
        </div>
      )}

      {/* ── Nav (always visible, no skeleton needed) ── */}
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
                  <motion.span
                    initial={false}
                    animate={{ opacity: collapsed ? 0 : 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {item.label}
                  </motion.span>
                </Link>
              </motion.li>
            )
          })}
        </ul>
      </nav>

      {/* ── Footer ── */}
      <div className="sidebar-footer">
        <Link id="logout" to="/login" onClick={handleLogout} title={collapsed ? "Logout" : ""}>
          <LogOut size={20} />
          <motion.span
            initial={false}
            animate={{ opacity: collapsed ? 0 : 1 }}
            transition={{ duration: 0.2 }}
          >
            Logout
          </motion.span>
        </Link>
      </div>
    </motion.aside>
  )
}

export default Sidebar