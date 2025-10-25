import { motion } from "framer-motion"
import { Save, Camera } from "lucide-react"
import AutoPrintXPoster from '../QRCodeGenerator'
import { getQRData } from "../../../global"

const ProfileSettings = ({ settings, handleInputChange, handleSave }) => (
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
        <AutoPrintXPoster
            value={`${import.meta.env.VITE_QRCodeURL}upload/${getQRData().unique_url}`}
            ownerName={getQRData().username}
        />
    </motion.div>
)

export default ProfileSettings