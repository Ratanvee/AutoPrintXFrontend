// import React, { useRef, useEffect, useState } from "react";
// import { QRCodeCanvas } from "qrcode.react";
// import html2canvas from "html2canvas";

// const AutoPrintXPoster = ({
//     value = "https://autoprintx.com/pay",
//     ownerName = "",
//     // logo = "/AutoPrintXLogo.png",      // Place in public/
//     logo = "/logopng2.png",      // Place in public/
//     lensLogo = "/google-lens.png",     // Place in public/
// }) => {
//     const qrRef = useRef(null);
//     const [qrRendered, setQrRendered] = useState(false);

//     useEffect(() => {
//         const timer = setTimeout(() => setQrRendered(true), 500);
//         return () => clearTimeout(timer);
//     }, [value]);

//     const handleDownload = async () => {
//         if (!qrRef.current) return alert("QR not found!");

//         // Wait for QR canvas to fully render
//         const qrCanvas = qrRef.current.querySelector("canvas");
//         if (!qrCanvas) {
//             alert("QR canvas not ready!");
//             return;
//         }

//         await new Promise((r) => setTimeout(r, 1000)); // Give it time to settle

//         // Temporarily hide the download button
//         const button = document.getElementById("download-btn");
//         if (button) button.style.display = "none";

//         const canvas = await html2canvas(qrRef.current, {
//             scale: 3,
//             backgroundColor: "#ffffff",
//             useCORS: true,
//         });

//         if (button) button.style.display = "block"; // Restore button

//         const dataURL = canvas.toDataURL("image/png");
//         const link = document.createElement("a");
//         link.href = dataURL;
//         link.download = `${ownerName}_AutoPrintX_QR.png`;
//         link.click();
//     };

//     return (
//         <div
//             style={{
//                 minHeight: "100vh",
//                 // background: "linear-gradient(135deg, #ff7a18, #af002d 70%)",
//                 background: "linear-gradient(135deg, #ffffff, #ffffff 70%)",
//                 display: "flex",
//                 flexDirection: "column",
//                 justifyContent: "center",
//                 alignItems: "center",
//                 padding: "40px",
//             }}
//         >
//             {/* QR POSTER */}
//             <div
//                 ref={qrRef}
//                 style={{
//                     backgroundColor: "#fff",
//                     borderRadius: "30px",
//                     padding: "30px 25px",
//                     textAlign: "center",
//                     boxShadow: "0 6px 25px rgba(0,0,0,0.2)",
//                     width: "fit-content",
//                 }}
//             >
//                 {/* ALL-IN-ONE QR Label */}
//                 <div
//                     style={{
//                         backgroundColor: "#fff",
//                         color: "#003366",
//                         fontWeight: "bold",
//                         fontSize: "14px",
//                         padding: "6px 16px",
//                         borderRadius: "20px",
//                         marginBottom: "15px",
//                         display: "inline-block",
//                         border: "1px solid #007BFF",
//                     }}
//                 >
//                     ALL-IN-ONE QR
//                 </div>

//                 {/* AutoPrintX Logo Text */}
//                 <div style={{ fontSize: "40px", fontWeight: "bold", marginBottom: "5px" }}>
//                     <span style={{ color: "#003366" }}>Auto</span>
//                     <span style={{ color: "#007BFF" }}>PrintX</span>
//                 </div>
//                 <div style={{ fontSize: "16px", color: "#000", marginBottom: "20px", fontWeight: "bold" }}>
//                     Accepted Here
//                 </div>

//                 {/* QR Code */}
//                 <div style={{ position: "relative", display: "inline-block" }}>
//                     <QRCodeCanvas
//                         value={value}
//                         size={250}
//                         bgColor="#ffffff"
//                         fgColor="#003366"
//                         level="H"
//                         includeMargin={false}
//                         renderAs="canvas" // ✅ Ensures proper rendering for html2canvas
//                         imageSettings={{
//                             src: logo,
//                             height: 85,
//                             width: 89,
//                             excavate: true,
//                         }}
//                     />
//                 </div>

//                 {/* Scan with Google Lens */}
//                 <div
//                     style={{
//                         fontSize: "15px",
//                         color: "#333",
//                         marginTop: "15px",
//                         display: "flex",
//                         justifyContent: "center",
//                         alignItems: "center",
//                         gap: "8px",
//                     }}
//                 >
//                     <img src={lensLogo} alt="Google Lens" style={{ width: "20px", height: "20px" }} />
//                     <span>Scan with Google Lens</span>
//                 </div>

//                 {/* Payment Info */}
//                 <div style={{ fontSize: "14px", color: "#000", marginTop: "10px", fontWeight: "500" }}>
//                     Skip the hassle — scan this QR to upload your document <br /> and get it printed instantly — no sharing, no waiting.
//                 </div>

//                 {/* Owner Name */}
//                 <div
//                     style={{
//                         fontWeight: "bold",
//                         fontSize: "25px",
//                         marginTop: "20px",
//                         color: "#003366",
//                         letterSpacing: "1px",
//                     }}
//                 >
//                     {ownerName.toUpperCase()}
//                 </div>
//             </div>

//             {/* Download Button (excluded from image) */}
//             <button
//                 onClick={handleDownload}
//                 disabled={!qrRendered}
//                 style={{
//                     marginTop: "30px",
//                     backgroundColor: "#af002d",
//                     color: "#fff",
//                     border: "none",
//                     padding: "12px 25px",
//                     borderRadius: "30px",
//                     cursor: qrRendered ? "pointer" : "not-allowed",
//                     fontWeight: "bold",
//                     fontSize: "16px",
//                     boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
//                 }}
//             >
//                 {qrRendered ? "Download QR Code" : "Rendering..."}
//             </button>
//         </div>
//     );
// };

// export default AutoPrintXPoster;


import React, { useRef, useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import html2canvas from "html2canvas";

/**
 * AutoPrintX — Premium Poster
 * Palette: Primary #007BFF · Dark #003366 · Gray #777777 · BG #FFFFFF
 * Same props / libraries as the original component:
 *   value, ownerName, logo, lensLogo
 */
const AutoPrintXPoster = ({
    value = "https://autoprintx.com/pay",
    ownerName = "",
    // logo = "/AutoPrintXLogo.png",      // Place in public/
    logo = "/logopng2.png",      // Place in public/
    lensLogo = "/google-lens.png",     // Place in public/
}) => {
    const qrRef = useRef(null);
    const [qrRendered, setQrRendered] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setQrRendered(true), 500);
        return () => clearTimeout(timer);
    }, [value]);

    const handleDownload = async () => {
        if (!qrRef.current) return alert("QR not found!");

        const qrCanvas = qrRef.current.querySelector("canvas");
        if (!qrCanvas) {
            alert("QR canvas not ready!");
            return;
        }

        await new Promise((r) => setTimeout(r, 1000)); // Give it time to settle

        // Hide the download button so it never appears in the exported image
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
        link.download = `${ownerName || "AutoPrintX"}_AutoPrintX_Poster.png`;
        link.click();
    };

    const COLORS = {
        primary: "#007BFF",
        dark: "#003366",
        gray: "#777777",
        hair: "#007BFF15",
    };


    const FILE_TYPES = ["PDF", "Images", "Word Documents", "PowerPoint"];

    // ... inside your component:


    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#F4F6F9",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: "40px 16px",
                fontFamily: "'Inter', -apple-system, 'SF Pro Display', sans-serif",
            }}
        >
            {/* ================= POSTER (captured as image) ================= */}
            <div
                ref={qrRef}
                style={{
                    backgroundColor: "#fff",
                    borderRadius: "24px",
                    padding: "48px 40px",
                    textAlign: "center",
                    boxShadow: "0 20px 60px rgba(0,51,102,0.12)",
                    width: "520px",
                    maxWidth: "100%",
                }}
            >
                {/* ---------- HEADER ---------- */}
                <div
                    style={{
                        fontFamily: "'Poppins', 'Inter', sans-serif",
                        fontSize: "32px",
                        fontWeight: 800,
                        letterSpacing: "-0.5px",
                        marginBottom: "18px",
                    }}
                >
                    <span style={{ color: COLORS.dark }}>Auto</span>
                    <span style={{ color: COLORS.primary }}>PrintX</span>
                </div>

                <div
                    style={{
                        fontFamily: "'Poppins', 'Inter', sans-serif",
                        fontSize: "28px",
                        fontWeight: 700,
                        color: COLORS.dark,
                        lineHeight: 1.2,
                        marginBottom: "6px",
                    }}
                >
                    Print from Your Phone
                </div>
                <div
                    style={{
                        fontSize: "13.5px",
                        color: COLORS.gray,
                        fontWeight: 500,
                        marginBottom: "26px",
                    }}
                >
                    Scan the QR Code to Upload & Print
                </div>

                {/* ---------- QR CODE ---------- */}
                <div
                    style={{
                        display: "inline-block",
                        background: "#fff",
                        borderRadius: "20px",
                        padding: "16px",
                        border: `2px solid ${COLORS.hair}`,
                    }}
                >
                    <div style={{ position: "relative", display: "inline-block" }}>
                        <QRCodeCanvas
                            value={value}
                            size={320}
                            bgColor="#ffffff"
                            fgColor={COLORS.dark}
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
                </div>

                <div style={{ fontSize: "12.5px", color: COLORS.gray, marginTop: "10px", fontWeight: 500 }}>
                    Use your Phone Camera to Scan
                </div>

                {/* Scan with Google Lens */}
                {/* <div
                    style={{
                        fontSize: "13px",
                        color: "#333",
                        marginTop: "10px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "8px",
                    }}
                >
                    <img src={lensLogo} alt="Google Lens" style={{ width: "16px", height: "16px" }} />
                    <span>Scan with Google Lens</span>
                </div> */}

                {/* ---------- HOW IT WORKS ---------- */}
                <div
                    style={{
                        display: "flex",
                        // flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "12px",
                        fontSize: "13px",
                        // color: COLORS.dark,
                        fontWeight: 600,
                        margin: "26px 0",
                    }}
                >
                    {["Scan", "Upload & Settings", "Print", "Collect"].map(
                        (step, i, arr) => (
                            <React.Fragment key={step}>
                                <div
                                    style={{
                                        fontFamily: "'Poppins', 'Inter', sans-serif",
                                        fontSize: "14.5px",
                                        fontWeight: 600,
                                        color: COLORS.dark,
                                        padding: "4px 0",
                                    }}
                                >
                                    {step}
                                </div>
                                {i < arr.length - 1 && (
                                    <div style={{ color: "#B9C6D6", fontSize: "13px", lineHeight: 1 }}>→</div>
                                )}
                            </React.Fragment>
                        )
                    )}
                </div>

                {/* ---------- TRUST SECTION ---------- */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "16px",
                        flexWrap: "wrap",
                        padding: "16px 0",
                        borderTop: `1px solid ${COLORS.hair}`,
                        borderBottom: `1px solid ${COLORS.hair}`,
                        marginBottom: "20px",
                    }}
                >
                    {["No App Required", "Secure Upload", "Works on Any Smartphone"].map(
                        (label) => (
                            <span
                                key={label}
                                style={{ fontSize: "10.5px", color: COLORS.dark, fontWeight: 600 }}
                            >
                                {label}
                            </span>
                        )
                    )}
                </div>

                {/* ---------- SUPPORTED FILES ---------- */}
                <div
                    style={{
                        fontSize: "10px",
                        color: COLORS.gray,
                        letterSpacing: "1.5px",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        marginBottom: "8px",
                    }}
                >
                    Supports
                </div>
                {/* <div
                    style={{
                        fontSize: "11px",
                        color: COLORS.dark,
                        fontWeight: 500,
                        marginBottom: "24px",
                    }}
                >
                    PDF &nbsp;·&nbsp; Images &nbsp;·&nbsp; Word Documents &nbsp;·&nbsp; PowerPoint
                </div> */}
              
                <div
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        marginBottom: "24px",
                    }}
                >
                    {FILE_TYPES.map((type) => (
                        <span
                            key={type}
                            style={{
                                fontSize: "11px",
                                color: COLORS.dark,
                                fontWeight: 500,
                                backgroundColor: "#f0f2f5", // Light grey background for the chip
                                padding: "6px 12px",
                                borderRadius: "16px",       // Gives it that pill/chip shape
                                display: "inline-flex",
                                alignItems: "center",
                                whiteSpace: "nowrap",
                            }}
                        >
                            {type}
                        </span>
                    ))}
                </div>

                {/* ---------- SHOP DETAILS (ownerName) ---------- */}
                <div
                    style={{
                        fontFamily: "'Poppins', 'Inter', sans-serif",
                        fontWeight: 700,
                        fontSize: "22px",
                        color: COLORS.dark,
                        letterSpacing: "0.5px",
                        marginBottom: "4px",
                    }}
                >
                    {ownerName.toUpperCase()}
                </div>
                <div style={{ fontSize: "11px", color: COLORS.gray, fontWeight: 500 }}>
                    Powered by AutoPrintX
                </div>
            </div>

            {/* Download Button (excluded from the exported image) */}
            <button
                id="download-btn"
                onClick={handleDownload}
                disabled={!qrRendered}
                style={{
                    marginTop: "30px",
                    backgroundColor: COLORS.primary,
                    color: "#fff",
                    border: "none",
                    padding: "12px 28px",
                    borderRadius: "30px",
                    cursor: qrRendered ? "pointer" : "not-allowed",
                    fontWeight: "bold",
                    fontSize: "15px",
                    boxShadow: "0 6px 20px rgba(0,123,255,0.3)",
                }}
            >
                {qrRendered ? "Download Poster" : "Rendering..."}
            </button>
        </div>
    );
};

export default AutoPrintXPoster;