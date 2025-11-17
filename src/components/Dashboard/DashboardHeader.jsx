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
  const [status, setStatus] = useState("Checking...");
  const [color, setColor] = useState("gray");
  const [printers, setPrinters] = useState([]);
  const [selectedPrinter, setSelectedPrinter] = useState("");
  const [loading, setLoading] = useState(true);
  const [agentActive, setAgentActive] = useState(false);

  // Check printer agent status
  const checkStatus = async () => {
    try {
      const data = await checkPrinterAgentStatus();
      if (data.status === "online") {
        setStatus("🟢 Active");
        setColor("green");
        setAgentActive(true);
      }
      else {
        setStatus("🔴 Offline");
        setColor("red");
        setAgentActive(false);
      }
    } catch (err) {
      setStatus("🔴 Offline");
      setColor("red");
      setAgentActive(false);
    }
  };

  // Fetch connected printers
  const fetchPrinters = async () => {
    setLoading(true);
    try {
      // const response = await fetch("http://localhost:5050/printers");
      // const data = await response.json();
      const data = await getPrinters();
      if (data && Array.isArray(data)) {
        setPrinters(data);
      } else {
        setPrinters([]);
      }
    } catch (error) {
      console.error("Error fetching printers:", error);
      setPrinters([]);
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh agent + printers every 5s
  useEffect(() => {
    const checkAndFetch = async () => {
      await checkStatus();
      // if (agentActive) await fetchPrinters(); // fetch only if active
    };

    checkAndFetch();
    const interval = setInterval(checkAndFetch, 5000);
    return () => clearInterval(interval);
  }, [agentActive]);

  // Fetch printers immediately when agent becomes active
  useEffect(() => {
    if (agentActive) {
      fetchPrinters();
      // console.log("these are printers : ", printers )
    }
  }, [agentActive]);


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
        {/* Printer select box */}
        <div className="form-group1">
          {/* <label htmlFor="printerName">Printer name</label> */}
          <select
            id="printerName"
            className="status-filter"
            value={selectedPrinter}
            onChange={(e) => { setSelectedPrinter(e.target.value), setSelectedPrinterr(e.target.value) }}
            disabled={!agentActive} // disable select if agent offline
            style={{
              border: `2px solid ${agentActive ? "#ccc" : "red"}`,
              color: agentActive ? "black" : "red",
              backgroundColor: agentActive ? "white" : "#ffe6e6",
            }}
          >

            {loading ? (
              <option>Loading printers...</option>
            ) : !agentActive ? (
              <option>🔴 Offline</option>
            ) : printers.length > 0 ? (
              printers.map((printer, index) => (
                <option key={1}>Select Printer Here</option>,
                <option key={index+1} value={printer}>
                  {printer}
                </option>
              ))
            ) : (
              <option>No printers found</option>
            )}
          </select>

          {/* Pass selectedPrinter to RecentOrders
          <RecentOrders selectedPrinter={selectedPrinter} /> */}
        </div>
        <div>
          <strong>Printer Agent:</strong>{" "}
          {status === "loading" ? "Checking..." : status.toUpperCase()}
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

        <motion.div className="profile" whileHover={{ scale: 1.05 }}>
          {/* <img src="https://placehold.co/100x100/0a2463/white?text=A" alt="Admin User" /> */}
          <img src={dashboardData && dashboardData.user ? dashboardData.user.shop_image : "https://placehold.co/100x100/0a2463/white?text=A"} alt="" onError={(e) => {
            e.target.onerror = null
            e.target.src = `https://placehold.co/120x120/4f46e5/ffffff?text=U`
          }} />

        </motion.div>
      </div>
    </header>
  )
}

export default DashboardHeader



