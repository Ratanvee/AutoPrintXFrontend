// "use client"

// import React, { useEffect, useState } from "react";
// // import { useState } from "react"
// import { motion } from "framer-motion"
// import { Search, Download, Bell, Mail, Menu } from "lucide-react"
// import axios from "axios";
// import RecentOrders from "./RecentOrders";
// // export const selectedPrinter = null;
// import { setSelectedPrinterr } from "../../global";
// // import { checkPrinterAgentStatus } from "./api/endpoints";
// import { printDocument, getPrinters, checkPrinterAgentStatus } from "./api/printerAgentapi"
// import { toast } from 'react-hot-toast'


// const DashboardHeader = ({ toggleSidebar, showNotifications, setShowNotifications, unreadCount, dashboardData }) => {
//   const [searchQuery, setSearchQuery] = useState("")
//   const [agentActive, setAgentActive] = useState(false)
//   const [agentChecking, setAgentChecking] = useState(true)

//   // ── Check agent status ──
//   const checkAgent = async () => {
//     setAgentChecking(true)
//     try {
//       const data = await checkPrinterAgentStatus()
//       setAgentActive(data?.status === "online")
//       if (data?.version !== import.meta.env.VITE_AGENT_VERSION) {
//         console.warn(`Agent version mismatch: Expected ${import.meta.env.VITE_AGENT_VERSION}, but got ${data?.version}`)
//         // toast.error(`Agent version mismatch: Expected ${import.meta.env.VITE_AGENT_VERSION}, but got ${data?.version}. Please update the agent.`)
//       }
//     } catch {
//       setAgentActive(false)
//     } finally {
//       setAgentChecking(false)
//     }
//   }

//   const agentStatus = agentChecking ? "checking" : agentActive ? "online" : "offline"

//   // Poll agent every 5s
//   useEffect(() => {
//     checkAgent()
//     const interval = setInterval(checkAgent, 5000)
//     return () => clearInterval(interval)
//   }, []);

//   const [isDownloading, setIsDownloading] = useState(false);
//   const [message, setMessage] = useState('');

//   // ✅ The specific File ID extracted from your provided URL
//   const GOOGLE_DRIVE_FILE_ID = import.meta.env.VITE_GOOGLE_DRIVE_FILE_ID;
//   const FILENAME = "AutoPrintXAgent.exe"; // The target file name
//   const File_download_Link = import.meta.env.VITE_Google_drive_download_link;

//   // The core function to initiate the download
//   const handleDownload = () => {
//     setIsDownloading(true);
//     setMessage(`Preparing to download ${FILENAME}...`);

//     // 1. Construct the Google Drive direct download URL.
//     // The 'uc?export=download' format forces a direct file download.
//     const downloadUrl = `${File_download_Link}`;

//     window.open(downloadUrl, "_blank");
//   };



//   const statusConfig = {
//     online: { color: "#10b981", label: "Online", pulse: true },
//     // checking: { color: "#f59e0b", label: "Checking", pulse: false },
//     offline: { color: "#ef4444", label: "Offline", pulse: false },
//   }

//   // Usage: agentStatus = "online" | "checking" | "offline"
//   const { color, label, pulse } = statusConfig[agentStatus] ?? statusConfig.offline


//   return (
//     <header className="dashboard-header">
//       <div className="header-left">
//         <motion.button
//           className="sidebar-toggle-btn"
//           onClick={toggleSidebar}
//           whileHover={{ scale: 1.1 }}
//           whileTap={{ scale: 0.9 }}
//         >
//           <Menu size={20} />
//         </motion.button>

//         <div className="header-search">
//           <Search size={20} />
//           <input
//             type="text"
//             placeholder="Search orders, customers..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//         </div>
//       </div>

//       {/* Download Button */}
//       <button
//         onClick={handleDownload}
//         disabled={isDownloading}
//         // className="download-btn"
//         className="btn-primary btn-download-agent"
//         target="_blank"
//       >
//         Download Printer Agent
//       </button>

//       <div className="header-actions">
//         {/* <div>
//           <strong>Printer Agent:</strong>{" "}
//           {status === "loading" ? "Checking..." : status.toUpperCase()}
//           </div> */}
//         {/* Animated dot */}

//         <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
//           <strong style={{ fontSize: "13px", color: "#374151" }}>Agent:</strong>

//           {/* Dot */}
//           <div style={{ position: "relative", width: "10px", height: "10px", flexShrink: 0 }}>
//             <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: color }} />
//             {pulse && (
//               <motion.div
//                 animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
//                 transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
//                 style={{
//                   position: "absolute", inset: 0,
//                   borderRadius: "50%", background: color,
//                 }}
//               />
//             )}
//           </div>

//           {/* Label */}
//           <span style={{ fontSize: "13px", fontWeight: 600, color }}>{label}</span>
//         </div>
//         {/* <div style={{ fontSize: "12px", color: "#555" }}>
//           Last checked: {lastChecked || "--:--:--"}
//         </div> */}
//         <motion.div
//           className="notification"
//           whileHover={{ scale: 1.1 }}
//           whileTap={{ scale: 0.9 }}
//           onClick={() => setShowNotifications(!showNotifications)}
//         >
//           <Bell size={20} />
//           {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
//         </motion.div>

//         <motion.div className="message" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
//           <Mail size={20} />
//           <span className="badge">5</span>
//         </motion.div>


//       </div>
//     </header>
//   )
// }

// export default DashboardHeader





"use client"

import React, { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Bell, Mail, Menu, Download, X, CheckCircle, Zap, Shield, Printer, RefreshCw, Star } from "lucide-react"
import { setSelectedPrinterr } from "../../global"
import { checkPrinterAgentStatus } from "./api/printerAgentapi"
import { toast } from "react-hot-toast"
import axios from "axios";

// ── Update Popup ──────────────────────────────────────────────
const UpdatePopup = ({ currentVersion, latestVersion, onClose, onDownload }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 9999, padding: 16,
    }}
    onClick={onClose}
  >
    <motion.div
      initial={{ scale: 0.9, y: 20 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.9, y: 20 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      onClick={e => e.stopPropagation()}
      style={{
        background: "#fff", borderRadius: 16, width: "100%", maxWidth: 460,
        boxShadow: "0 24px 60px rgba(0,0,0,0.18)", overflow: "hidden",
      }}
    >
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #6366f1, #4f46e5)", padding: "22px 24px", position: "relative" }}>
        <button onClick={onClose} style={{ position: "absolute", top: 14, right: 14, background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 6, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff" }}>
          <X size={15} />
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Printer size={22} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", marginBottom: 2 }}>Update available</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>AutoPrintX Agent</div>
          </div>
        </div>

        {/* Version badges */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 14 }}>
          <span style={{ background: "rgba(255,255,255,0.15)", color: "#fff", fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 20 }}>
            Current: {currentVersion || "Unknown"}
          </span>
          <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 14 }}>→</span>
          <span style={{ background: "rgba(255,255,255,0.9)", color: "#4f46e5", fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 20 }}>
            Latest: {latestVersion}
          </span>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "20px 24px" }}>
        {/* Team & description */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 4, textTransform: "uppercase", letterSpacing: ".5px" }}>About this release</div>
          <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.6, margin: 0 }}>
            AutoPrintX Agent {latestVersion} brings improved print stability, faster file processing, and better compatibility with Windows 11. Developed by the AutoPrintX team.
          </p>
        </div>

        {/* Features */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 8, textTransform: "uppercase", letterSpacing: ".5px" }}>What's new</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            {[
              { icon: Zap, color: "#f59e0b", text: "2× faster file download & print pipeline" },
              { icon: Shield, color: "#10b981", text: "Improved error handling & auto-recovery" },
              { icon: RefreshCw, color: "#6366f1", text: "Auto-reconnect when internet drops" },
              { icon: CheckCircle, color: "#10b981", text: "Fixed paper jam detection on HP printers" },
              { icon: Star, color: "#f59e0b", text: "Live CPU & RAM reporting to dashboard" },
            ].map(({ icon: Icon, color, text }, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 24, height: 24, borderRadius: 6, background: color + "18", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon size={13} color={color} />
                </div>
                <span style={{ fontSize: 12, color: "#374151" }}>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div style={{ background: "#f9fafb", borderRadius: 8, padding: "10px 12px", marginBottom: 20, display: "flex", gap: 10, alignItems: "center" }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#6366f1", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>AP</div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#111827" }}>AutoPrintX Engineering</div>
            <div style={{ fontSize: 11, color: "#9ca3af" }}>Released {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, padding: "10px", borderRadius: 8, border: "0.5px solid #e5e7eb", background: "#f9fafb", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#6b7280" }}>
            Remind later
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={onDownload}
            style={{ flex: 2, padding: "10px", borderRadius: 8, background: "linear-gradient(135deg,#6366f1,#4f46e5)", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
          >
            <Download size={15} /> Download {latestVersion}
          </motion.button>
        </div>
      </div>
    </motion.div>
  </motion.div>
)

// ── Main Component ────────────────────────────────────────────
const DashboardHeader = ({ toggleSidebar, showNotifications, setShowNotifications, unreadCount, dashboardData }) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [agentActive, setAgentActive] = useState(false)
  const [agentChecking, setAgentChecking] = useState(true)
  const [agentVersion, setAgentVersion] = useState(null)   // version from live agent
  const [showUpdatePopup, setShowUpdatePopup] = useState(false)
  const dismissedRef = React.useRef(false)  // tracks if user dismissed this session

  const EXPECTED_VERSION = import.meta.env.VITE_AGENT_VERSION   // e.g. "v1.4.2"
  const FILENAME = "AutoPrintX-Agent-Setup.exe"

  // ── Check agent status + version ──
  const checkAgent = async () => {
    setAgentChecking(true)
    try {
      const data = await checkPrinterAgentStatus()
      const isOnline = data?.status === "online"
      const ver = data?.version || null

      setAgentActive(isOnline)
      // setAgentVersion(ver)

      // Version mismatch — show update popup once
      // if (isOnline && ver && EXPECTED_VERSION && ver !== EXPECTED_VERSION) {
      //   setShowUpdatePopup(true)
      //   toast.error(
      //     `Agent outdated: ${ver} → ${EXPECTED_VERSION}`,
      //     { duration: 4000, position: "top-right" }
      //   )
      // }
    } catch {
      setAgentActive(false)
      setAgentVersion(null)
    } finally {
      setAgentChecking(false)
    }
  }

  // Check agent version 
  const checkAgentVersion = async () => {
    try {
      const data = await checkPrinterAgentStatus()
      const isOnline = data?.status === "online"
      const ver = data?.version || null

      setAgentVersion(ver)
      // Version mismatch — show update popup once
      if (isOnline && ver && EXPECTED_VERSION && ver !== EXPECTED_VERSION) {
        setShowUpdatePopup(true)
        toast.error(
          `Agent outdated: ${ver} → ${EXPECTED_VERSION}`,
          { duration: 4000, position: "top-right" }
        )
      }
    } catch {
      setAgentVersion(null)
    }
  }

  useEffect(() => {
    checkAgentVersion()
  }, [])

  // Poll every 5s
  useEffect(() => {
    checkAgent()
    const interval = setInterval(checkAgent, 10000)
    return () => clearInterval(interval)
  }, [])

  const agentStatus = agentChecking ? "checking" : agentActive ? "online" : "offline"
  const versionMismatch = agentActive && agentVersion && agentVersion !== EXPECTED_VERSION
  const showDownload = !agentActive || versionMismatch  // show download if offline OR outdated

  const statusConfig = {
    online: { color: "#10b981", label: "Online", pulse: true },
    // checking: { color: "#f59e0b", label: "Checking", pulse: true },
    offline: { color: "#ef4444", label: "Offline", pulse: false },
  }
  const { color, label, pulse } = statusConfig[agentStatus] ?? statusConfig.offline

  const handleDownload = () => {
    // const url = `https://github.com/Ratanvee/AutoPrintXAgent/releases/download/v${import.meta.env.VITE_AGENT_VERSION}/AutoPrintX-Agent-Setup.exe`;
    const url = `https://github.com/Ratanvee/AutoPrintX-Agent-Releases/releases/download/v${import.meta.env.VITE_AGENT_VERSION}/AutoPrintX-Agent-SetupV2.exe`;
    // https://github.com/Ratanvee/AutoPrintX-Agent-Releases/releases/download/v2.0.0/AutoPrintX-Agent-SetupV2.exe
    console.log(url);
    console.log(import.meta.env.VITE_BaseURL1);

    window.open(url, "_self");
    toast.success(`Downloading ${FILENAME}...`, { duration: 3000 })
    setShowUpdatePopup(false)
  }

  return (
    <>
      <header className="dashboard-header">
        <div className="header-left">
          <motion.button className="sidebar-toggle-btn" onClick={toggleSidebar} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Menu size={20} />
          </motion.button>
          <div className="header-search">
            <Search size={20} />
            <input type="text" placeholder="Search orders, customers..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
        </div>

        <div className="header-actions">
          {/* ── Agent status indicator ── */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <strong style={{ fontSize: 13, color: "#374151" }}>Agent:</strong>
            <div style={{ position: "relative", width: 10, height: 10, flexShrink: 0 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: color }} />
              {pulse && (
                <motion.div
                  animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  style={{ position: "absolute", inset: 0, borderRadius: "50%", background: color }}
                />
              )}
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, color }}>{label}</span>
            {/* Version tag */}
            {agentVersion && (
              <span style={{
                fontSize: 11, fontWeight: 600,
                background: versionMismatch ? "#fee2e2" : "#f0fdf4",
                color: versionMismatch ? "#991b1b" : "#166534",
                padding: "1px 7px", borderRadius: 20, cursor: versionMismatch ? "pointer" : "default"
              }}
                onClick={() => versionMismatch && setShowUpdatePopup(true)}
                title={versionMismatch ? `Click to update — expected ${EXPECTED_VERSION}` : "Up to date"}
              >
                {agentVersion}
              </span>
            )}
          </div>

          {/* ── Download / Update button — shown only when needed ── */}
          <AnimatePresence>
            {showDownload && (
              <motion.button
                key="dl-btn"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={() => versionMismatch ? setShowUpdatePopup(true) : handleDownload()}
                className="btn-primary btn-download-agent"
                style={{
                  display: "flex", alignItems: "center", gap: 6, fontSize: 13,
                  background: versionMismatch
                    ? "linear-gradient(135deg,#f59e0b,#d97706)"
                    : "linear-gradient(135deg,#6366f1,#4f46e5)"
                }}
              >
                <Download size={14} />
                {versionMismatch ? "Update Agent" : "Download Agent"}
              </motion.button>
            )}
          </AnimatePresence>
          {/* <button
            onClick={() => {
              console.log("clicked");
              handleDownload();
            }}
          >
            Download
          </button> */}


          {/* Notifications */}
          <motion.div className="notification" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setShowNotifications(!showNotifications)}>
            <Bell size={20} />
            {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
          </motion.div>

          <motion.div className="message" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Mail size={20} />
            <span className="badge">5</span>
          </motion.div>

          <motion.div className="profile" whileHover={{ scale: 1.05 }}>
            <img
              src={dashboardData?.user?.shop_image || "https://placehold.co/100x100/0a2463/white?text=A"}
              alt="Admin"
            />
          </motion.div>
        </div>
      </header>

      {/* ── Update Popup ── */}
      <AnimatePresence>
        {showUpdatePopup && (
          <UpdatePopup
            currentVersion={agentVersion}
            latestVersion={EXPECTED_VERSION}
            onClose={() => setShowUpdatePopup(false)}
            onDownload={handleDownload}
          />
        )}
      </AnimatePresence>
    </>
  )
}

export default DashboardHeader