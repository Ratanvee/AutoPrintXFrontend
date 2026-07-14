import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Printer, Home, ArrowLeft } from "lucide-react"
import DashboardHeader from "../components/Dashboard/DashboardHeader"

export default function NotFound() {
    const [dots, setDots] = useState("")

    useEffect(() => {
        const t = setInterval(() => setDots(d => d.length >= 3 ? "" : d + "."), 500)
        return () => clearInterval(t)
    }, [])

    return (
        <div style={{
            minHeight: "100vh", background: "#f8fafc",
            fontFamily: "system-ui, -apple-system, sans-serif",
            display: "flex", flexDirection: "column",
        }}>

            {/* ── Navbar ── */}
            {/* <nav style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "0 48px", height: 64, background: "#fff",
                borderBottom: "1px solid #e5e7eb", flexShrink: 0,
            }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: "#003366" }}>
                    Auto<span style={{ color: "#007BFF" }}>PrintX</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
                    {["Home", "Services", "About", "Contact"].map(item => (
                        <span key={item} style={{ fontSize: 15, color: "#003366", cursor: "pointer", fontWeight: 500 }}>{item}</span>
                    ))}
                    <button onClick={() => { window.location.href = `${import.meta.env.VITE_QRCodeURL}dashboard` }} style={{ padding: "8px 22px", borderRadius: 6, border: "2px solid #003366", background: "transparent", color: "#003366", fontWeight: 700, fontSize: 15, cursor: "pointer" }}>
                        Dashboard
                    </button>
                </div>
            </nav> */}
            <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <nav className="navbar">
                    <motion.div className="logo"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}>
                        <h1>Auto<span>PrintX</span></h1>
                    </motion.div>
                    <ul className={`nav-links ${"isActive" ? "active" : ""}`}>
                        <li><a href="/" className="active">Home</a></li>
                        <li><a href="/#services">Services</a></li>
                        <li><a href="/#about">About</a></li>
                        <li><a href="/#contact">Contact</a></li>
                        <li><button onClick={() => { window.location.href = `${import.meta.env.VITE_QRCodeURL}dashboard` }} className="dashboard btn-secondary">Dashboard</button></li>
                    </ul>
                    {/* <div className={`hamburger ${isActive ? "active" : ""}`}
                        // onClick={() => setIsActive(!isActive)}
                    >
                        <span class="bar"></span>
                        <span class="bar"></span>
                        <span class="bar"></span>
                    </div> */}
                </nav>
            </motion.header>

            {/* ── Main ── */}
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px", position: "relative", overflow: "hidden" }}>

                {/* Floating bg circles */}
                {[
                    { w: 80, l: "5%", t: "15%", dur: 3.0 },
                    { w: 120, l: "80%", t: "10%", dur: 3.7 },
                    { w: 60, l: "15%", t: "70%", dur: 3.4 },
                    { w: 100, l: "70%", t: "75%", dur: 4.1 },
                    { w: 90, l: "40%", t: "5%", dur: 3.2 },
                    { w: 70, l: "90%", t: "60%", dur: 3.9 },
                ].map((c, i) => (
                    <motion.div key={i}
                        animate={{ y: [0, -18, 0], opacity: [0.06, 0.12, 0.06] }}
                        transition={{ duration: c.dur, repeat: Infinity, delay: i * 0.4 }}
                        style={{ position: "absolute", width: c.w, height: c.w, borderRadius: "50%", background: "#003366", left: c.l, top: c.t, pointerEvents: "none" }}
                    />
                ))}

                <div style={{ textAlign: "center", position: "relative", zIndex: 1, maxWidth: 560 }}>

                    {/* Floating printer icon */}
                    <motion.div
                        animate={{ y: [0, -12, 0] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                        style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 90, height: 90, borderRadius: 22, background: "#003366", marginBottom: 32, boxShadow: "0 20px 48px rgba(0,51,102,0.2)" }}
                    >
                        <Printer size={44} color="#fff" />
                    </motion.div>

                    {/* 404 */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        style={{ position: "relative", lineHeight: 1, marginBottom: 8 }}
                    >
                        {/* Outline ghost */}
                        <div style={{ position: "absolute", top: 6, left: "50%", transform: "translateX(-50%)", fontSize: 130, fontWeight: 900, color: "transparent", WebkitTextStroke: "2px #e5e7eb", lineHeight: 1, letterSpacing: -4, zIndex: 0, whiteSpace: "nowrap", userSelect: "none" }}>
                            404
                        </div>
                        {/* Solid */}
                        <div style={{ fontSize: 130, fontWeight: 900, color: "#003366", lineHeight: 1, letterSpacing: -4, position: "relative", zIndex: 1, userSelect: "none" }}>
                            4<span style={{ color: "#007BFF" }}>0</span>4
                        </div>
                    </motion.div>

                    {/* Blue divider line */}
                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        style={{ height: 3, background: "linear-gradient(90deg,#007BFF,#003366)", borderRadius: 2, maxWidth: 280, margin: "0 auto 28px", transformOrigin: "left" }}
                    />

                    <motion.h1
                        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                        style={{ fontSize: 26, fontWeight: 800, color: "#003366", margin: "0 0 12px" }}
                    >
                        Page Not Found
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                        style={{ fontSize: 15, color: "#6b7280", margin: "0 0 36px", lineHeight: 1.7 }}
                    >
                        Oops! This page got lost in the print queue.<br />
                        The URL you visited doesn't exist on AutoPrintX.
                    </motion.p>

                    {/* Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
                        style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}
                    >
                        <motion.button
                            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}
                            onClick={() => { window.location.href = `${import.meta.env.VITE_QRCodeURL}` }}
                            style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 28px", borderRadius: 8, border: "none", background: "#003366", color: "#fff", fontWeight: 700, fontSize: 15, cursor: "pointer", boxShadow: "0 8px 24px rgba(0,51,102,0.2)" }}
                        >
                            <Home size={17} /> Go Home
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}
                            onClick={() => { window.history.back() }}
                            style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 28px", borderRadius: 8, border: "2px solid #003366", background: "transparent", color: "#003366", fontWeight: 700, fontSize: 15, cursor: "pointer" }}
                        >
                            <ArrowLeft size={17} /> Go Back
                        </motion.button>
                    </motion.div>

                    {/* Typing status line */}
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
                        style={{ marginTop: 48, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
                    >
                        <span style={{ fontSize: 13, color: "#9ca3af", fontFamily: "monospace" }}>
                            Error 404 · Page not found · AutoPrintX{dots}
                        </span>
                        <motion.span
                            animate={{ opacity: [1, 0, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                            style={{ display: "inline-block", width: 2, height: 14, background: "#007BFF", borderRadius: 1 }}
                        />
                    </motion.div>
                </div>
            </div>
        </div>
    )
}