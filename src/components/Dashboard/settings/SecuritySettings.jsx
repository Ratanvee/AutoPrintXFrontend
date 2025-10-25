import { motion } from "framer-motion"
import { Save, Eye, EyeOff } from "lucide-react"

const SecuritySettings = ({ settings, handleInputChange, handleSave, showPassword, setShowPassword }) => (
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
)

export default SecuritySettings