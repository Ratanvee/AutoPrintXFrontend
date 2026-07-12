// "use client"

// import { useState, useMemo } from "react"
// import { motion } from "framer-motion"
// import {
//   ShoppingCart,
//   Users,
//   DollarSign,
//   Printer,
//   Eye,
//   Download,
//   MoreHorizontal,
//   IndianRupee
// } from "lucide-react"
// import StatCard from "./StatCard"
// import RecentOrders from "./RecentOrders"
// import InteractiveChart from "./InteractiveChart"
// import { dashboardOverview, fetchChartDataAPI, recentActivity as fetchRecentActivity } from "./api/endpoints"
// import { useQuery } from '@tanstack/react-query'

// // Accept recentActivities as prop from parent Dashboard component
// const DashboardOverview = ({ recentActivities = [], showNotifications, setShowNotifications }) => {
//   const [filter, setFilter] = useState("day")
//   const [timeRange, setTimeRange] = useState("7d")

//   // Use only the first 4 activities for dashboard overview
//   const limitedActivities = useMemo(() => {
//     return recentActivities.slice(0, 4)
//   }, [recentActivities])

//   // Fetch dashboard overview - NO page blink
//   const {
//     data: dashboardOverviewData,
//     isLoading: isDashboardLoading
//   } = useQuery({
//     queryKey: ['dashboardOverview'],
//     queryFn: async () => {
//       const data = await dashboardOverview()
//       return data
//     },
//     refetchInterval: 4000,
//     refetchOnWindowFocus: true,
//     refetchOnMount: true,
//     placeholderData: (previousData) => previousData,
//     staleTime: 3000,
//     onError: (err) => {
//       console.error("Error fetching dashboard overview:", err)
//     }
//   })

//   // Fetch chart data - NO chart blink
//   const { data: chartData, isLoading: isChartLoading } = useQuery({
//     queryKey: ['chartData', filter],
//     queryFn: async () => {
//       const data = await fetchChartDataAPI(filter)
//       return data
//     },
//     refetchInterval: 5000,
//     refetchOnWindowFocus: true,
//     refetchOnMount: true,
//     placeholderData: (previousData) => previousData,
//     staleTime: 3000,
//     onError: (err) => {
//       console.error("Error fetching chart data:", err)
//     }
//   })

//   // Memoized dashboard stats - prevents unnecessary recalculations
//   const dashboardStats = useMemo(() => {
//     if (!dashboardOverviewData?.OrderOverview?.[0]) {
//       return {
//         orders: { overall: 0, percent_change: 0 },
//         customers: { overall: 0, percent_change: 0 },
//         revenue: { overall: 0, percent_change: 0 },
//         printed_pages: { overall: 0, percent_change: 0 },
//         unique_url: ''
//       }
//     }

//     const stats = dashboardOverviewData.OrderOverview[0].dashboard_stats
//     const url = dashboardOverviewData.OrderOverview[0].unique_url

//     return {
//       orders: stats.orders,
//       customers: stats.customers,
//       revenue: stats.revenue,
//       printed_pages: stats.printed_pages,
//       unique_url: url
//     }
//   }, [dashboardOverviewData])

//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.1,
//       },
//     },
//   }

//   const itemVariants = {
//     hidden: { y: 20, opacity: 0 },
//     visible: {
//       y: 0,
//       opacity: 1,
//       transition: { duration: 0.5 },
//     },
//   }

//   // Only show loading on FIRST load (not on every refetch)
//   if (isDashboardLoading && !dashboardOverviewData) {
//     return (
//       <div className="dashboard-overview">
//         <div className="dashboard-header-section">
//           <h1>Dashboard Overview</h1>
//           <div className="skeleton-loader">Loading...</div>
//         </div>
//         <div className="stats-container stats-skeleton">
//           {[1, 2, 3, 4].map((i) => (
//             <div key={i} className="stat-card-skeleton">
//               <div className="skeleton-box"></div>
//             </div>
//           ))}
//         </div>
//       </div>
//     )
//   }

//   return (
//     <motion.div
//       className="dashboard-overview"
//       variants={containerVariants}
//       initial="hidden"
//       animate="visible"
//     >
//       <div className="dashboard-header-section">
//         <motion.h1 variants={itemVariants}>Dashboard Overview</motion.h1>
//         <a href={dashboardStats.unique_url ? `/upload/${dashboardStats.unique_url}` : '#'}>
//           /upload/{dashboardStats.unique_url || 'Loading...'}
//         </a>
//         {/* <div className="time-range-selector">
//           {["24h", "7d", "30d", "90d"].map((range) => (
//             <button
//               key={range}
//               className={`time-btn ${timeRange === range ? "active" : ""}`}
//               onClick={() => setTimeRange(range)}
//             >
//               {range}
//             </button>
//           ))}
//         </div> */}
//       </div>

//       {/* Stats Cards */}
//       <motion.div className="stats-container" variants={itemVariants}>
//         <StatCard
//           icon={ShoppingCart}
//           title="Total Orders"
//           value={dashboardStats.orders.overall}
//           change={Math.abs(dashboardStats.orders.percent_change)}
//           trend={dashboardStats.orders.percent_change >= 0 ? "up" : "down"}
//           period="from yesterday"
//         />
//         <StatCard
//           icon={Users}
//           title="Total Customers"
//           value={dashboardStats.customers.overall}
//           change={Math.abs(dashboardStats.customers.percent_change)}
//           trend={dashboardStats.customers.percent_change >= 0 ? "up" : "down"}
//           period="from yesterday"
//         />
//         <StatCard
//           icon={IndianRupee}
//           title="Total Revenue"
//           value={`₹${dashboardStats.revenue.overall}`}
//           change={Math.abs(dashboardStats.revenue.percent_change)}
//           trend={dashboardStats.revenue.percent_change >= 0 ? "up" : "down"}
//           period="from yesterday"
//         />
//         <StatCard
//           icon={Printer}
//           title="Pages Printed"
//           value={dashboardStats.printed_pages.overall}
//           change={Math.abs(dashboardStats.printed_pages.percent_change)}
//           trend={dashboardStats.printed_pages.percent_change >= 0 ? "up" : "down"}
//           period="from yesterday"
//         />
//       </motion.div>

//       {/* Charts and Activity */}
//       <div className="dashboard-grid">
//         <motion.div className="chart-section" variants={itemVariants}>
//           <div className="section-header">
//             <h3>Revenue & Orders Trend</h3>
//             <div className="chart-actions">
//               <select
//                 value={filter}
//                 onChange={(e) => setFilter(e.target.value)}
//                 className="status-filter"
//                 id="status-filter"
//               >
//                 <option value="day">Last 7 Days</option>
//                 <option value="week">Last 4 Weeks</option>
//                 <option value="month">This Year</option>
//                 <option value="overall">Overall</option>
//               </select>

//               {/* <button className="btn-icon"><Eye size={16} /></button>
//               <button className="btn-icon"><Download size={16} /></button>
//               <button className="btn-icon"><MoreHorizontal size={16} /></button> */}
//             </div>
//           </div>

//           {/* Only show loading on FIRST load */}
//           {isChartLoading && !chartData ? (
//             <div className="chart-loading">
//               <p>Loading chart...</p>
//             </div>
//           ) : chartData ? (
//             <InteractiveChart data={chartData} type="line" />
//           ) : (
//             <p>No chart data available</p>
//           )}
//         </motion.div>

//         <motion.div className="activity-section" variants={itemVariants}>
//           <div className="section-header">
//             <h3>Recent Activity</h3>
//             <button onClick={() => setShowNotifications(!showNotifications)} className="view-all">View All</button>
//           </div>

//           <div className="activity-list">
//             {limitedActivities.length === 0 ? (
//               <p>No recent activity</p>
//             ) : (
//               limitedActivities.map((activity) => (
//                 <motion.div
//                   key={activity.id}
//                   className="activity-item"
//                   whileHover={{ x: 5 }}
//                   transition={{ duration: 0.2 }}
//                 >
//                   <div className={`activity-icon ${activity.type}`}>
//                     {activity.type === "order" && <ShoppingCart size={16} />}
//                     {activity.type === "payment" && <DollarSign size={16} />}
//                     {activity.type === "delivery" && <Printer size={16} />}
//                     {activity.type === "customer" && <Users size={16} />}
//                   </div>
//                   <div className="activity-content">
//                     <p>{activity.message}</p>
//                     <span className="activity-time">{activity.time}</span>
//                   </div>
//                 </motion.div>
//               ))
//             )}
//           </div>
//         </motion.div>
//       </div>

//       {/* Recent Orders */}
//       <motion.div variants={itemVariants}>
//         <RecentOrders />
//       </motion.div>
//     </motion.div>
//   )
// }

// export default DashboardOverview



"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { ShoppingCart, Users, DollarSign, Printer, IndianRupee } from "lucide-react"
import StatCard from "./StatCard"
import RecentOrders from "./RecentOrders"
import InteractiveChart from "./InteractiveChart"
import { dashboardOverview, fetchChartDataAPI } from "./api/endpoints"
import { useQuery } from "@tanstack/react-query"

// ── Shimmer keyframe (injected once) ──────────────────────────
const SHIMMER_STYLE = `
@keyframes shimmer {
  0%   { background-position: -600px 0 }
  100% { background-position:  600px 0 }
}
.sk {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 600px 100%;
  animation: shimmer 1.4s infinite linear;
  border-radius: 6px;
}
`
if (!document.getElementById("sk-style")) {
  const el = document.createElement("style")
  el.id = "sk-style"
  el.textContent = SHIMMER_STYLE
  document.head.appendChild(el)
}

// ── Skeleton primitives ───────────────────────────────────────
const Sk = ({ w = "100%", h = 14, r = 6, style = {} }) => (
  <div className="sk" style={{ width: w, height: h, borderRadius: r, flexShrink: 0, ...style }} />
)

// ── Stat card skeleton — same size as <StatCard /> ────────────
const StatCardSkeleton = () => (
  <div style={{
    background: "#fff", border: "1px solid #f0f0f0", borderRadius: 12,
    padding: "20px", display: "flex", flexDirection: "column", gap: 12, flex: 1, minWidth: 0,
  }}>
    {/* icon + title row */}
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <Sk w={36} h={36} r={8} />
      <Sk w={60} h={20} r={20} />
    </div>
    {/* value */}
    <Sk w="55%" h={28} />
    {/* change pill */}
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <Sk w={16} h={16} r={4} />
      <Sk w="65%" h={13} />
    </div>
  </div>
)

// ── Chart section skeleton ────────────────────────────────────
const ChartSkeleton = () => (
  <div style={{
    background: "#fff", border: "1px solid #f0f0f0", borderRadius: 12,
    padding: "20px", display: "flex", flexDirection: "column", gap: 16,
  }}>
    {/* header */}
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <Sk w={180} h={18} />
      <Sk w={110} h={32} r={8} />
    </div>
    {/* y-axis + bars area */}
    <div style={{ display: "flex", gap: 12 }}>
      {/* y-axis labels */}
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", paddingBottom: 20 }}>
        {[1, 2, 3, 4, 5].map(i => <Sk key={i} w={32} h={11} />)}
      </div>
      {/* chart body */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
        {/* bars */}
        <div style={{ flex: 1, display: "flex", alignItems: "flex-end", gap: 6 }}>
          {[65, 85, 50, 90, 70, 55, 80].map((h, i) => (
            <Sk key={i} style={{ flex: 1, height: h + "%" }} r={4} />
          ))}
        </div>
        {/* x-axis labels */}
        <div style={{ display: "flex", gap: 6 }}>
          {[1, 2, 3, 4, 5, 6, 7].map(i => <Sk key={i} style={{ flex: 1 }} h={11} />)}
        </div>
      </div>
    </div>
  </div>
)

// ── Activity section skeleton ─────────────────────────────────
const ActivitySkeleton = () => (
  <div style={{
    background: "#fff", border: "1px solid #f0f0f0", borderRadius: 12,
    padding: "20px", display: "flex", flexDirection: "column", gap: 16,
  }}>
    {/* header */}
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <Sk w={130} h={18} />
      <Sk w={60} h={14} />
    </div>
    {/* activity items */}
    {[1, 2, 3, 4].map(i => (
      <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Sk w={36} h={36} r={8} style={{ flexShrink: 0 }} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
          <Sk w="80%" h={13} />
          <Sk w="40%" h={11} />
        </div>
      </div>
    ))}
  </div>
)

// ── Recent Orders table skeleton ──────────────────────────────
const RecentOrdersSkeleton = () => (
  <div style={{
    background: "#fff", border: "1px solid #f0f0f0", borderRadius: 12,
    padding: "20px", display: "flex", flexDirection: "column", gap: 14,
  }}>
    {/* header */}
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
      <Sk w={140} h={18} />
      <Sk w={90} h={32} r={8} />
    </div>
    {/* table head */}
    <div style={{ display: "flex", gap: 12, paddingBottom: 10, borderBottom: "1px solid #f3f4f6" }}>
      {[120, 90, 80, 70, 60, 70].map((w, i) => <Sk key={i} w={w} h={12} />)}
    </div>
    {/* rows */}
    {[1, 2, 3, 4, 5].map(row => (
      <div key={row} style={{ display: "flex", gap: 12, alignItems: "center", paddingBottom: 12, borderBottom: "1px solid #f9fafb" }}>
        {[120, 90, 80, 70, 60, 70].map((w, i) => (
          <Sk key={i} w={w} h={i === 5 ? 22 : 13} r={i === 5 ? 20 : 6} />
        ))}
      </div>
    ))}
  </div>
)

// ── Header skeleton ───────────────────────────────────────────
const HeaderSkeleton = () => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <Sk w={220} h={24} />
      <Sk w={160} h={14} />
    </div>
    <Sk w={140} h={32} r={8} />
  </div>
)

// ── Full page skeleton — matches real layout exactly ──────────
const DashboardSkeleton = () => (
  <div className="dashboard-overview" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
    <HeaderSkeleton />
    {/* Stats row */}
    <div className="stats-container" style={{ display: "flex", gap: 16 }}>
      {[1, 2, 3, 4].map(i => <StatCardSkeleton key={i} />)}
    </div>
    {/* Charts + Activity */}
    <div className="dashboard-grid" style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 16 }}>
      <ChartSkeleton />
      <ActivitySkeleton />
    </div>
    {/* Recent Orders */}
    <RecentOrdersSkeleton />
  </div>
)

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────
const DashboardOverview = ({ recentActivities = [], showNotifications, setShowNotifications }) => {
  const [filter, setFilter] = useState("day")

  const limitedActivities = useMemo(() => recentActivities.slice(0, 4), [recentActivities])

  // ── Dashboard stats query ──
  const { data: dashboardOverviewData, isLoading: isDashboardLoading } = useQuery({
    queryKey: ["dashboardOverview"],
    queryFn: dashboardOverview,
    refetchInterval: 4000,
    refetchOnWindowFocus: true,
    placeholderData: prev => prev,
    staleTime: 3000,
  })

  // ── Chart query ──
  const { data: chartData, isLoading: isChartLoading } = useQuery({
    queryKey: ["chartData", filter],
    queryFn: () => fetchChartDataAPI(filter),
    refetchInterval: 5000,
    refetchOnWindowFocus: true,
    placeholderData: prev => prev,
    staleTime: 3000,
  })

  // ── Memoised stats ──
  const dashboardStats = useMemo(() => {
    const fallback = {
      orders: { overall: 0, percent_change: 0 },
      customers: { overall: 0, percent_change: 0 },
      revenue: { overall: 0, percent_change: 0 },
      printed_pages: { overall: 0, percent_change: 0 },
      unique_url: "",
    }
    if (!dashboardOverviewData?.OrderOverview?.[0]) return fallback
    const stats = dashboardOverviewData.OrderOverview[0].dashboard_stats
    const url = dashboardOverviewData.OrderOverview[0].unique_url
    return { ...stats, unique_url: url }
  }, [dashboardOverviewData])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  }
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  }

  // ── FIRST LOAD → full skeleton ──
  if (isDashboardLoading && !dashboardOverviewData) return <DashboardSkeleton />

  // ── LOADED ──
  return (
    <motion.div className="dashboard-overview" variants={containerVariants} initial="hidden" animate="visible">
      {/* Header */}
      <div className="dashboard-header-section">
        <motion.h1 variants={itemVariants}>Dashboard Overview</motion.h1>
        <a href={dashboardStats.unique_url ? `/upload/${dashboardStats.unique_url}` : "#"}>
          /upload/{dashboardStats.unique_url || "..."}
        </a>
      </div>

      {/* Stat cards */}
      <motion.div className="stats-container" variants={itemVariants}>
        <StatCard icon={ShoppingCart} title="Total Orders" value={dashboardStats.orders.overall} change={Math.abs(dashboardStats.orders.percent_change)} trend={dashboardStats.orders.percent_change >= 0 ? "up" : "down"} period="from yesterday" />
        <StatCard icon={Users} title="Total Customers" value={dashboardStats.customers.overall} change={Math.abs(dashboardStats.customers.percent_change)} trend={dashboardStats.customers.percent_change >= 0 ? "up" : "down"} period="from yesterday" />
        <StatCard icon={IndianRupee} title="Total Revenue" value={`₹${dashboardStats.revenue.overall}`} change={Math.abs(dashboardStats.revenue.percent_change)} trend={dashboardStats.revenue.percent_change >= 0 ? "up" : "down"} period="from yesterday" />
        <StatCard icon={Printer} title="Pages Printed" value={dashboardStats.printed_pages.overall} change={Math.abs(dashboardStats.printed_pages.percent_change)} trend={dashboardStats.printed_pages.percent_change >= 0 ? "up" : "down"} period="from yesterday" />
      </motion.div>

      {/* Charts + Activity */}
      <div className="dashboard-grid">
        <motion.div className="chart-section" variants={itemVariants}>
          <div className="section-header">
            <h3>Revenue &amp; Orders Trend</h3>
            <div className="chart-actions">
              <select value={filter} onChange={e => setFilter(e.target.value)} className="status-filter">
                <option value="day">Last 7 Days</option>
                <option value="week">Last 4 Weeks</option>
                <option value="month">This Year</option>
                <option value="overall">Overall</option>
              </select>
            </div>
          </div>
          {/* Chart: skeleton only on very first load */}
          {isChartLoading && !chartData
            ? <ChartSkeleton />
            : chartData
              ? <InteractiveChart data={chartData} type="line" />
              : <p>No chart data available</p>
          }
        </motion.div>

        <motion.div className="activity-section" variants={itemVariants}>
          <div className="section-header">
            <h3>Recent Activity</h3>
            <button onClick={() => setShowNotifications(!showNotifications)} className="view-all">View All</button>
          </div>
          <div className="activity-list">
            {limitedActivities.length === 0
              ? <p>No recent activity</p>
              : limitedActivities.map(activity => (
                <motion.div key={activity.id} className="activity-item" whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                  <div className={`activity-icon ${activity.type}`}>
                    {activity.type === "order" && <ShoppingCart size={16} />}
                    {activity.type === "payment" && <DollarSign size={16} />}
                    {activity.type === "delivery" && <Printer size={16} />}
                    {activity.type === "customer" && <Users size={16} />}
                  </div>
                  <div className="activity-content">
                    <p>{activity.message}</p>
                    <span className="activity-time">{activity.time}</span>
                  </div>
                </motion.div>
              ))
            }
          </div>
        </motion.div>
      </div>

      {/* Recent Orders */}
      <motion.div variants={itemVariants}>
        <RecentOrders />
      </motion.div>
    </motion.div>
  )
}

export default DashboardOverview