"use client"

import { useState, useEffect } from "react"
import { Routes, Route, useNavigate, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { User, Building, Shield, Bell, CreditCard } from "lucide-react"

// Import individual setting components
import GeneralSettings from "./settings/GeneralSettings"
import ProfileSettings from "./settings/ProfileSettings"
import SecuritySettings from "./settings/SecuritySettings"
import NotificationsSettings from "./settings/NotificationsSettings"
import BillingSettings from "./settings/BillingSettings"

import { get_dashboard } from "./api/endpoints"

const SettingsSection = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [showPassword, setShowPassword] = useState(false)
  const [QRData, setQRData] = useState(null)

  const [settings, setSettings] = useState({
    general: {
      shopName: "AutoPrintX Print Shop",
      email: "contact@autoprintx.com",
      phone: "+1 (555) 123-4567",
      address: "123 Printing Street, Document City",
      currency: "USD",
      timezone: "America/New_York",
    },
    profile: {
      fullName: "Admin User",
      email: "admin@autoprintx.com",
      role: "Shop Owner",
      avatar: "https://placehold.co/150x150/0a2463/white?text=A",
    },
    security: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      twoFactor: false,
    },
    notifications: {
      emailOrders: true,
      emailCustomers: true,
      emailReports: false,
      pushOrders: true,
      pushCustomers: false,
      pushReports: true,
    },
    billing: {
      plan: "Professional Plan - $79/month",
      billingCycle: "monthly",
      paymentMethod: "Visa ending in 4242",
      billingAddress: "123 Printing Street, Document City",
    },
  })

  const tabs = [
    { id: "general", label: "General", icon: Building, path: "/dashboard/settings" },
    { id: "profile", label: "Profile", icon: User, path: "/dashboard/settings/profile" },
    { id: "security", label: "Security", icon: Shield, path: "/dashboard/settings/security" },
    { id: "notifications", label: "Notifications", icon: Bell, path: "/dashboard/settings/notifications" },
    { id: "billing", label: "Billing", icon: CreditCard, path: "/dashboard/settings/billing" },
  ]

  // Determine active tab based on current route
  const getActiveTab = () => {
    const path = location.pathname
    if (path.includes('/profile')) return 'profile'
    if (path.includes('/security')) return 'security'
    if (path.includes('/notifications')) return 'notifications'
    if (path.includes('/billing')) return 'billing'
    return 'general'
  }

  const activeTab = getActiveTab()

  const handleInputChange = (section, field, value) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }))
  }

  const handleSave = (section) => {
    console.log(`Saving ${section} settings:`, settings[section])
    // Add your API call here
  }

  const fetchDashboardData = async () => {
    const data = await get_dashboard()
    setQRData(data)
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  return (
    <motion.div
      className="settings-section"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="page-header">
        <div className="header-left">
          <h1>Settings</h1>
          <p>Manage your account and application preferences</p>
        </div>
      </div>

      <div className="settings-container">
        {/* Settings Sidebar */}
        <motion.div
          className="settings-sidebar"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <ul>
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <li key={tab.id} className={activeTab === tab.id ? "active" : ""}>
                  <motion.button
                    onClick={() => navigate(tab.path)}
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Icon size={18} />
                    <span>{tab.label}</span>
                  </motion.button>
                </li>
              )
            })}
          </ul>
        </motion.div>

        {/* Settings Content with Routes */}
        <motion.div
          className="settings-content"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <AnimatePresence mode="wait">
            <Routes>
              <Route
                path="/"
                element={
                  <GeneralSettings
                    settings={settings}
                    handleInputChange={handleInputChange}
                    handleSave={handleSave}
                  />
                }
              />
              <Route
                path="/profile"
                element={
                  <ProfileSettings
                    settings={settings}
                    handleInputChange={handleInputChange}
                    handleSave={handleSave}
                  />
                }
              />
              <Route
                path="/security"
                element={
                  <SecuritySettings
                    settings={settings}
                    handleInputChange={handleInputChange}
                    handleSave={handleSave}
                    showPassword={showPassword}
                    setShowPassword={setShowPassword}
                  />
                }
              />
              <Route
                path="/notifications"
                element={
                  <NotificationsSettings
                    settings={settings}
                    handleInputChange={handleInputChange}
                    handleSave={handleSave}
                  />
                }
              />
              <Route
                path="/billing"
                element={
                  <BillingSettings
                    settings={settings}
                    handleInputChange={handleInputChange}
                    handleSave={handleSave}
                  />
                }
              />
            </Routes>
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default SettingsSection