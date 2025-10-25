import { motion } from "framer-motion"
import { Save, CreditCard } from "lucide-react"

const BillingSettings = ({ settings, handleInputChange, handleSave }) => (
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
)

export default BillingSettings