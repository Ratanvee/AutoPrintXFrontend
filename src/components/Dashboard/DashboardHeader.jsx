"use client"

import React, { useEffect, useState } from "react";
// import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Download, Bell, Mail, Menu } from "lucide-react"
import axios from "axios";
import RecentOrders from "./RecentOrders";
// export const selectedPrinter = null;
import { setSelectedPrinterr } from "../../global";

const DashboardHeader = ({ toggleSidebar, showNotifications, setShowNotifications, unreadCount }) => {
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
      const response = await fetch("http://localhost:5050/status");
      const data = await response.json();
      // console.log("Agent status:", data);
      // if (data.online){
      //   setStatus("🟢 Active");
      //   setColor("green");
      //   setAgentActive(true);

      // }
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
      const response = await fetch("http://localhost:5050/printers");
      const data = await response.json();
      if (data.printers && Array.isArray(data.printers)) {
        setPrinters(data.printers);
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
    }
  }, [agentActive]);


  const [isDownloading, setIsDownloading] = useState(false);
  const [message, setMessage] = useState('');

  // ✅ The specific File ID extracted from your provided URL
  const GOOGLE_DRIVE_FILE_ID = "1cKv4f-tmtZ8rCsp5Wb-59kjpUdSPE38u";
  const FILENAME = "mysetup.exe"; // The target file name

  // The core function to initiate the download
  const handleDownload = () => {
    setIsDownloading(true);
    setMessage(`Preparing to download ${FILENAME}...`);

    // 1. Construct the Google Drive direct download URL.
    // The 'uc?export=download' format forces a direct file download.
    const downloadUrl = `https://drive.google.com/uc?export=download&id=${GOOGLE_DRIVE_FILE_ID}`;

    try {
      // 2. Create a temporary anchor element (<a>)
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = FILENAME; // Suggest the file name

      // 3. Append and click the link to trigger the download
      document.body.appendChild(link);
      link.click();

      // 4. Clean up
      document.body.removeChild(link);

      setMessage(`Download of ${FILENAME} started! Please check your browser's download manager.`);
    } catch (error) {
      console.error("Download failed:", error);
      setMessage("An unexpected error occurred while attempting the download.");
    } finally {
      // Simulate download initiation time
      setTimeout(() => {
        setIsDownloading(false);
      }, 1500);
    }
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
        className="download-btn"
        target="_blank"
      >
        Download Printer Agent
      </button>

      <div className="header-actions">
        {/* Printer select box */}
        <div className="form-group">
          <label htmlFor="printerName">Printer name</label>
          <select
            id="printerName"
            value={selectedPrinter}
            onChange={(e) => { setSelectedPrinter(e.target.value), setSelectedPrinterr(e.target.value)}}
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
                <option key={index} value={printer}>
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
          <img src="https://placehold.co/100x100/0a2463/white?text=A" alt="Admin User" />
        </motion.div>
      </div>
    </header>
  )
}

export default DashboardHeader




// "use client"

// import React, { useEffect, useState, useCallback } from "react";
// import { motion } from "framer-motion"
// import { Search, Bell, Mail, Menu, Zap, Unlink } from "lucide-react"
// // Note: Assuming socket.io-client is installed in your project: npm install socket.io-client
// import io from 'socket.io-client';
// import { setSelectedPrinterr } from "../../global"; // RESOLVED: Removed external dependency to fix compilation error
// import axios from "axios"; // Keeping axios just in case it's used elsewhere

// // --- SOCKET.IO SETUP ---
// const API_URL = 'http://localhost:5050';

// // Initialize the socket client outside the component to keep the connection persistent
// const socket = io(API_URL, {
//   autoConnect: false,
//   reconnection: true,
//   reconnectionAttempts: Infinity,
//   reconnectionDelay: 1000,
// });
// // -----------------------

// // NOTE: If you need the selected printer value in other components, you must pass 
// // a state setter function (like `setSelectedPrinterr`) as a prop to this component.
// // Since the path to "../../global" failed, the functionality tied to setSelectedPrinterr 
// // is temporarily disabled until the correct external function is passed here.

// const DashboardHeader = ({ toggleSidebar, showNotifications, setShowNotifications, unreadCount }) => {
//   const [searchQuery, setSearchQuery] = useState("")
//   const [status, setStatus] = useState("Checking...");
//   const [color, setColor] = useState("gray");
//   const [printers, setPrinters] = useState([]);
//   const [selectedPrinter, setSelectedPrinter] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [agentActive, setAgentActive] = useState(false);
//   const [socketConnected, setSocketConnected] = useState(false); // New state for socket health

//   // Fetch connected printers (This is still done via standard HTTP, triggered on agentActive change)
//   const fetchPrinters = useCallback(async () => {
//     setLoading(true);
//     try {
//       const response = await fetch(`${API_URL}/printers`);
//       const data = await response.json();
//       if (data.printers && Array.isArray(data.printers)) {
//         setPrinters(data.printers);
//         // Auto-select the first printer if none is selected
//         if (!selectedPrinter && data.printers.length > 0) {
//           // setSelectedPrinter(data.printers[0]);
//           // If setSelectedPrinterr was a prop, call it here:
//           // setSelectedPrinterr(data.printers[0]); 
//         }
//       } else {
//         setPrinters([]);
//       }
//     } catch (error) {
//       console.error("Error fetching printers:", error);
//       setPrinters([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [selectedPrinter]);

//   // --- EFFECT: SOCKET.IO CONNECTION AND REAL-TIME LISTENER ---
//   useEffect(() => {
//     // 1. Event Handler for real-time status updates pushed from the server
//     const handleStatusUpdate = (data) => {
//       const { online, message } = data;

//       // 1a. Update state based on the server's push data
//       setStatus(message);
//       setAgentActive(online);

//       // 1b. Determine color based on state and message content
//       let statusColor = "red";
//       if (online) {
//         statusColor = message.toLowerCase().includes('printing') ? "orange" : "green";
//       }
//       setColor(statusColor);
//       setLoading(false); // Finished checking initial status
//     };

//     // 2. Handlers for socket connection health
//     const handleConnect = () => {
//       setSocketConnected(true);
//     };

//     const handleDisconnect = () => {
//       setSocketConnected(false);
//       setAgentActive(false);
//       setStatus("Disconnected");
//       setColor("red");
//       setLoading(false);
//     };

//     // 3. Register listeners
//     socket.on('connect', handleConnect);
//     socket.on('disconnect', handleDisconnect);
//     socket.on('agent_status_update', handleStatusUpdate);

//     // 4. Initiate connection
//     socket.connect();
//     setLoading(true);

//     // 5. Cleanup on unmount
//     return () => {
//       socket.off('connect', handleConnect);
//       socket.off('disconnect', handleDisconnect);
//       socket.off('agent_status_update', handleStatusUpdate);
//       socket.disconnect();
//     };
//   }, []); // Only runs on mount and unmount

//   // --- EFFECT: FETCH PRINTERS WHEN AGENT ACTIVATES ---
//   // This replaces the old polling logic that conditionally fetched printers.
//   useEffect(() => {
//     if (agentActive) {
//       fetchPrinters();
//     } else {
//       setPrinters([]); // Clear printers when agent goes offline
//     }
//   }, [agentActive, fetchPrinters]);

//   const handlePrinterChange = (e) => {
//     const value = e.target.value;
//     setSelectedPrinterr(value);
//     console.log("Selected printer:", value);
//     // Removed call to setSelectedPrinterr(value) to fix the compilation error.
//     // If you need to update global state, ensure you pass the function correctly.
//   }


//   return (
//     <header className="dashboard-header">
//       <style jsx global>{`
//                 /* Basic Tailwind-like classes for demonstration purposes */
//                 .dashboard-header {
//                     display: flex;
//                     justify-content: space-between;
//                     align-items: center;
//                     padding: 16px 24px;
//                     background-color: #ffffff;
//                     border-bottom: 1px solid #e5e7eb;
//                     box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
//                 }
//                 .header-left, .header-actions {
//                     display: flex;
//                     align-items: center;
//                     gap: 16px;
//                 }
//                 .sidebar-toggle-btn {
//                     padding: 8px;
//                     border-radius: 8px;
//                     background: none;
//                     border: none;
//                     cursor: pointer;
//                     transition: transform 0.2s, background-color 0.2s;
//                     color: #4b5563;
//                 }
//                 .sidebar-toggle-btn:hover {
//                     background-color: #f3f4f6;
//                 }
//                 // .header-search {
//                 //     display: flex;
//                 //     align-items: center;
//                 //     background-color: #f9fafb;
//                 //     border-radius: 8px;
//                 //     padding: 8px 12px;
//                 //     border: 1px solid #e5e7eb;
//                 // }
//                 // .header-search input {
//                 //     border: none;
//                 //     background: none;
//                 //     padding-left: 8px;
//                 //     outline: none;
//                 //     width: 300px;
//                 // }
//                 .form-group label {
//                     font-size: 12px;
//                     color: #6b7280;
//                     display: block;
//                     margin-bottom: 4px;
//                 }
//                 .form-group select {
//                     padding: 8px 12px;
//                     border-radius: 6px;
//                     font-size: 14px;
//                     outline: none;
//                     transition: border-color 0.3s, background-color 0.3s;
//                     min-width: 150px;
//                 }
//                 .notification, .message {
//                     position: relative;
//                     padding: 8px;
//                     border-radius: 50%;
//                     cursor: pointer;
//                     transition: transform 0.2s;
//                     color: #4b5563;
//                 }
//                 .badge {
//                     position: absolute;
//                     top: -2px;
//                     right: -2px;
//                     background-color: #ef4444;
//                     color: white;
//                     border-radius: 50%;
//                     padding: 2px 6px;
//                     font-size: 10px;
//                     font-weight: bold;
//                     line-height: 1;
//                     border: 1px solid white;
//                 }
//                 .profile img {
//                     width: 40px;
//                     height: 40px;
//                     border-radius: 50%;
//                     object-fit: cover;
//                     border: 2px solid #6366f1;
//                 }
//                 /* Agent Status Styling */
//                 .agent-status-box {
//                     display: flex;
//                     flex-direction: column;
//                     align-items: flex-start;
//                     padding: 4px 8px;
//                     border-radius: 6px;
//                     font-size: 14px;
//                     font-weight: 500;
//                     transition: all 0.3s;
//                     border: 1px solid;
//                 }
//                 .agent-status-box strong {
//                     font-size: 10px;
//                     font-weight: 600;
//                     text-transform: uppercase;
//                     margin-bottom: 2px;
//                 }
//                 .status-text {
//                     display: flex;
//                     align-items: center;
//                     gap: 4px;
//                 }
                
//             `}</style>
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
//           <Search size={20} className="text-gray-400" />
//           <input
//             type="text"
//             placeholder="Search orders, customers..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//         </div>
//       </div>

//       <div className="header-actions">
//         {/* Printer select box */}
//         <div className="form-group">
//           <label htmlFor="printerName">Select Printer</label>
//           <select
//             id="printerName"
//             value={selectedPrinter}
//             onChange={(e) => {
//               handlePrinterChange(e);
//               setSelectedPrinter(e.target.value);
//             }}
//             disabled={!agentActive || printers.length === 0} // disable select if agent offline or no printers
//             style={{
//               border: `2px solid ${agentActive ? "#4f46e5" : "red"}`,
//               color: agentActive ? "black" : "red",
//               backgroundColor: agentActive ? "white" : "#ffe6e6",
//             }}
//           >
//             {loading && agentActive ? (
//               <option>Loading printers...</option>
//             ) : !agentActive ? (
//               <option>🔴 Agent Offline</option>
//             ) : printers.length > 0 ? (
//               printers.map((printer, index) => (
//                 <option key={index} value={printer}>
//                   {printer}
//                 </option>
//               ))
//             ) : (
//               <option>No printers found</option>
//             )}
//           </select>
//         </div>

//         {/* Real-Time Agent Status Display */}
//         <div
//           className="agent-status-box"
//           style={{
//             borderColor: color === "red" ? "#f87171" : color === "green" ? "#34d399" : color === "orange" ? "#fb923c" : "#9ca3af",
//             backgroundColor: color === "red" ? "#fee2e2" : color === "green" ? "#d1fae5" : color === "orange" ? "#fff7ed" : "#f3f4f6",
//           }}
//         >
//           <strong style={{ color: color === "red" ? "#dc2626" : color === "green" ? "#059669" : color === "orange" ? "#ea580c" : "#6b7280" }}>
//             Printer Agent
//           </strong>
//           <div className="status-text" style={{ color: color === "red" ? "#dc2626" : color === "green" ? "#059669" : color === "orange" ? "#ea580c" : "#6b7280" }}>
//             <Zap size={14} fill={color === "red" ? "#dc2626" : color === "green" ? "#059669" : color === "orange" ? "#ea580c" : "#6b7280"} className="min-w-[14px]" />
//             {status}
//           </div>
//           <div className="status-text text-xs" style={{ color: socketConnected ? "#10b981" : "#ef4444" }}>
//             {socketConnected ? "Socket: Connected" : <><Unlink size={10} className="mr-1" />Socket: Disconnected</>}
//           </div>
//         </div>

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

//         <motion.div className="profile" whileHover={{ scale: 1.05 }}>
//           <img src="https://placehold.co/100x100/0a2463/white?text=A" alt="Admin User" />
//         </motion.div>
//       </div>
//     </header>
//   )
// }

// export default DashboardHeader
