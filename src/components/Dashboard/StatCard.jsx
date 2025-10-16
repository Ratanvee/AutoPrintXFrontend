"use client"
import { motion } from "framer-motion"
import { TrendingUp, TrendingDown } from "lucide-react"

const StatCard = ({ icon: Icon, title, value, change, trend, period }) => {
  return (
    <motion.div
      className="stat-card"
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="stat-icon">
        <Icon size={24} />
      </div>
      <div className="stat-info">
        <h3>{title}</h3>
        <motion.p
          className="stat-number"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          {value}
        </motion.p>
        <p className={`stat-change ${trend}`}>
          {trend === "up" ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          {change}% <span>{period}</span>
        </p>
      </div>
    </motion.div>
  )
}

export default StatCard
