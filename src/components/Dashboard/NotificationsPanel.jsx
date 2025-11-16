"use client"
import { motion, AnimatePresence } from "framer-motion"
import { X, ShoppingCart, DollarSign, Truck, Users, Settings, Check, Bell } from "lucide-react"
import { useState } from "react"

const NotificationsPanel = ({ activities = [], onClose, isLoading = false }) => {
  const [readActivities, setReadActivities] = useState(new Set())

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

  const handleMarkAsRead = (activityId) => {
    setReadActivities(prev => new Set([...prev, activityId]))
  }

  const handleMarkAllAsRead = () => {
    const allIds = activities.map(activity => activity.id)
    setReadActivities(new Set(allIds))
  }

  const unreadCount = activities.filter(activity => !readActivities.has(activity.id)).length

  return (
    <AnimatePresence>
      <motion.div
        className="notifications-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000,
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <motion.div
          className="notifications-panel"
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 300, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            width: '400px',
            maxWidth: '90vw',
            height: '100vh',
            backgroundColor: '#fff',
            boxShadow: '-4px 0 20px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{
            padding: '20px',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Bell size={20} />
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>Recent Activities</h3>
              {unreadCount > 0 && (
                <span style={{
                  backgroundColor: '#ef4444',
                  color: '#fff',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: 600,
                }}>
                  {unreadCount}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '4px',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <X size={20} />
            </button>
          </div>

          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '12px',
          }}>
            {isLoading ? (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '200px',
                color: '#6b7280'
              }}>
                Loading activities...
              </div>
            ) : activities.length === 0 ? (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '200px',
                color: '#6b7280',
                gap: '8px'
              }}>
                <Bell size={48} style={{ opacity: 0.3 }} />
                <p style={{ margin: 0 }}>No recent activities</p>
              </div>
            ) : (
              activities.map((activity, index) => {
                const isRead = readActivities.has(activity.id)
                return (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ x: 4 }}
                    style={{
                      display: 'flex',
                      gap: '12px',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: isRead ? '#f9fafb' : '#eff6ff',
                      marginBottom: '8px',
                      cursor: 'pointer',
                      border: `1px solid ${isRead ? '#e5e7eb' : '#bfdbfe'}`,
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: activity.type === 'order' ? '#dbeafe' :
                        activity.type === 'payment' ? '#dcfce7' :
                          activity.type === 'delivery' ? '#fef3c7' :
                            activity.type === 'customer' ? '#e0e7ff' : '#f3f4f6',
                      color: activity.type === 'order' ? '#1e40af' :
                        activity.type === 'payment' ? '#15803d' :
                          activity.type === 'delivery' ? '#a16207' :
                            activity.type === 'customer' ? '#4338ca' : '#4b5563',
                      flexShrink: 0,
                    }}>
                      {getNotificationIcon(activity.type)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{
                        margin: 0,
                        fontSize: '14px',
                        color: '#111827',
                        fontWeight: isRead ? 400 : 600,
                        lineHeight: '1.4',
                      }}>
                        {activity.message}
                      </p>
                      <span style={{
                        fontSize: '12px',
                        color: '#6b7280',
                        display: 'block',
                        marginTop: '4px'
                      }}>
                        {activity.time}
                      </span>
                      {activity.amount && (
                        <span style={{
                          fontSize: '12px',
                          color: '#15803d',
                          fontWeight: 600,
                          display: 'block',
                          marginTop: '2px'
                        }}>
                          {activity.amount}
                        </span>
                      )}
                    </div>
                    {!isRead && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleMarkAsRead(activity.id)
                        }}
                        title="Mark as read"
                        style={{
                          background: '#3b82f6',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '4px',
                          width: '24px',
                          height: '24px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          flexShrink: 0,
                          transition: 'background-color 0.2s',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
                      >
                        <Check size={14} />
                      </button>
                    )}
                  </motion.div>
                )
              })
            )}
          </div>

          {activities.length > 0 && (
            <div style={{
              padding: '16px',
              borderTop: '1px solid #e5e7eb',
              display: 'flex',
              gap: '8px',
            }}>
              <button
                onClick={handleMarkAllAsRead}
                disabled={unreadCount === 0}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  backgroundColor: '#fff',
                  color: '#374151',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: unreadCount === 0 ? 'not-allowed' : 'pointer',
                  opacity: unreadCount === 0 ? 0.5 : 1,
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  if (unreadCount > 0) e.currentTarget.style.backgroundColor = '#f9fafb'
                }}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff'}
              >
                Mark All Read
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default NotificationsPanel