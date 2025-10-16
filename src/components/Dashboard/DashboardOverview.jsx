"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ShoppingCart, Users, DollarSign, Printer, Eye, Download, MoreHorizontal } from "lucide-react"
import StatCard from "./StatCard"
import RecentOrders from "./RecentOrders"
// import InteractiveChart from "./InteractiveChart"
import { get_dashboard, dashboardOverview } from "./api/endpoints";
// import { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import { Eye, Download, MoreHorizontal } from "lucide-react";
import InteractiveChart from "./InteractiveChart"; // Your chart component
// import { axiosInstance } from "../utils/axios"; // your axios setup
import axios from "axios";
// import QRCode from "react-qr-code"

const DashboardOverview = () => {

  const [dashboardData, setDashboardData] = useState(null);
  
    useEffect(() => {
      const fetchData = async () => {
        const data = await get_dashboard();
        setDashboardData(data);
      };
  
      fetchData();
    }, [get_dashboard]);


    const [dashboardOverviewData, setDashboardOverviewData] = useState(null);
    useEffect(() => {
      const fetchData = async () => {
        const data1 = await dashboardOverview();
        setDashboardOverviewData(data1);
        console.log("Dashboard Overview Data:", data1);
      };
  
      fetchData();
    }, [dashboardOverview]);

  const [timeRange, setTimeRange] = useState("7d")
  const [stats, setStats] = useState({
    // totalOrders: { value: dashboardOverviewData?.dashboard_stats.orders.overall || 0, change: 15, trend: "up" },
    totalCustomers: { value: dashboardData?.user.total_customers || 0, change: 12, trend: "up" },
    totalRevenue: { value: dashboardData?.user.total_revenue || 0, change: 18, trend: "up" },
    pagesPrinted: { value: 20, change: 22, trend: "up" },
  })

  const [recentActivity, setRecentActivity] = useState([
    { id: 1, type: "order", message: "New order from John Doe", time: "2 min ago" },
    { id: 2, type: "payment", message: "Payment received for Order #ORD-0024", time: "5 min ago" },
    { id: 3, type: "delivery", message: "Order #ORD-0023 delivered", time: "10 min ago" },
    { id: 4, type: "customer", message: "New customer registration", time: "15 min ago" },
  ])

  // const chartData = {
  //   labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  //   datasets: [
  //     {
  //       label: "Revenue",
  //       data: [12000, 19000, 15000, 25000, 22000, 30000, 28000, 35000, 40000, 42000, 45000, 48000],
  //       borderColor: "#0a2463",
  //       backgroundColor: "rgba(10, 36, 99, 0.1)",
  //       tension: 0.4,
  //     },
  //     {
  //       label: "Orders",
  //       data: [120, 190, 150, 250, 220, 300, 22280, 350, 400, 420, 450, 480],
  //       borderColor: "#2176ff",
  //       backgroundColor: "rgba(33, 118, 255, 0.1)",
  //       tension: 0.4,
  //     },
  //   ],
  // }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  }
  const [chartData, setChartData] = useState(null);
  const [filter, setFilter] = useState("day"); // day, week, month, overall

  const fetchChartData = async (filterType) => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/chart-data/?filter=${filterType}`, {
        withCredentials: true, // include cookies if required for auth
      });
      setChartData(res.data);
    } catch (err) {
      console.error("Chart Data Fetch Error:", err);
    }
  };

  useEffect(() => {
    fetchChartData(filter);
    // document.title = 'Dashboard';

  }, [filter]);

  return (
    <motion.div className="dashboard-overview" variants={containerVariants} initial="hidden" animate="visible">
      <div className="dashboard-header-section">
        <motion.h1 variants={itemVariants}>Dashboard Overview</motion.h1>
        {/* <button onClick={handleLogout}>logout</button> */}
        {/* {dashboardData && (
          <pre>{JSON.stringify(dashboardData, null, 2)}</pre>
        )} */}
        <a href={dashboardData ? `/upload/${dashboardData.user.unique_url}` : '#'}>/upload/{dashboardData ? dashboardData.user.unique_url : 'Loading...'}</a>
        <div className="time-range-selector">
          {["24h", "7d", "30d", "90d"].map((range) => (
            <button
              key={range}
              className={`time-btn ${timeRange === range ? "active" : ""}`}
              onClick={() => setTimeRange(range)}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <motion.div className="stats-container" variants={itemVariants}>
        <StatCard
          icon={ShoppingCart}
          title="Total Orders"
          value={dashboardOverviewData ? dashboardOverviewData.OrderOverview[0].dashboard_stats.orders.overall : "Loading..."}
          change={dashboardOverviewData ? Math.abs(dashboardOverviewData.OrderOverview[0].dashboard_stats.orders.percent_change) : 0}
          trend={dashboardOverviewData ? (dashboardOverviewData.OrderOverview[0].dashboard_stats.orders.percent_change >= 0 ? "up" : "down") : "up"}
          period="from yesterday"
        />
        <StatCard
          icon={Users}
          title="Total Customers"
          value={dashboardOverviewData ? dashboardOverviewData.OrderOverview[0].dashboard_stats.customers.overall : "Loading..."}
          change={dashboardOverviewData ? Math.abs(dashboardOverviewData.OrderOverview[0].dashboard_stats.customers.percent_change) : 0}
          trend={dashboardOverviewData ? (dashboardOverviewData.OrderOverview[0].dashboard_stats.customers.percent_change >= 0 ? "up" : "down") : "up"}
          period="from yesterday"
        />
        <StatCard
          icon={DollarSign}
          title="Total Revenue"
          value={dashboardOverviewData ? `$${dashboardOverviewData.OrderOverview[0].dashboard_stats.revenue.overall}` : "Loading..."}
          change={dashboardOverviewData ? Math.abs(dashboardOverviewData.OrderOverview[0].dashboard_stats.revenue.percent_change) : 0}
          trend={dashboardOverviewData ? (dashboardOverviewData.OrderOverview[0].dashboard_stats.revenue.percent_change >= 0 ? "up" : "down") : "up"}
          period="from yesterday"
        />
        <StatCard
          icon={Printer}
          title="Pages Printed"
          value={dashboardOverviewData ? dashboardOverviewData.OrderOverview[0].dashboard_stats.printed_pages.overall.toLocaleString() : "Loading..."}
          change={dashboardOverviewData ? Math.abs(dashboardOverviewData.OrderOverview[0].dashboard_stats.printed_pages.percent_change) : 0}
          trend={dashboardOverviewData ? (dashboardOverviewData.OrderOverview[0].dashboard_stats.printed_pages.percent_change >= 0 ? "up" : "down") : "up"}
          period="from yesterday"
        />
      </motion.div>


      {/* Charts and Activity */}
      <div className="dashboard-grid">
        {/* <motion.div className="chart-section" variants={itemVariants}>
          <div className="section-header">
            <h3>Revenue & Orders Trend</h3>
            <div className="chart-actions">
              <button className="btn-icon">
                <Eye size={16} />
              </button>
              <button className="btn-icon">
                <Download size={16} />
              </button>
              <button className="btn-icon">
                <MoreHorizontal size={16} />
              </button>
            </div>
          </div>
          <InteractiveChart data={chartData} type="line" />
        </motion.div> */}
        <motion.div className="chart-section">
          <div className="section-header">
            <h3>Revenue & Orders Trend</h3>
            <div className="chart-actions">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="filter-select"
              >
                <option value="day">Last 7 Days</option>
                <option value="week">Last 4 Weeks</option>
                <option value="month">This Year</option>
                <option value="overall">Overall</option>
              </select>

              <button className="btn-icon"><Eye size={16} /></button>
              <button className="btn-icon"><Download size={16} /></button>
              <button className="btn-icon"><MoreHorizontal size={16} /></button>
            </div>
          </div>

          {chartData ? (
            <InteractiveChart data={chartData} type="line" />
          ) : (
            <p>Loading chart...</p>
          )}
        </motion.div>

        <motion.div className="activity-section" variants={itemVariants}>
          <div className="section-header">
            <h3>Recent Activity</h3>
            <button className="view-all">View All</button>
          </div>
          <div className="activity-list">
            {recentActivity.map((activity) => (
              <motion.div
                key={activity.id}
                className="activity-item"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
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
            ))}
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
