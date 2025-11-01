import { motion } from "framer-motion"
import { Save, Camera } from "lucide-react"
import AutoPrintXPoster from '../QRCodeGenerator'
import { getQRData } from "../../../global"

const ProfileSettings = ({
    settings,
    handleInputChange,
    handleSave,
    handleProfileImageChange,
    isSaving,
    localAvatarUrl
}) => {
    // ✅ Safe access with optional chaining and fallbacks
    const firstName = settings?.profile?.firstName || settings?.profile?.fullName
    const email = settings?.profile?.email || ""
    const role = settings?.profile?.role || "Shop Owner"
    const avatar = settings?.profile?.avatar || ""

    // ✅ Generate placeholder with safe fallback
    const getInitial = () => {
        if (firstName && firstName.length > 0) {
            return firstName.charAt(0).toUpperCase()
        }
        return "U" // Default initial
    }

    // ✅ Determine image source with proper fallbacks
    const imageSrc = localAvatarUrl
        || avatar
        || `https://placehold.co/120x120/4f46e5/ffffff?text=${getInitial()}`

    // ✅ Get QR data safely
    const getQRDataSafely = () => {
        try {
            const qrData = getQRData()
            return {
                unique_url: qrData?.unique_url || "",
                username: qrData?.username || firstName
            }
        } catch (error) {
            console.error("Error getting QR data:", error)
            return {
                unique_url: "",
                username: firstName
            }
        }
    }

    const qrData = getQRDataSafely()

    return (
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
                        <img
                            src={imageSrc}
                            alt="Profile Avatar"
                            className="w-full h-full object-cover rounded-full border-4 border-indigo-500 shadow-md transition duration-300"
                            onError={(e) => {
                                e.target.onerror = null
                                e.target.src = `https://placehold.co/120x120/4f46e5/ffffff?text=${getInitial()}`
                            }}
                        />
                        <div className="profile-image-overlay">
                            <label htmlFor="profileImage" className="image-upload-label">
                                <Camera size={20} />
                            </label>
                            <input
                                type="file"
                                id="profileImage"
                                accept="image/*"
                                style={{ display: "none" }}
                                onChange={handleProfileImageChange}
                                disabled={isSaving}
                                // placeholder="AutoPrintX Print Shop"
                            />
                        </div>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="firstName">Full Name</label>
                    <input
                        type="text"
                        id="firstName"
                        value={firstName}
                        onChange={(e) => handleInputChange("profile", "firstName", e.target.value)}
                        placeholder="Enter your full name"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="profileEmail">Email</label>
                    <input
                        type="email"
                        id="profileEmail"
                        value={email}
                        onChange={(e) => handleInputChange("profile", "email", e.target.value)}
                        placeholder="Enter your email"
                        disabled
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="role">Role</label>
                    <input
                        type="text"
                        id="role"
                        value={role}
                        readOnly
                        className="readonly-input"
                    />
                </div>

                <motion.button
                    type="button"
                    className="btn-primary"
                    onClick={() => handleSave("profile")}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={isSaving}
                >
                    <Save size={16} />
                    {isSaving ? "Updating..." : "Update Profile"}
                </motion.button>
            </form>

            {qrData.unique_url && (
                <AutoPrintXPoster
                    value={`${import.meta.env.VITE_QRCodeURL}upload/${qrData.unique_url}`}
                    ownerName={qrData.username}
                />
            )}
        </motion.div>
    )
}

export default ProfileSettings