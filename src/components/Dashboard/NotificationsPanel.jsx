"use client"
import { motion, AnimatePresence } from "framer-motion"
import { X, ShoppingCart, DollarSign, Truck, Users, Settings, Check } from "lucide-react"

const NotificationsPanel = ({ notifications, onClose, onMarkAsRead }) => {
  const getNotificationIcon = (type) => {
    switch (type) {
      case "order":
        return <ShoppingCart size={16} />
      case "payment":
        return <DollarSign size={16} />
      case "delivery":
        return <Truck size={16} />
      case "customer":
        return <Users size={16} />
      case "system":
        return <Settings size={16} />
      default:
        return <Settings size={16} />
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        className="notifications-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="notifications-panel"
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 300, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="notifications-header">
            <h3>Notifications</h3>
            <button className="close-btn" onClick={onClose}>
              <X size={20} />
            </button>
          </div>

          <div className="notifications-list">
            {notifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                className={`notification-item ${notification.read ? "read" : "unread"}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ x: 5 }}
              >
                <div className={`notification-icon ${notification.type}`}>{getNotificationIcon(notification.type)}</div>
                <div className="notification-content">
                  <p>{notification.message}</p>
                  <span className="notification-time">{notification.time}</span>
                </div>
                {!notification.read && (
                  <button className="mark-read-btn" onClick={() => onMarkAsRead(notification.id)} title="Mark as read">
                    <Check size={14} />
                  </button>
                )}
              </motion.div>
            ))}
          </div>

          <div className="notifications-footer">
            <button className="btn-secondary">Mark All as Read</button>
            <button className="btn-primary">View All</button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default NotificationsPanel
