"use client"

import { useState, useMemo, useCallback } from "react"
import { motion } from "framer-motion"
import {
  ShoppingCart,
  Users,
  DollarSign,
  Printer,
  Eye,
  Download,
  MoreHorizontal
} from "lucide-react"
import StatCard from "./StatCard"
import RecentOrders from "./RecentOrders"
import InteractiveChart from "./InteractiveChart"
import { dashboardOverview, fetchChartDataAPI, recentActivity as fetchRecentActivity } from "./api/endpoints"
import { useQuery } from '@tanstack/react-query'

const DashboardOverview = () => {
  const [filter, setFilter] = useState("day")
  const [timeRange, setTimeRange] = useState("7d")

  // ✅ Fetch recent activity - keeps previous data while refetching
  const { data: recentActivity = [] } = useQuery({
    queryKey: ['recentActivity'],
    queryFn: async () => {
      const data = await fetchRecentActivity(4)
      return data?.activities || []
    },
    refetchInterval: 5000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    placeholderData: (previousData) => previousData, // ✅ Prevents refresh feeling
    staleTime: 3000,
    onError: (err) => {
      console.error("Error fetching recent activity:", err)
    }
  })

  // ✅ Fetch dashboard overview - NO page blink
  const {
    data: dashboardOverviewData,
    isLoading: isDashboardLoading
  } = useQuery({
    queryKey: ['dashboardOverview'],
    queryFn: async () => {
      const data = await dashboardOverview()
      return data
    },
    refetchInterval: 4000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    placeholderData: (previousData) => previousData, // ✅ Prevents refresh feeling
    staleTime: 3000,
    onError: (err) => {
      console.error("Error fetching dashboard overview:", err)
    }
  })

  // ✅ Fetch chart data - NO chart blink
  const { data: chartData, isLoading: isChartLoading } = useQuery({
    queryKey: ['chartData', filter],
    queryFn: async () => {
      const data = await fetchChartDataAPI(filter)
      return data
    },
    refetchInterval: 5000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    placeholderData: (previousData) => previousData, // ✅ Prevents refresh feeling
    staleTime: 3000,
    onError: (err) => {
      console.error("Error fetching chart data:", err)
    }
  })

  // ✅ Memoized dashboard stats - prevents unnecessary recalculations
  const dashboardStats = useMemo(() => {
    if (!dashboardOverviewData?.OrderOverview?.[0]) {
      return {
        orders: { overall: 0, percent_change: 0 },
        customers: { overall: 0, percent_change: 0 },
        revenue: { overall: 0, percent_change: 0 },
        printed_pages: { overall: 0, percent_change: 0 },
        unique_url: ''
      }
    }

    const stats = dashboardOverviewData.OrderOverview[0].dashboard_stats
    const url = dashboardOverviewData.OrderOverview[0].unique_url

    return {
      orders: stats.orders,
      customers: stats.customers,
      revenue: stats.revenue,
      printed_pages: stats.printed_pages,
      unique_url: url
    }
  }, [dashboardOverviewData])

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

  // ✅ Only show loading on FIRST load (not on every refetch)
  if (isDashboardLoading && !dashboardOverviewData) {
    return (
      <div className="dashboard-overview">
        <div className="dashboard-header-section">
          <h1>Dashboard Overview</h1>
          <div className="skeleton-loader">Loading...</div>
        </div>
        <div className="stats-container">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="stat-card-skeleton">
              <div className="skeleton-box"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <motion.div
      className="dashboard-overview"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="dashboard-header-section">
        <motion.h1 variants={itemVariants}>Dashboard Overview</motion.h1>
        <a href={dashboardStats.unique_url ? `/upload/${dashboardStats.unique_url}` : '#'}>
          /upload/{dashboardStats.unique_url || 'Loading...'}
        </a>
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
          value={dashboardStats.orders.overall}
          change={Math.abs(dashboardStats.orders.percent_change)}
          trend={dashboardStats.orders.percent_change >= 0 ? "up" : "down"}
          period="from yesterday"
        />
        <StatCard
          icon={Users}
          title="Total Customers"
          value={dashboardStats.customers.overall}
          change={Math.abs(dashboardStats.customers.percent_change)}
          trend={dashboardStats.customers.percent_change >= 0 ? "up" : "down"}
          period="from yesterday"
        />
        <StatCard
          icon={DollarSign}
          title="Total Revenue"
          value={`$${dashboardStats.revenue.overall}`}
          change={Math.abs(dashboardStats.revenue.percent_change)}
          trend={dashboardStats.revenue.percent_change >= 0 ? "up" : "down"}
          period="from yesterday"
        />
        <StatCard
          icon={Printer}
          title="Pages Printed"
          value={dashboardStats.printed_pages.overall}
          change={Math.abs(dashboardStats.printed_pages.percent_change)}
          trend={dashboardStats.printed_pages.percent_change >= 0 ? "up" : "down"}
          period="from yesterday"
        />
      </motion.div>

      {/* Charts and Activity */}
      <div className="dashboard-grid">
        <motion.div className="chart-section" variants={itemVariants}>
          <div className="section-header">
            <h3>Revenue & Orders Trend</h3>
            <div className="chart-actions">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="status-filter"
                id="status-filter"
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

          {/* ✅ Only show loading on FIRST load */}
          {isChartLoading && !chartData ? (
            <div className="chart-loading">
              <p>Loading chart...</p>
            </div>
          ) : chartData ? (
            <InteractiveChart data={chartData} type="line" />
          ) : (
            <p>No chart data available</p>
          )}
        </motion.div>

        <motion.div className="activity-section" variants={itemVariants}>
          <div className="section-header">
            <h3>Recent Activity</h3>
            <button className="view-all">View All</button>
          </div>

          <div className="activity-list">
            {recentActivity.length === 0 ? (
              <p>No recent activity</p>
            ) : (
              recentActivity.map((activity) => (
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
              ))
            )}
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