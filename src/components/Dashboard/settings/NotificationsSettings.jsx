import { motion } from "framer-motion"
import { Save } from "lucide-react"

const NotificationsSettings = ({ settings, handleInputChange, handleSave }) => (
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
)

export default NotificationsSettings