import { motion } from "framer-motion"
import { Save, Camera } from "lucide-react"
import AutoPrintXPoster from '../QRCodeGenerator'
import { getQRData } from "../../../global"

const ProfileSettings = ({ settings, handleInputChange, handleSave, handleProfileImageChange, isSaving, localAvatarUrl }) => {

    const imageSrc = localAvatarUrl
        ? localAvatarUrl
        : settings.profile.avatarUrl
            ? settings.profile.avatarUrl
            : `https://placehold.co/120x120/4f46e5/ffffff?text=${settings.profile.fullName.charAt(0)}`;


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
                        {/* <img src={imageSrc || "/placeholder.svg"} alt="Profile" /> */}
                        <img
                            src={imageSrc}
                            alt="Profile Avatar"
                            className="w-full h-full object-cover rounded-full border-4 border-indigo-500 shadow-md transition duration-300"
                            // Fallback for missing images
                            onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/120x120/4f46e5/ffffff?text=${settings.profile.ownerName.charAt(0)}`; }}
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
                            />
                        
                            {/* <input type="file" id="profileImage" accept="image/*" style={{ display: "none" }} onChange={handleProfileImageChange} /> */}
                            
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
    );
};

export default ProfileSettings