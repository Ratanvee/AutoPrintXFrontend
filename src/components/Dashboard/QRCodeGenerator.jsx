import React, { useRef, useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import html2canvas from "html2canvas";

const AutoPrintXPoster = ({
    value = "https://autoprintx.com/pay",
    ownerName = "RATANVEER",
    logo = "/AutoPrintXLogo.png",      // Place in public/
    lensLogo = "/google-lens.svg",     // Place in public/
}) => {
    const qrRef = useRef(null);
    const [qrRendered, setQrRendered] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setQrRendered(true), 500);
        return () => clearTimeout(timer);
    }, [value]);

    const handleDownload = async () => {
        if (!qrRef.current) return alert("QR not found!");

        // Wait for QR canvas to fully render
        const qrCanvas = qrRef.current.querySelector("canvas");
        if (!qrCanvas) {
            alert("QR canvas not ready!");
            return;
        }

        await new Promise((r) => setTimeout(r, 1000)); // Give it time to settle

        // Temporarily hide the download button
        const button = document.getElementById("download-btn");
        if (button) button.style.display = "none";

        const canvas = await html2canvas(qrRef.current, {
            scale: 3,
            backgroundColor: "#ffffff",
            useCORS: true,
        });

        if (button) button.style.display = "block"; // Restore button

        const dataURL = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = dataURL;
        link.download = `${ownerName}_AutoPrintX_QR.png`;
        link.click();
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                // background: "linear-gradient(135deg, #ff7a18, #af002d 70%)",
                background: "linear-gradient(135deg, #ffffff, #ffffff 70%)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: "40px",
            }}
        >
            {/* QR POSTER */}
            <div
                ref={qrRef}
                style={{
                    backgroundColor: "#fff",
                    borderRadius: "30px",
                    padding: "30px 25px",
                    textAlign: "center",
                    boxShadow: "0 6px 25px rgba(0,0,0,0.2)",
                    width: "fit-content",
                }}
            >
                {/* ALL-IN-ONE QR Label */}
                <div
                    style={{
                        backgroundColor: "#fff",
                        color: "#003366",
                        fontWeight: "bold",
                        fontSize: "14px",
                        padding: "6px 16px",
                        borderRadius: "20px",
                        marginBottom: "15px",
                        display: "inline-block",
                        border: "1px solid #007BFF",
                    }}
                >
                    ALL-IN-ONE QR
                </div>

                {/* AutoPrintX Logo Text */}
                <div style={{ fontSize: "40px", fontWeight: "bold", marginBottom: "5px" }}>
                    <span style={{ color: "#003366" }}>Auto</span>
                    <span style={{ color: "#007BFF" }}>PrintX</span>
                </div>
                <div style={{ fontSize: "16px", color: "#000", marginBottom: "20px", fontWeight: "bold" }}>
                    Accepted Here
                </div>

                {/* QR Code */}
                <div style={{ position: "relative", display: "inline-block" }}>
                    <QRCodeCanvas
                        value={value}
                        size={250}
                        bgColor="#ffffff"
                        fgColor="#003366"
                        level="H"
                        includeMargin={false}
                        renderAs="canvas" // ✅ Ensures proper rendering for html2canvas
                        imageSettings={{
                            src: logo,
                            height: 85,
                            width: 89,
                            excavate: true,
                        }}
                    />
                </div>

                {/* Scan with Google Lens */}
                <div
                    style={{
                        fontSize: "15px",
                        color: "#333",
                        marginTop: "15px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "8px",
                    }}
                >
                    <img src={lensLogo} alt="Google Lens" style={{ width: "20px", height: "20px" }} />
                    <span>Scan with Google Lens</span>
                </div>

                {/* Payment Info */}
                <div style={{ fontSize: "14px", color: "#000", marginTop: "10px", fontWeight: "500" }}>
                    Skip the hassle — scan this QR to upload your document <br /> and get it printed instantly — no sharing, no waiting.
                </div>

                {/* Owner Name */}
                <div
                    style={{
                        fontWeight: "bold",
                        fontSize: "25px",
                        marginTop: "20px",
                        color: "#003366",
                        letterSpacing: "1px",
                    }}
                >
                    {ownerName.toUpperCase()}
                </div>
            </div>

            {/* Download Button (excluded from image) */}
            <button
                onClick={handleDownload}
                disabled={!qrRendered}
                style={{
                    marginTop: "30px",
                    backgroundColor: "#af002d",
                    color: "#fff",
                    border: "none",
                    padding: "12px 25px",
                    borderRadius: "30px",
                    cursor: qrRendered ? "pointer" : "not-allowed",
                    fontWeight: "bold",
                    fontSize: "16px",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
                }}
            >
                {qrRendered ? "Download QR Code" : "Rendering..."}
            </button>
        </div>
    );
};

export default AutoPrintXPoster;
