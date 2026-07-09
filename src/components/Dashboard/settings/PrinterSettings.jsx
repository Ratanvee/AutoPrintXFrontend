import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Save, Printer, Palette, FileText, Maximize2, Settings, AlertCircle, RefreshCw } from "lucide-react"
import { getPrinters, checkPrinterAgentStatus } from "../api/printerAgentapi"
import toast from "react-hot-toast"

const assignmentConfig = [
    { key: "colorPrinting", label: "Color Printing", icon: Palette, color: "#6366f1" },
    { key: "bwPrinting", label: "Black & White Printing", icon: FileText, color: "#374151" },
    { key: "largeFiles", label: "Large Files (50+ pages)", icon: Maximize2, color: "#f59e0b" },
    { key: "smallFiles", label: "Small Files (<10 pages)", icon: FileText, color: "#10b981" },
    { key: "photosPrinting", label: "Photo Printing", icon: Palette, color: "#ec4899" },
    { key: "documentPrinting", label: "Document Printing", icon: FileText, color: "#3b82f6" },
    { key: "urgentJobs", label: "Urgent Jobs", icon: Settings, color: "#ef4444" },
    { key: "bulkJobs", label: "Bulk / Large Orders", icon: Printer, color: "#8b5cf6" },
]

const PrinterSettings = ({  }) => {
    const [agentActive, setAgentActive] = useState(false)
    const [agentChecking, setAgentChecking] = useState(true)
    const [printers, setPrinters] = useState([])
    const [loadingPrinters, setLoadingPrinters] = useState(false)
    const [assignments, setAssignments] = useState({
        colorPrinting: "",
        bwPrinting: "",
        largeFiles: "",
        smallFiles: "",
        photosPrinting: "",
        documentPrinting: "",
        urgentJobs: "",
        bulkJobs: "",
    })


    // ── save assignments to localStorage when click save ──
    const handleSave = () => {
        // localStorage.setItem("printerAssignments", JSON.stringify(assignments))
        localStorage.setItem("printerJobRouting", JSON.stringify(assignments))
        toast.success("Printer settings saved!", { duration: 3000, position: "bottom-right" })
        // if (section === "printer") {
        //     return
        // }

        // show toast notification in left bottom corner
        // toast.success("Printer assignments saved successfully!", {
        //     duration: 3000, position: "bottom-right"
        // })
    }

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

    // ── Fetch printers from agent ──
    const fetchPrinters = async () => {
        setLoadingPrinters(true)
        try {
            const data = await getPrinters()
            const list = Array.isArray(data) ? data : []
            setPrinters(list)
            // Pre-fill assignments with first printer
            if (list.length > 0) {
                setAssignments(prev => {
                    const updated = { ...prev }
                    Object.keys(updated).forEach(k => { if (!updated[k]) updated[k] = list[0] })
                    return updated
                })
            }
        } catch {
            setPrinters([])
        } finally {
            setLoadingPrinters(false)
        }
    }

    // Poll agent every 5s
    useEffect(() => {
        checkAgent()
        const interval = setInterval(checkAgent, 5000)
        return () => clearInterval(interval)
    }, [])

    // Load saved printer assignments from localStorage
    useEffect(() => {
        const savedAssignments = localStorage.getItem("printerJobRouting");

        if (savedAssignments) {
            try {
                setAssignments(JSON.parse(savedAssignments));
            } catch (err) {
                console.error("Failed to parse saved printer routing:", err);
            }
        }
    }, []);

    // Fetch printers when agent comes online
    useEffect(() => {
        if (agentActive) fetchPrinters()
        else setPrinters([])
    }, [agentActive])

    const agentStatus = agentChecking ? "checking" : agentActive ? "online" : "offline"

    return (
        <motion.div
            key="printer"
            style={{ display: "flex", flexDirection: "column", gap: "24px" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
        >
            {/* ── Header ── */}
            <div style={{ borderBottom: "2px solid #e5e7eb", paddingBottom: "16px" }}>
                <h2 style={{ margin: 0, fontSize: "22px", fontWeight: 700, color: "#111827", display: "flex", alignItems: "center", gap: "10px" }}>
                    <Printer size={22} color="#6366f1" /> Printer Settings
                </h2>
                <p style={{ margin: "4px 0 0", color: "#6b7280", fontSize: "14px" }}>
                    Route print jobs to the right printer automatically
                </p>
            </div>

            {/* ── Agent + Printer Status Card ── */}
            <div style={{
                background: "#fff", borderRadius: "12px", border: "1px solid #e5e7eb",
                padding: "20px", display: "flex", flexDirection: "column", gap: "16px"
            }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
                    <div>
                        <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "#111827" }}>System Status</h3>
                        <p style={{ margin: "3px 0 0", fontSize: "13px", color: "#6b7280" }}>
                            Live status of your Printer Agent and connected printers
                        </p>
                    </div>
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => { checkAgent(); if (agentActive) fetchPrinters() }}
                        style={{
                            display: "flex", alignItems: "center", gap: "6px",
                            padding: "8px 14px", borderRadius: "8px", border: "1px solid #d1d5db",
                            background: "#f9fafb", cursor: "pointer", fontSize: "13px", fontWeight: 600, color: "#374151"
                        }}
                    >
                        <RefreshCw size={14} /> Refresh
                    </motion.button>
                </div>

                {/* Agent Status Indicator */}
                <div style={{
                    display: "flex", alignItems: "center", gap: "12px",
                    padding: "14px 16px", borderRadius: "10px",
                    background: agentStatus === "online" ? "#f0fdf4" : agentStatus === "checking" ? "#fffbeb" : "#fef2f2",
                    border: `1px solid ${agentStatus === "online" ? "#bbf7d0" : agentStatus === "checking" ? "#fde68a" : "#fecaca"}`
                }}>
                    {/* Animated dot */}
                    <div style={{ position: "relative", width: "12px", height: "12px", flexShrink: 0 }}>
                        <div style={{
                            width: "12px", height: "12px", borderRadius: "50%",
                            background: agentStatus === "online" ? "#10b981" : agentStatus === "checking" ? "#f59e0b" : "#ef4444"
                        }} />
                        {agentStatus === "online" && (
                            <motion.div
                                animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                style={{
                                    position: "absolute", inset: 0, borderRadius: "50%",
                                    background: "#10b981"
                                }}
                            />
                        )}
                    </div>
                    <div>
                        <p style={{ margin: 0, fontWeight: 700, fontSize: "14px", color: "#111827" }}>
                            Printer Agent —{" "}
                            <span style={{ color: agentStatus === "online" ? "#059669" : agentStatus === "checking" ? "#d97706" : "#dc2626" }}>
                                {agentStatus === "checking" ? "Checking..." : agentStatus === "online" ? "Online" : "Offline"}
                            </span>
                        </p>
                        <p style={{ margin: 0, fontSize: "12px", color: "#6b7280" }}>
                            {agentStatus === "online"
                                ? "Agent is running and accepting print jobs"
                                : agentStatus === "checking"
                                    ? "Connecting to local printer agent..."
                                    : "Agent is not running. Please start AutoPrintX Agent on your PC."}
                        </p>
                    </div>
                </div>

                {/* Connected Printers List */}
                <div>
                    <p style={{ margin: "0 0 10px", fontWeight: 600, fontSize: "13px", color: "#374151" }}>
                        Connected Printers {!loadingPrinters && agentActive && `(${printers.length})`}
                    </p>
                    {!agentActive ? (
                        <div style={{
                            display: "flex", alignItems: "center", gap: "8px", padding: "12px 14px",
                            borderRadius: "8px", background: "#fef2f2", border: "1px solid #fecaca"
                        }}>
                            <AlertCircle size={16} color="#ef4444" />
                            <span style={{ fontSize: "13px", color: "#991b1b", fontWeight: 500 }}>
                                Agent offline — no printers available
                            </span>
                        </div>
                    ) : loadingPrinters ? (
                        <div style={{ display: "flex", gap: "8px", flexDirection: "column" }}>
                            {[1, 2].map(i => (
                                <div key={i} style={{
                                    height: "44px", borderRadius: "8px", background: "#f3f4f6",
                                    animation: "pulse 1.5s infinite"
                                }} />
                            ))}
                        </div>
                    ) : printers.length === 0 ? (
                        <div style={{
                            display: "flex", alignItems: "center", gap: "8px", padding: "12px 14px",
                            borderRadius: "8px", background: "#fffbeb", border: "1px solid #fde68a"
                        }}>
                            <AlertCircle size={16} color="#d97706" />
                            <span style={{ fontSize: "13px", color: "#92400e", fontWeight: 500 }}>
                                Agent is online but no printers are connected
                            </span>
                        </div>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            {printers.map((printer, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    style={{
                                        display: "flex", alignItems: "center", gap: "10px",
                                        padding: "10px 14px", borderRadius: "8px",
                                        background: "#f0fdf4", border: "1px solid #bbf7d0"
                                    }}
                                >
                                    <Printer size={16} color="#10b981" />
                                    <span style={{ fontSize: "13px", fontWeight: 600, color: "#065f46" }}>{printer}</span>
                                    <span style={{
                                        marginLeft: "auto", fontSize: "11px", fontWeight: 700,
                                        color: "#10b981", background: "#dcfce7", padding: "2px 8px", borderRadius: "20px"
                                    }}>READY</span>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* ── Job Routing ── */}
            <div style={{
                background: "#fff", borderRadius: "12px", border: "1px solid #e5e7eb", padding: "20px",
                display: "flex", flexDirection: "column", gap: "16px"
            }}>
                <div>
                    <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "#111827" }}>Job Routing</h3>
                    <p style={{ margin: "3px 0 0", fontSize: "13px", color: "#6b7280" }}>
                        Assign which printer handles each job type
                    </p>
                </div>

                {!agentActive || printers.length === 0 ? (
                    <div style={{
                        display: "flex", alignItems: "center", gap: "8px", padding: "16px",
                        borderRadius: "10px", background: "#fef2f2", border: "1px solid #fecaca", justifyContent: "center"
                    }}>
                        <AlertCircle size={16} color="#ef4444" />
                        <span style={{ fontSize: "13px", color: "#991b1b", fontWeight: 500 }}>
                            {!agentActive ? "Start Printer Agent to configure job routing" : "No printers connected — please connect a printer"}
                        </span>
                    </div>
                ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "12px" }}>
                        {assignmentConfig.map(({ key, label, icon: Icon, color }) => (
                            <div key={key} style={{
                                padding: "14px", borderRadius: "10px", border: "1px solid #e5e7eb", background: "#fafafa"
                            }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                                    <Icon size={16} color={color} />
                                    <label style={{ fontWeight: 600, fontSize: "13px", color: "#374151" }}>{label}</label>
                                </div>
                                <select
                                    value={assignments[key]}
                                    onChange={e => setAssignments({ ...assignments, [key]: e.target.value })}
                                    style={{
                                        width: "100%", padding: "8px 10px", borderRadius: "7px",
                                        border: "1px solid #d1d5db", fontSize: "13px",
                                        background: "#fff", cursor: "pointer"
                                    }}
                                >
                                    <option value="">— Select Printer —</option>
                                    {printers.map((p, i) => (
                                        <option key={i} value={p}>{p}</option>
                                    ))}
                                </select>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ── Save ── */}
            <motion.button
                whileHover={{ scale: agentActive ? 1.03 : 1 }}
                whileTap={{ scale: agentActive ? 0.97 : 1 }}
                onClick={() => agentActive && handleSave?.("printer")}
                disabled={!agentActive || printers.length === 0}
                style={{
                    padding: "13px 28px", borderRadius: "10px",
                    background: agentActive && printers.length > 0
                        ? "linear-gradient(135deg, #6366f1, #4f46e5)"
                        : "#e5e7eb",
                    color: agentActive && printers.length > 0 ? "#fff" : "#9ca3af",
                    border: "none", fontWeight: 700, fontSize: "15px",
                    cursor: agentActive && printers.length > 0 ? "pointer" : "not-allowed",
                    display: "flex", alignItems: "center", gap: "8px", alignSelf: "flex-start",
                    boxShadow: agentActive && printers.length > 0 ? "0 4px 14px rgba(99,102,241,0.35)" : "none",
                    transition: "all 0.2s"
                }}
            >
                <Save size={17} /> Save Job Routing
            </motion.button>
        </motion.div>
    )
}

export default PrinterSettings