"use client"

import { use, useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { User, Building, Shield, Bell, CreditCard, Save, Camera, Eye, EyeOff } from "lucide-react"
// import QRCode from "react-qr-code"
import SmartDocXPoster from './QRCodeGenerator'
import { get_dashboard } from "./api/endpoints";
const SettingsSection = () => {
  const [activeTab, setActiveTab] = useState("general")
  const [showPassword, setShowPassword] = useState(false)
  const [settings, setSettings] = useState({
    general: {
      shopName: "SmartDocX Print Shop",
      email: "contact@smartdocx.com",
      phone: "+1 (555) 123-4567",
      address: "123 Printing Street, Document City",
      currency: "USD",
      timezone: "America/New_York",
    },
    profile: {
      fullName: "Admin User",
      email: "admin@smartdocx.com",
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
    { id: "general", label: "General", icon: Building },
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "billing", label: "Billing", icon: CreditCard },
  ]

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
    // Save settings logic here
    console.log(`Saving ${section} settings:`, settings[section])
  }


  const [QRData, setQRData] = useState(null);
  const fetchDashboardData = async () => {
    const data = await get_dashboard();
    setQRData(data);
    // console.log("Fetched Dashboard Data:", data);
  }
  useEffect(() => {
    fetchDashboardData();
  }, []);

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
                    onClick={() => setActiveTab(tab.id)}
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

        {/* Settings Content */}
        <motion.div
          className="settings-content"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <AnimatePresence mode="wait">
            {/* General Settings */}
            {activeTab === "general" && (
              <motion.div
                key="general"
                className="settings-panel"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2>General Settings</h2>
                <form className="settings-form">
                  <div className="form-group">
                    <label htmlFor="shopName">Shop Name</label>
                    <input
                      type="text"
                      id="shopName"
                      value={settings.general.shopName}
                      onChange={(e) => handleInputChange("general", "shopName", e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Shop Email</label>
                    <input
                      type="email"
                      id="email"
                      value={settings.general.email}
                      onChange={(e) => handleInputChange("general", "email", e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Shop Phone</label>
                    <input
                      type="tel"
                      id="phone"
                      value={settings.general.phone}
                      onChange={(e) => handleInputChange("general", "phone", e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="address">Shop Address</label>
                    <textarea
                      id="address"
                      rows="3"
                      value={settings.general.address}
                      onChange={(e) => handleInputChange("general", "address", e.target.value)}
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="currency">Currency</label>
                      <select
                        id="currency"
                        value={settings.general.currency}
                        onChange={(e) => handleInputChange("general", "currency", e.target.value)}
                      >
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="timezone">Timezone</label>
                      <select
                        id="timezone"
                        value={settings.general.timezone}
                        onChange={(e) => handleInputChange("general", "timezone", e.target.value)}
                      >
                        <option value="America/New_York">Eastern Time</option>
                        <option value="America/Chicago">Central Time</option>
                        <option value="America/Denver">Mountain Time</option>
                        <option value="America/Los_Angeles">Pacific Time</option>
                      </select>
                    </div>
                  </div>
                  <motion.button
                    type="button"
                    className="btn-primary"
                    onClick={() => handleSave("general")}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Save size={16} />
                    Save Changes
                  </motion.button>
                </form>
              </motion.div>
            )}

            {/* Profile Settings */}
            {activeTab === "profile" && (
              <motion.div
                key="profile"
                className="settings-panel"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2>Profile Settings</h2>
                <form className="settings-form">
                  <div className="profile-image-section">
                    <div className="profile-image-container">
                      <img src={settings.profile.avatar || "/placeholder.svg"} alt="Profile" />
                      <div className="profile-image-overlay">
                        <label htmlFor="profileImage" className="image-upload-label">
                          <Camera size={20} />
                        </label>
                        <input type="file" id="profileImage" accept="image/*" style={{ display: "none" }} />
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="fullName">Full Name</label>
                    <input
                      type="text"
                      id="fullName"
                      value={settings.profile.fullName}
                      onChange={(e) => handleInputChange("profile", "fullName", e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="profileEmail">Email</label>
                    <input
                      type="email"
                      id="profileEmail"
                      value={settings.profile.email}
                      onChange={(e) => handleInputChange("profile", "email", e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="role">Role</label>
                    <input type="text" id="role" value={settings.profile.role} readOnly />
                  </div>
                  <motion.button
                    type="button"
                    className="btn-primary"
                    onClick={() => handleSave("profile")}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Save size={16} />
                    Update Profile
                  </motion.button>
                </form>
                <SmartDocXPoster value={`${import.meta.env.VITE_BaseURL1}${QRData.user.unique_url}`} ownerName={QRData.user.username} />
              </motion.div>
            )}

            {/* Security Settings */}
            {activeTab === "security" && (
              <motion.div
                key="security"
                className="settings-panel"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2>Security Settings</h2>
                <form className="settings-form">
                  <div className="form-group">
                    <label htmlFor="currentPassword">Current Password</label>
                    <div className="password-input">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="currentPassword"
                        value={settings.security.currentPassword}
                        onChange={(e) => handleInputChange("security", "currentPassword", e.target.value)}
                      />
                      <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="newPassword">New Password</label>
                    <input
                      type="password"
                      id="newPassword"
                      value={settings.security.newPassword}
                      onChange={(e) => handleInputChange("security", "newPassword", e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm New Password</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      value={settings.security.confirmPassword}
                      onChange={(e) => handleInputChange("security", "confirmPassword", e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="toggle-label">
                      <input
                        type="checkbox"
                        checked={settings.security.twoFactor}
                        onChange={(e) => handleInputChange("security", "twoFactor", e.target.checked)}
                      />
                      <span className="toggle-slider"></span>
                      Two-Factor Authentication
                    </label>
                  </div>
                  <motion.button
                    type="button"
                    className="btn-primary"
                    onClick={() => handleSave("security")}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Save size={16} />
                    Update Security Settings
                  </motion.button>
                </form>
              </motion.div>
            )}

            {/* Notifications Settings */}
            {activeTab === "notifications" && (
              <motion.div
                key="notifications"
                className="settings-panel"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2>Notification Settings</h2>
                <form className="settings-form">
                  <div className="notification-group">
                    <h3>Email Notifications</h3>
                    <div className="notification-items">
                      <label className="toggle-label">
                        <input
                          type="checkbox"
                          checked={settings.notifications.emailOrders}
                          onChange={(e) => handleInputChange("notifications", "emailOrders", e.target.checked)}
                        />
                        <span className="toggle-slider"></span>
                        New Orders
                      </label>
                      <label className="toggle-label">
                        <input
                          type="checkbox"
                          checked={settings.notifications.emailCustomers}
                          onChange={(e) => handleInputChange("notifications", "emailCustomers", e.target.checked)}
                        />
                        <span className="toggle-slider"></span>
                        New Customers
                      </label>
                      <label className="toggle-label">
                        <input
                          type="checkbox"
                          checked={settings.notifications.emailReports}
                          onChange={(e) => handleInputChange("notifications", "emailReports", e.target.checked)}
                        />
                        <span className="toggle-slider"></span>
                        Weekly Reports
                      </label>
                    </div>
                  </div>
                  <div className="notification-group">
                    <h3>Push Notifications</h3>
                    <div className="notification-items">
                      <label className="toggle-label">
                        <input
                          type="checkbox"
                          checked={settings.notifications.pushOrders}
                          onChange={(e) => handleInputChange("notifications", "pushOrders", e.target.checked)}
                        />
                        <span className="toggle-slider"></span>
                        New Orders
                      </label>
                      <label className="toggle-label">
                        <input
                          type="checkbox"
                          checked={settings.notifications.pushCustomers}
                          onChange={(e) => handleInputChange("notifications", "pushCustomers", e.target.checked)}
                        />
                        <span className="toggle-slider"></span>
                        New Customers
                      </label>
                      <label className="toggle-label">
                        <input
                          type="checkbox"
                          checked={settings.notifications.pushReports}
                          onChange={(e) => handleInputChange("notifications", "pushReports", e.target.checked)}
                        />
                        <span className="toggle-slider"></span>
                        System Updates
                      </label>
                    </div>
                  </div>
                  <motion.button
                    type="button"
                    className="btn-primary"
                    onClick={() => handleSave("notifications")}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Save size={16} />
                    Save Preferences
                  </motion.button>
                </form>
              </motion.div>
            )}

            {/* Billing Settings */}
            {activeTab === "billing" && (
              <motion.div
                key="billing"
                className="settings-panel"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2>Billing Settings</h2>
                <form className="settings-form">
                  <div className="form-group">
                    <label htmlFor="plan">Current Plan</label>
                    <input type="text" id="plan" value={settings.billing.plan} readOnly />
                  </div>
                  <div className="form-group">
                    <label htmlFor="billingCycle">Billing Cycle</label>
                    <select
                      id="billingCycle"
                      value={settings.billing.billingCycle}
                      onChange={(e) => handleInputChange("billing", "billingCycle", e.target.value)}
                    >
                      <option value="monthly">Monthly</option>
                      <option value="annually">Annually (Save 15%)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Payment Method</label>
                    <div className="payment-method-display">
                      <CreditCard size={20} />
                      <span>{settings.billing.paymentMethod}</span>
                      <button type="button" className="btn-link">
                        Change
                      </button>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="billingAddress">Billing Address</label>
                    <textarea
                      id="billingAddress"
                      rows="3"
                      value={settings.billing.billingAddress}
                      onChange={(e) => handleInputChange("billing", "billingAddress", e.target.value)}
                    />
                  </div>
                  <motion.button
                    type="button"
                    className="btn-primary"
                    onClick={() => handleSave("billing")}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Save size={16} />
                    Update Billing Information
                  </motion.button>
                </form>
              </motion.div>
            )}

            {/* QR code generator */}
            {/* {activeTab === "QR" && (
              <motion.div
                key="QR"
                className="settings-panel"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2>QR Code Generator</h2>
                <QRCode value="https://smartdocx.com" size={200} />
              </motion.div>
            )} */}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default SettingsSection
