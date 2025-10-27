import { motion } from "framer-motion"
import { Save } from "lucide-react"

const GeneralSettings = ({ settings, handleInputChange, handleSave }) => (
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
                        <option value="INR">INR (₹)</option>
                        {/* <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option> */}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="timezone">Timezone</label>
                    <select
                        id="timezone"
                        value={settings.general.timezone}
                        onChange={(e) => handleInputChange("general", "timezone", e.target.value)}
                    >
                        <option value="Asia/Kolkata">India Standard Time</option>
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
)

export default GeneralSettings