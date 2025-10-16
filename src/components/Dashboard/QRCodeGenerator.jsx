// function QrCodeGenerator() {
//     const [url, setUrl] = useState("");
//     const [qrIsVisible, setQrIsVisible] = useState(false);
//     const handleQrCodeGenerator = () => {
//         if (!url) {
//             return;
//         }
//         setQrIsVisible(true);
//     };
//     return (
//         <div className="qrcode__container">
            
//             <h1>QR Code Generator</h1>
//             <div className="qrcode__container--parent" ref={qrCodeRef}>
//                 <div className="qrcode__input">
//                     <input
//                         type="text"
//                         placeholder="Enter a URL"
//                         value={url}
//                         onChange={(e) => setUrl(e.target.value)}
//                     />

//                     <button onClick={handleQrCodeGenerator}>Generate QR Code</button>
//                 </div>
//                 {qrIsVisible && (
//                     <div className="qrcode__download">
//                         <div className="qrcode__image">
//                             <QRCode value={url} size={300} />
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }
// export default QrCodeGenerator;



// import { useState, useRef } from "react";
// // import QRCode from "qrcode.react";
// import QRCode from "react-qr-code";

// function QrCodeGenerator() {
//     const [qrVisible, setQrVisible] = useState(false);
//     const qrRef = useRef(null);

//     // ✅ Generate QR Code when button clicked
//     const handleGenerate = () => {
//         setQrVisible(true);
//     };

//     // ✅ Download the QR code as an image
//     const handleDownload = () => {
//         const canvas = qrRef.current.querySelector("canvas");
//         const pngUrl = canvas
//             .toDataURL("image/png")
//             .replace("image/png", "image/octet-stream");

//         const downloadLink = document.createElement("a");
//         downloadLink.href = pngUrl;
//         downloadLink.download = "qrcode.png";
//         document.body.appendChild(downloadLink);
//         downloadLink.click();
//         document.body.removeChild(downloadLink);
//     };

//     return (
//         <div
//             style={{
//                 textAlign: "center",
//                 marginTop: "50px",
//                 fontFamily: "Poppins, sans-serif",
//             }}
//         >
//             <h1>QR Code Generator</h1>

//             <button
//                 onClick={handleGenerate}
//                 style={{
//                     padding: "10px 20px",
//                     fontSize: "16px",
//                     backgroundColor: "#0a2463",
//                     color: "#fff",
//                     border: "none",
//                     borderRadius: "8px",
//                     cursor: "pointer",
//                     marginBottom: "20px",
//                 }}
//             >
//                 Generate QR Code
//             </button>

//             {qrVisible && (
//                 <div ref={qrRef} style={{ display: "inline-block", position: "relative" }}>
//                     {/* ✅ Generate QR Code */}
//                     <QRCode
//                         value="https://smartdocx.in/scan-print"
//                         size={250}
//                         includeMargin={true}
//                         bgColor="#ffffff"
//                         fgColor="#000000"
//                         level="H" // High error correction (needed for logo overlay)
//                         renderAs="canvas"
//                     />

//                     {/* ✅ Add logo in the center */}
//                     <img
//                         src="https://upload.wikimedia.org/wikipedia/commons/a/ab/Logo_TV_2015.png" // Replace with your logo
//                         alt="Logo"
//                         style={{
//                             position: "absolute",
//                             top: "50%",
//                             left: "50%",
//                             width: "50px",
//                             height: "50px",
//                             transform: "translate(-50%, -50%)",
//                             borderRadius: "8px",
//                         }}
//                     />

//                     <div style={{ marginTop: "20px" }}>
//                         <button
//                             onClick={handleDownload}
//                             style={{
//                                 padding: "8px 18px",
//                                 fontSize: "15px",
//                                 backgroundColor: "#198754",
//                                 color: "#fff",
//                                 border: "none",
//                                 borderRadius: "8px",
//                                 cursor: "pointer",
//                             }}
//                         >
//                             Download QR Code
//                         </button>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }

// export default QrCodeGenerator;


// import React, { useRef } from "react";
// import { QRCodeCanvas } from "qrcode.react";

// const QRCodeGenerator = ({ value }) => {
//     const qrRef = useRef(null);

//     const handleDownload = () => {
//         const canvas = qrRef.current.querySelector("canvas");
//         if (!canvas) return alert("QR not found!");
//         const dataURL = canvas.toDataURL("image/png");

//         const link = document.createElement("a");
//         link.href = dataURL;
//         link.download = "qrcode.png";
//         link.click();
//     };

//     return (
//         <div style={{ textAlign: "center" }} ref={qrRef}>
//             <QRCodeCanvas value={value || "https://example.com"} size={200} includeMargin />
//             <button onClick={handleDownload}>Download QR</button>
//         </div>
//     );
// };

// export default QRCodeGenerator;


// import React, { useRef } from "react";
// import { QRCodeCanvas } from "qrcode.react";
// import html2canvas from "html2canvas"; // 🧩 Install this: npm install html2canvas

// const QRCodeGenerator = ({
//     value = "https://example.com",
//     ownerName = "OWNER NAME",
//     logo = "https://upload.wikimedia.org/wikipedia/commons/a/ab/Logo_TV_2015.png", // place your logo in public folder
// }) => {
//     const qrRef = useRef(null);

//     // 📥 Download the full card as PNG
//     const handleDownload = async () => {
//         if (!qrRef.current) return alert("QR not found!");
//         const canvas = await html2canvas(qrRef.current, {
//             backgroundColor: null,
//             scale: 3,
//             useCORS: true,
//         });
//         const dataURL = canvas.toDataURL("image/png");
//         const link = document.createElement("a");
//         link.href = dataURL;
//         link.download = `${ownerName}_QRCard.png`;
//         link.click();
//     };

//     return (
//         <div
//             style={{
//                 minHeight: "100vh",
//                 display: "flex",
//                 flexDirection: "column",
//                 justifyContent: "center",
//                 alignItems: "center",
//                 background: "linear-gradient(135deg, #ff7a18, #af002d 70%)",
//                 padding: "40px",
//             }}
//         >
//             <div
//                 ref={qrRef}
//                 style={{
//                     backgroundColor: "#fff",
//                     borderRadius: "25px",
//                     padding: "30px 30px 20px 30px",
//                     textAlign: "center",
//                     position: "relative",
//                     boxShadow: "0 6px 25px rgba(0,0,0,0.3)",
//                     width: "fit-content",
//                 }}
//             >
//                 {/* QR Code with logo */}
//                 <div style={{ position: "relative", display: "inline-block" }}>
//                     <QRCodeCanvas
//                         value={value}
//                         size={260}
//                         bgColor="#ffffff"
//                         fgColor="#b10086"
//                         level="H"
//                         includeMargin={false}
//                         imageSettings={{
//                             src: logo,
//                             height: 55,
//                             width: 55,
//                             excavate: true,
//                         }}
//                     />
//                 </div>

//                 {/* Owner name */}
//                 <div
//                     style={{
//                         fontWeight: "bold",
//                         fontSize: "22px",
//                         textAlign: "center",
//                         marginTop: "15px",
//                         color: "#b10086",
//                         letterSpacing: "1px",
//                     }}
//                 >
//                     {ownerName.toUpperCase()}
//                 </div>

//                 {/* "Scan QR Code" text */}
//                 <div
//                     style={{
//                         fontSize: "14px",
//                         color: "#555",
//                         marginTop: "5px",
//                     }}
//                 >
//                     📸 Scan QR Code
//                 </div>
//             </div>

//             {/* Download Button */}
//             <button
//                 onClick={handleDownload}
//                 style={{
//                     marginTop: "30px",
//                     backgroundColor: "#fff",
//                     color: "#b10086",
//                     border: "none",
//                     padding: "12px 25px",
//                     borderRadius: "30px",
//                     cursor: "pointer",
//                     fontWeight: "bold",
//                     fontSize: "16px",
//                     boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
//                 }}
//             >
//                 Download QR Code
//             </button>
//         </div>
//     );
// };

// export default QRCodeGenerator;

// import React, { useRef, useEffect, useState } from "react";
// import { QRCodeCanvas } from "qrcode.react";
// import html2canvas from "html2canvas";

// const QRCodeGenerator = ({
//     value = "https://smartdocx.com/pay",
//     ownerName = "OWNER NAME",
//     logo = "/logo.png", // logo inside public/
//     lensLogo = "data:image/png;base64,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", // Google Lens logo inside public/
// }) => {
//     const qrRef = useRef(null);
//     const [qrRendered, setQrRendered] = useState(false);

//     useEffect(() => {
//         const timer = setTimeout(() => setQrRendered(true), 500);
//         return () => clearTimeout(timer);
//     }, [value]);

//     const handleDownload = async () => {
//         if (!qrRef.current) return alert("QR not found!");
//         await new Promise((r) => setTimeout(r, 300));

//         const canvas = await html2canvas(qrRef.current, {
//             scale: 3,
//             backgroundColor: "#ffffff",
//             useCORS: true,
//         });
//         const dataURL = canvas.toDataURL("image/png");

//         const link = document.createElement("a");
//         link.href = dataURL;
//         link.download = `${ownerName}_SmartDocX_QR.png`;
//         link.click();
//     };

//     return (
//         <div
//             style={{
//                 minHeight: "100vh",
//                 background: "linear-gradient(135deg, #ff7a18, #af002d 70%)",
//                 display: "flex",
//                 flexDirection: "column",
//                 justifyContent: "center",
//                 alignItems: "center",
//                 padding: "40px",
//             }}
//         >
//             {/* QR CARD */}
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
//                 {/* HEADER */}
//                 <div style={{ fontSize: "18px", fontWeight: "bold", color: "#af002d", marginBottom: "10px" }}>
//                     SMARTDOCX Accepted Here
//                 </div>

//                 {/* QR CODE */}
//                 <div style={{ position: "relative", display: "inline-block" }}>
//                     <QRCodeCanvas
//                         id="qrCanvas"
//                         value={value}
//                         size={250}
//                         bgColor="#ffffff"
//                         fgColor="#af002d"
//                         level="H"
//                         includeMargin={false}
//                         imageSettings={{
//                             src: logo,
//                             height: 55,
//                             width: 55,
//                             excavate: true,
//                         }}
//                     />
//                 </div>

//                 {/* SCAN WITH GOOGLE LENS */}
//                 <div
//                     style={{
//                         fontSize: "15px",
//                         color: "#555",
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

//                 {/* ADDITIONAL INFO */}
//                 <div style={{ fontSize: "13px", color: "#777", marginTop: "10px" }}>
//                     Pay using UPI, SmartDocX Wallet, or Bank Account
//                 </div>

//                 {/* OWNER NAME */}
//                 <div
//                     style={{
//                         fontWeight: "bold",
//                         fontSize: "20px",
//                         marginTop: "20px",
//                         color: "#af002d",
//                         letterSpacing: "1px",
//                     }}
//                 >
//                     {ownerName.toUpperCase()}
//                 </div>
//             </div>

//             {/* DOWNLOAD BUTTON */}
//             <button
//                 onClick={handleDownload}
//                 disabled={!qrRendered}
//                 style={{
//                     marginTop: "30px",
//                     backgroundColor: "#fff",
//                     color: "#af002d",
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

// export default QRCodeGenerator;



// import React, { useRef, useEffect, useState } from "react";
// import { QRCodeCanvas } from "qrcode.react";
// import html2canvas from "html2canvas";

// const SmartDocXPoster = ({
//     value = "https://smartdocx.com/pay",
//     ownerName = "RATANVEER",
//     logo = "/image.png",
//     lensLogo = "/google-lens.png",
// }) => {
//     const qrRef = useRef(null);
//     const [qrRendered, setQrRendered] = useState(false);

//     useEffect(() => {
//         const timer = setTimeout(() => setQrRendered(true), 500);
//         return () => clearTimeout(timer);
//     }, [value]);

//     const handleDownload = async () => {
//         if (!qrRef.current) return alert("QR not found!");
//         await new Promise((r) => setTimeout(r, 300));

//         const canvas = await html2canvas(qrRef.current, {
//             scale: 3,
//             backgroundColor: "#ffffff",
//             useCORS: true,
//         });
//         const dataURL = canvas.toDataURL("image/png");

//         const link = document.createElement("a");
//         link.href = dataURL;
//         link.download = `${ownerName}_SmartDocX_QR.png`;
//         link.click();
//     };

//     return (
//         <div
//             style={{
//                 minHeight: "100vh",
//                 background: "linear-gradient(135deg, #ff7a18, #af002d 70%)",
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
//                 {/* HEADER */}
//                 <div
//                     style={{
//                         backgroundColor: "#ff7a18",
//                         color: "#fff",
//                         fontWeight: "bold",
//                         fontSize: "14px",
//                         padding: "6px 16px",
//                         borderRadius: "20px",
//                         marginBottom: "15px",
//                         display: "inline-block",
//                     }}
//                 >
//                     ALL-IN-ONE QR
//                 </div>

//                 {/* LOGO + TEXT */}
//                 <div style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "5px" }}>
//                     <span style={{ color: "#003366" }}>Smart</span>
//                     <span style={{ color: "#007BFF" }}>DocX</span>
//                 </div>
//                 <div style={{ fontSize: "16px", color: "#333", marginBottom: "20px" }}>
//                     Accepted Here
//                 </div>

//                 {/* QR CODE */}
//                 <div style={{ position: "relative", display: "inline-block" }}>
//                     <QRCodeCanvas
//                         value={value}
//                         size={250}
//                         bgColor="#ffffff"
//                         fgColor="#af002d"
//                         level="H"
//                         includeMargin={false}
//                         imageSettings={{
//                             src: logo,
//                             height: 55,
//                             width: 55,
//                             excavate: true,
//                         }}
//                     />
//                 </div>

//                 {/* SCAN WITH GOOGLE LENS */}
//                 <div
//                     style={{
//                         fontSize: "15px",
//                         color: "#555",
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

//                 {/* PAYMENT INFO */}
//                 <div style={{ fontSize: "13px", color: "#777", marginTop: "10px" }}>
//                     Pay using UPI, SmartDocX Wallet, or Bank Account
//                 </div>

//                 {/* OWNER NAME */}
//                 <div
//                     style={{
//                         fontWeight: "bold",
//                         fontSize: "20px",
//                         marginTop: "20px",
//                         color: "#af002d",
//                         letterSpacing: "1px",
//                     }}
//                 >
//                     {ownerName.toUpperCase()}
//                 </div>
//             </div>

//             {/* DOWNLOAD BUTTON */}
//             <button
//                 onClick={handleDownload}
//                 disabled={!qrRendered}
//                 style={{
//                     marginTop: "30px",
//                     backgroundColor: "#fff",
//                     color: "#af002d",
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

// export default SmartDocXPoster;


import React, { useRef, useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import html2canvas from "html2canvas";

const SmartDocXPoster = ({
    value = "https://smartdocx.com/pay",
    ownerName = "RATANVEER",
    logo = "/SmartDocXLogo.png",      // Place in public/
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
        link.download = `${ownerName}_SmartDocX_QR.png`;
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

                {/* SmartDocX Logo Text */}
                <div style={{ fontSize: "40px", fontWeight: "bold", marginBottom: "5px" }}>
                    <span style={{ color: "#003366" }}>Smart</span>
                    <span style={{ color: "#007BFF" }}>DocX</span>
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

export default SmartDocXPoster;
