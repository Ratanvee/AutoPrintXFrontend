"use client"

import React, { useEffect, useState } from "react";
// import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Download, Bell, Mail, Menu } from "lucide-react"
import axios from "axios";
import RecentOrders from "./RecentOrders";
// export const selectedPrinter = null;
import { setSelectedPrinterr } from "../../global";
// import { checkPrinterAgentStatus } from "./api/endpoints";
import { printDocument, getPrinters, checkPrinterAgentStatus } from "./api/printerAgentapi"


const DashboardHeader = ({ toggleSidebar, showNotifications, setShowNotifications, unreadCount, dashboardData }) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [agentActive, setAgentActive] = useState(false)
  const [agentChecking, setAgentChecking] = useState(true)

  // ── Check agent status ──
  const checkAgent = async () => {
    setAgentChecking(true)
    try {
      const data = await checkPrinterAgentStatus()
      setAgentActive(data?.status === "online")
    } catch {
      setAgentActive(false)
    } finally {
      setAgentChecking(false)
    }
  }

  const agentStatus = agentChecking ? "checking" : agentActive ? "online" : "offline"

  // Poll agent every 5s
  useEffect(() => {
    checkAgent()
    const interval = setInterval(checkAgent, 5000)
    return () => clearInterval(interval)
  }, []);

  const [isDownloading, setIsDownloading] = useState(false);
  const [message, setMessage] = useState('');

  // ✅ The specific File ID extracted from your provided URL
  const GOOGLE_DRIVE_FILE_ID = import.meta.env.VITE_GOOGLE_DRIVE_FILE_ID;
  const FILENAME = "AutoPrintXAgent.exe"; // The target file name
  const File_download_Link = import.meta.env.VITE_Google_drive_download_link;

  // The core function to initiate the download
  const handleDownload = () => {
    setIsDownloading(true);
    setMessage(`Preparing to download ${FILENAME}...`);

    // 1. Construct the Google Drive direct download URL.
    // The 'uc?export=download' format forces a direct file download.
    const downloadUrl = `${File_download_Link}`;

    window.open(downloadUrl, "_blank");
  };



  const statusConfig = {
    online: { color: "#10b981", label: "Online", pulse: true },
    // checking: { color: "#f59e0b", label: "Checking", pulse: false },
    offline: { color: "#ef4444", label: "Offline", pulse: false },
  }

  // Usage: agentStatus = "online" | "checking" | "offline"
  const { color, label, pulse } = statusConfig[agentStatus] ?? statusConfig.offline


  return (
    <header className="dashboard-header">
      <div className="header-left">
        <motion.button
          className="sidebar-toggle-btn"
          onClick={toggleSidebar}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Menu size={20} />
        </motion.button>

        <div className="header-search">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search orders, customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Download Button */}
      <button
        onClick={handleDownload}
        disabled={isDownloading}
        // className="download-btn"
        className="btn-primary btn-download-agent"
        target="_blank"
      >
        Download Printer Agent
      </button>

      <div className="header-actions">
        {/* <div>
          <strong>Printer Agent:</strong>{" "}
          {status === "loading" ? "Checking..." : status.toUpperCase()}
          </div> */}
        {/* Animated dot */}

        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <strong style={{ fontSize: "13px", color: "#374151" }}>Agent:</strong>

          {/* Dot */}
          <div style={{ position: "relative", width: "10px", height: "10px", flexShrink: 0 }}>
            <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: color }} />
            {pulse && (
              <motion.div
                animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                style={{
                  position: "absolute", inset: 0,
                  borderRadius: "50%", background: color,
                }}
              />
            )}
          </div>

          {/* Label */}
          <span style={{ fontSize: "13px", fontWeight: 600, color }}>{label}</span>
        </div>
        {/* <div style={{ fontSize: "12px", color: "#555" }}>
          Last checked: {lastChecked || "--:--:--"}
        </div> */}
        <motion.div
          className="notification"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowNotifications(!showNotifications)}
        >
          <Bell size={20} />
          {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
        </motion.div>

        <motion.div className="message" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Mail size={20} />
          <span className="badge">5</span>
        </motion.div>

        
      </div>
    </header>
  )
}

export default DashboardHeader



