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
import toast from "react-hot-toast"
import { get_dashboard, DashboardSettings, UpdateDashboardSettings, ChangePasswordAPI } from "./api/endpoints"

const SettingsSection = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [showPassword, setShowPassword] = useState(false)
  const [QRData, setQRData] = useState(null)
  const [SomeChange, setSomeChange] = useState(false)
  

  const [settings, setSettings] = useState({
    general: {
      shopName: "",
      email: "",
      phone: "",
      address: "",
      currency: "INR",
      timezone: "Asia/Kolkata",
    },
    profile: {
      fullName: "",
      email: "",
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
    setSomeChange(true)
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }))
  }


  // NEW STATE: Holds the temporary URL for the local image preview
  const [localAvatarUrl, setLocalAvatarUrl] = useState(null);

  // --- NEW: Separate handler for file input ---
  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];

    // 1. Save the File object to state for API/DB upload
    handleInputChange("profile", "avatar", file);

    if (file) {
      // 2. Revoke previous local URL to prevent memory leaks
      if (localAvatarUrl) {
        URL.revokeObjectURL(localAvatarUrl);
      }
      // 3. Create new local URL for preview and save it to state
      const newUrl = URL.createObjectURL(file);
      setLocalAvatarUrl(newUrl);
    } else {
      // If file is cleared
      setLocalAvatarUrl(null);
      handleInputChange("profile", "avatar", null);
    }
  };

  const handleSave = (section) => {
    // console.log(`Saving ${section} settings:`, settings[section])
    setSomeChange(false)
    if (SomeChange){
      if (section === 'security') {
        // Add your security-specific validation here
        data = ChangePasswordAPI(settings[section])
      }
      else {
        // Add your API call here
        UpdateDashboardSettings(section, settings[section])
      }
    } else{
      toast.error("No Changes detected")

    }

    

  }

  const fetchSettings = async () => {
    // setLoading(true)
    try {
      const response = await DashboardSettings()

      // Update settings with fetched data
      setSettings({
        general: {
          shopName: response.settings.general.shopName || "",
          email: response.settings.general.email || "",
          phone: response.settings.general.phone || "",
          address: response.settings.general.address || "",
          currency: response.settings.general.currency || "INR",
          timezone: response.settings.general.timezone || "Asia/Kolkata",
        },
        profile: {
          fullName: response.settings.profile.fullName || "",
          email: response.settings.profile.email || "",
          role: response.settings.profile.role || "Shop Owner",
          avatar: response.settings.profile.avatar || "",
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

      // console.log("✅ Settings loaded:", response.settings)
    } catch (error) {
      console.error("Error fetching settings:", error)
      toast.error("Failed to load settings")
    } finally {
      // setLoading(false)
    }
  }

  useEffect(() => {
    fetchSettings()
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
                    handleProfileImageChange={handleProfileImageChange}
                    isSaving={false}  // You can replace this with actual saving state if needed
                    localAvatarUrl={localAvatarUrl}
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