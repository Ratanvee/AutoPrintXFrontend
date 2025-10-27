// import React, { useState, useEffect } from "react";
// import axios from "axios";
// "use client"

// // import React, { useState } from "react"
// import { motion, AnimatePresence } from "framer-motion"
// import { useDropzone } from "react-dropzone"
// import { Link } from "react-router-dom"
// import { Upload, X, FileText, ImageIcon, File, Check, CreditCard, ArrowLeft, ArrowRight, IndianRupee } from "lucide-react"
// import '../styles/styles/payment.css';// Updated import path for payment styles
// import { useParams } from 'react-router-dom';
// import { useLocation } from 'react-router-dom';
// import CurrencyInput from 'react-currency-input-field';
// import * as pdfjsLib from "pdfjs-dist";
// import { GlobalWorkerOptions } from "pdfjs-dist/build/pdf.mjs";
// import { UploadDataAPI, CreateOrdersRazorpay, UserToUploadDataAPI } from '../api/endpoints'
// import OwnerProfileCard from "../components/UploadPage/OwnerProfile";


// GlobalWorkerOptions.workerSrc = new URL(
//   "pdfjs-dist/build/pdf.worker.mjs",
//   import.meta.url
// ).toString();

// export default function PrintOrderForm() {
//   const [formData, setFormData] = useState({
//     PaperSize: "",
//     PaperType: "",
//     PrintColor: "",
//     PrintSide: "",
//     Binding: "",
//     NumberOfCopies: 1,
//     PaymentStatus: "",
//     Owner: "",
//     Updated_at: "",
//     Transaction_id: "",
//     NoOfPages: "",
//   });


//   const shopData = {
//     name: "SmartDocX Services",
//     service: "Financial Document Preparation",
//     location: "Bay Area, San Francisco, CA",
//     documentsProcessed: "500+ successful cases"
//   };




//   const location = useLocation();
//   const [file, setFile] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   const [orderId, setOrderId] = useState("");

//   const generateOrderId = () => {
//     const now = new Date();
//     const timestamp = now
//       .toISOString()
//       .replace(/[-T:.Z]/g, "")
//       .slice(10, 14); // HHMMSS
//     const randomPart = Math.random().toString(36).substring(6, 8).toUpperCase();
//     return `ORD-${timestamp}-${randomPart}`;
//   };

//   const [totalAmount, setTotalAmount] = useState("")
//   const [pages, setPages] = useState(0)
//   const calculateTotal = () => {
//     const basePrice = printOptions.printColor === "bw" ? 5 : 10
//     const paperCost = printOptions.paperType === "premium" ? 2 : 0
//     const bindingCost = printOptions.binding === "spiral" ? 3 : printOptions.binding === "hardcover" ? 8 : 0
//     const pages = uploadedFiles.reduce((acc, file) => acc + file.pages, 0) // Assume 10 pages per file
//     // console.log("this is pages:", pages)
//     // console.log("this is copies:", printOptions.copies)
//     // const total = 
//     // setTotalAmount(total)
//     return ((basePrice * pages + paperCost + bindingCost) * printOptions.copies).toFixed(2)
//   }


//   // console.log("this is total price : ", calculateTotal())

//   const [uniqueUrl, setuniqueUrl] = useState("")


//   const handleFinalSubmit = async () => {
//     setLoading(true);
//     const generatedOrderId = generateOrderId();
//     setOrderId(generatedOrderId);
//     const totalamount = calculateTotal();
//     setTotalAmount(totalamount)

//     try {
//       const formData = new FormData();

//       // Add uploaded files
//       uploadedFiles.forEach((file) => {
//         formData.append('FileUpload', file.file);  // Assuming file.file is the actual file object
//       });

//       // Add print options
//       formData.append('PaperSize', printOptions.paperSize);
//       formData.append('PaperType', printOptions.paperType);
//       formData.append('PrintColor', printOptions.printColor);
//       formData.append('PrintSide', printOptions.printSides);
//       formData.append('Binding', printOptions.binding);
//       formData.append('NumberOfCopies', printOptions.copies);
//       formData.append('PaymentAmount', amount);
//       formData.append('NoOfPages', pages);
//       formData.append('PaymentStatus', transactionId ? 1 : 0);
//       formData.append('Transaction_id', transactionId || "");
//       formData.append('CustomerName', cashPayerName || "");
//       formData.append('OrderId', generatedOrderId);

//       // Add payment method
//       formData.append('PaymentMethod', paymentMethod);

//       if (paymentMethod === "card") {
//         formData.append('cardName', document.getElementById('cardName').value);
//         formData.append('cardNumber', document.getElementById('cardNumber').value);
//         formData.append('expDate', document.getElementById('expDate').value);
//         formData.append('cvv', document.getElementById('cvv').value);
//         formData.append('billingAddress', document.getElementById('billingAddress').value);
//       }

//       // Generate a unique URL slug from location pathname


//       // const response = await axios.post(`http://127.0.0.1:8000/api/upload/${uniqueUrl}/`, formData, {
//       //   withCredentials: true,
//       //   headers: { 'Content-Type': 'multipart/form-data' },
//       // });
//       const data = await UploadDataAPI(formData, uniqueUrl)

//       alert("Order submitted successfully!");
//       console.log("Backend response:", data);

//       // Move to confirmation step
//       nextStep();
//     } catch (error) {
//       console.error("Order submission failed:", error);
//       alert("Failed to submit order. Please try again.");
//     }

//     setLoading(false);
//   };

//   const [currentStep, setCurrentStep] = useState(1)
//   const [uploadedFiles, setUploadedFiles] = useState([])
//   const [printOptions, setPrintOptions] = useState({
//     paperSize: "a4",
//     paperType: "standard",
//     printColor: "bw",
//     printSides: "single",
//     binding: "none",
//     copies: 1,
//   })
//   const [paymentMethod, setPaymentMethod] = useState("rezorpay")



//   // const { getRootProps, getInputProps, isDragActive } = useDropzone({
//   //   // accept all documents and images
//   //   accept: {
//   //     "application/pdf": [".pdf"],
//   //     "application/msword": [".doc"],
//   //     "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
//   //     "image/*": [".png", ".jpg", ".jpeg"],
//   //   },
//   //   onDrop: async (acceptedFiles) => {
//   //     const newFiles = await Promise.all(
//   //       acceptedFiles.map(async (file) => {
//   //         let pageCount = null;

//   //         if (file.type === "application/pdf") {
//   //           try {
//   //             const pdfData = await file.arrayBuffer();
//   //             const pdfDoc = await pdfjsLib.getDocument({ data: pdfData }).promise;
//   //             pageCount = pdfDoc.numPages;
//   //             setPages(pageCount)
//   //           } catch (err) {
//   //             console.error("Error reading PDF:", err);
//   //             pageCount = null;
//   //           }
//   //         } else {
//   //           // For Word/Images just mark as unknown (no conversion now)
//   //           pageCount = null;
//   //         }

//   //         return {
//   //           id: Date.now() + Math.random(),
//   //           file,
//   //           name: file.name,
//   //           size: file.size,
//   //           type: file.type,
//   //           pages: pageCount,
//   //         };
//   //       })
//   //     );

//   //     setUploadedFiles((prev) => [...prev, ...newFiles]);
//   //   },
//   // });

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({
//     // accept all documents and images
//     accept: {
//       "application/pdf": [".pdf"],
//       "application/msword": [".doc"],
//       "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
//       "image/*": [".png", ".jpg", ".jpeg"],
//     },
//     onDrop: async (acceptedFiles) => {
//       const newFiles = await Promise.all(
//         acceptedFiles.map(async (file) => {
//           let pageCount = null;
//           let fileType = file.type; // Original MIME type

//           // 1. Handle Images: Set page count to 1
//           if (fileType.startsWith("image/")) {
//             pageCount = 1;

//             // 2. Handle PDFs: Calculate page count using pdfjsLib
//           } else if (fileType === "application/pdf") {
//             try {
//               // Ensure pdfjsLib is correctly loaded/available
//               const pdfData = await file.arrayBuffer();
//               const pdfDoc = await pdfjsLib.getDocument({ data: pdfData }).promise;
//               pageCount = pdfDoc.numPages;
//               setPages(pageCount) // Assuming setPages is meant to track total/last page count
//             } catch (err) {
//               console.error("Error reading PDF:", err);
//               pageCount = null;
//             }

//             // 3. Handle Word/Other Docs: Requires Server/External Library for Conversion
//           } else {
//             // *** IMPORTANT: Word to PDF conversion is NOT possible reliably in client-side JS. ***
//             // You need a backend service (e.g., using libraries like LibreOffice, unoconv, or a cloud API)
//             // to convert .doc/.docx to PDF before page counting.

//             // OPTION A: Treat as single page (If conversion is not strictly needed for pricing)
//             // pageCount = 1; 

//             // OPTION B: Skip conversion and page count (As in original code, requires manual later)
//             console.warn(`File ${file.name} is a non-PDF document. Conversion to PDF required for page count.`);
//             pageCount = null; // Cannot determine page count without conversion
//           }

//           return {
//             id: Date.now() + Math.random(),
//             file,
//             name: file.name,
//             size: file.size,
//             type: fileType, // Use original type
//             pages: pageCount, // Will be 1 for image, N for PDF, or null for Word/Other
//           };
//         })
//       );

//       setUploadedFiles((prev) => [...prev, ...newFiles]);
//     },
//   });

//   const removeFile = (id) => {
//     setUploadedFiles((prev) => prev.filter((file) => file.id !== id))
//   }

//   const getFileIcon = (type) => {
//     if (type.includes("pdf")) return <FileText size={20} />
//     if (type.includes("image")) return <ImageIcon size={20} />
//     return <File size={20} />
//   }

//   const formatFileSize = (bytes) => {
//     if (bytes === 0) return "0 Bytes"
//     const k = 1024
//     const sizes = ["Bytes", "KB", "MB", "GB"]
//     const i = Math.floor(Math.log(bytes) / Math.log(k))
//     return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
//   }



//   // console.log("this is total:", calculateTotal())
//   const nextStep = () => {
//     if (currentStep < 4) setCurrentStep(currentStep + 1)
//   }

//   const prevStep = () => {
//     if (currentStep > 1) setCurrentStep(currentStep - 1)
//   }

//   const steps = [
//     { number: 1, title: "Upload", active: currentStep >= 1, completed: currentStep > 1 },
//     { number: 2, title: "Options", active: currentStep >= 2, completed: currentStep > 2 },
//     { number: 3, title: "Payment", active: currentStep >= 3, completed: currentStep > 3 },
//     { number: 4, title: "Confirm", active: currentStep >= 4, completed: currentStep > 4 },
//   ]


//   const [amount, setAmount] = useState("");
//   const [transactionId, setTransactionId] = useState("");
//   const [cashPayerName, setCashPayerName] = useState("");

//   const handlePayment = async (e) => {
//     e.preventDefault();
//     const order = await CreateOrdersRazorpay(JSON.stringify({amount}))
//     // if (!order) {
//     //   alert("Server is not working ... Please Try again later")
//     //   return 
//     // }

//     // 2. Open Razorpay UI
//     const options = {
//       key: import.meta.env.VITE_RazorPay_Key,
//       amount: order.amount || amount*100, // already in paise from backend
//       currency: order.currency || "INR",
//       name: "PrintEase",
//       description: "Test Transaction",
//       order_id: order.id,
//       handler: function (res) {
//         let paidAmount = order.amount / 100; // convert paise → INR for display
//         setTransactionId(res.razorpay_payment_id);
//         alert(`Payment successful! ₹${paidAmount} paid. Transaction ID: ${res.razorpay_payment_id}`);
//       },
//       theme: { color: "#3399cc" },
//     };



//     const rzp = new window.Razorpay(options);
//     rzp.open();
//   };

//   const KnowUser = async (uniqueUrl) => {
//     const response = await UserToUploadDataAPI(uniqueUrl)
//   }

//   // ✅ Whenever uploadedFiles or printOptions change, recalculate amount
//   useEffect(() => {
//     document.title = 'AutoPrintX | Upload & Print';
//     const uniqueUrl = location.pathname.split('/').pop();
//     setuniqueUrl(uniqueUrl);
//     KnowUser(uniqueUrl);
//     const total = calculateTotal();
//     setAmount(total);
//   }, [uploadedFiles, printOptions]);


//   const handleCompleteOrder = () => {
//     if (paymentMethod === "online") {
//       if (!transactionId) {
//         alert("⚠️ Please complete online payment first.");
//         return;
//       }
//     } else if (paymentMethod === "cash") {
//       if (!cashPayerName.trim()) {
//         alert("⚠️ Please enter your name to confirm cash payment.");
//         return;
//       }
//     }
//     else if (cashPayerName.trim() === "" || transactionId === "") {
//       alert("⚠️ Please enter your name or complete online payment.");
//       return;
//     }

//     // ✅ If all checks passed
//     handleFinalSubmit({ paymentMethod, transactionId, cashPayerName });
//   };


//   return (
//     <div className="payment-page">
//       {/* Header */}
//       <header className="header">
//         <nav className="navbar">
//           <div className="logo">
//             <h1>
//               Smart<span>DocX</span>
//             </h1>
//           </div>
//           <Link to="/" className="back-link">
//             <ArrowLeft size={16} />
//             Back to Home
//           </Link>
//         </nav>
//       </header>

//       <main className="payment-main">
//         <div className="payment-container">
//           <motion.div className="payment-header" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
//             <h1>Complete Your Order</h1>
//             <p>Upload your documents and make payment</p>
//           </motion.div>

//           {/* Progress Steps */}
//           <motion.div
//             className="payment-steps"
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.1 }}
//           >
//             {steps.map((step, index) => (
//               <React.Fragment key={step.number}>
//                 <div className={`step ${step.active ? "active" : ""} ${step.completed ? "completed" : ""}`}>
//                   <div className="step-number">{step.completed ? <Check size={16} /> : step.number}</div>
//                   <div className="step-text">{step.title}</div>
//                 </div>
//                 {index < steps.length - 1 && <div className={`step-line ${step.completed ? "completed" : ""}`}></div>}
//               </React.Fragment>
//             ))}
//           </motion.div>

//           {/* Step Content */}
//           <AnimatePresence mode="wait">
//             {currentStep === 1 && (
//               <motion.div
//                 key="step1"
//                 className="payment-step-content"
//                 initial={{ opacity: 0, x: 50 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 exit={{ opacity: 0, x: -50 }}
//                 transition={{ duration: 0.3 }}
//               >
//                 <h2>Upload Your Documents</h2>
//                 <div className="upload-container">
//                   <div {...getRootProps()} className={`upload-area ${isDragActive ? "drag-active" : ""}`}>
//                     <input {...getInputProps()} />
//                     <Upload size={48} />
//                     <h3>{isDragActive ? "Drop files here" : "Drag & Drop Files Here"}</h3>
//                     <p>or</p>
//                     <button className="btn-primary">Browse Files</button>
//                     <p className="upload-info">Supported formats: PDF, DOCX, JPG, PNG (Max: 20MB per file)</p>
//                   </div>

//                   {uploadedFiles.length > 0 && (
//                     <motion.div
//                       className="uploaded-files"
//                       initial={{ opacity: 0, y: 20 }}
//                       animate={{ opacity: 1, y: 0 }}
//                     >
//                       <h3>Uploaded Files ({uploadedFiles.length})</h3>
//                       <div className="file-list">
//                         <AnimatePresence>
//                           {uploadedFiles.map((file) => (
//                             <motion.div
//                               key={file.id}
//                               className="file-item"
//                               initial={{ opacity: 0, scale: 0.9 }}
//                               animate={{ opacity: 1, scale: 1 }}
//                               exit={{ opacity: 0, scale: 0.9 }}
//                               layout
//                             >
//                               <div className="file-icon">{getFileIcon(file.type)}</div>
//                               <div className="file-info">
//                                 <p className="file-name">{file.name}</p>
//                                 <p className="file-size">{formatFileSize(file.size)}</p>
//                               </div>
//                               <button className="remove-file" onClick={() => removeFile(file.id)}>
//                                 <X size={16} />
//                               </button>
//                             </motion.div>
//                           ))}
//                         </AnimatePresence>
//                       </div>
//                     </motion.div>
//                   )}
//                 </div>

//                 <div className="step-buttons">
//                   <Link to="/" className="btn-secondary">
//                     Cancel
//                   </Link>
//                   <motion.button
//                     className="btn-primary"
//                     onClick={nextStep}
//                     disabled={uploadedFiles.length === 0}
//                     whileHover={{ scale: uploadedFiles.length > 0 ? 1.05 : 1 }}
//                     whileTap={{ scale: uploadedFiles.length > 0 ? 0.95 : 1 }}
//                   >
//                     Next: Choose Options <ArrowRight size={16} />
//                   </motion.button>
//                 </div>
//               </motion.div>
//             )}

//             {currentStep === 2 && (
//               <motion.div
//                 key="step2"
//                 className="payment-step-content"
//                 initial={{ opacity: 0, x: 50 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 exit={{ opacity: 0, x: -50 }}
//                 transition={{ duration: 0.3 }}
//               >
//                 <h2>Choose Printing Options</h2>
//                 <div className="options-container">
//                   <div className="options-form">
//                     <div className="form-group">
//                       <label htmlFor="paperSize">Paper Size</label>
//                       <select
//                         id="paperSize"
//                         value={printOptions.paperSize}
//                         onChange={(e) => setPrintOptions({ ...printOptions, paperSize: e.target.value })}
//                       >
//                         <option value="a4">A4 (210 × 297 mm)</option>
//                         <option value="letter">Letter (8.5 × 11 in)</option>
//                         <option value="legal">Legal (8.5 × 14 in)</option>
//                         <option value="a3">A3 (297 × 420 mm)</option>
//                       </select>
//                     </div>

//                     <div className="form-group">
//                       <label htmlFor="paperType">Paper Type</label>
//                       <select
//                         id="paperType"
//                         value={printOptions.paperType}
//                         onChange={(e) => setPrintOptions({ ...printOptions, paperType: e.target.value })}
//                       >
//                         <option value="standard">Standard (80 gsm)</option>
//                         <option value="premium">Premium (100 gsm)</option>
//                         <option value="glossy">Glossy (120 gsm)</option>
//                         <option value="matte">Matte (120 gsm)</option>
//                       </select>
//                     </div>

//                     <div className="form-group">
//                       <label htmlFor="printColor">Print Color</label>
//                       <select
//                         id="printColor"
//                         value={printOptions.printColor}
//                         onChange={(e) => setPrintOptions({ ...printOptions, printColor: e.target.value })}
//                       >
//                         <option value="bw">Black & White</option>
//                         <option value="color">Color</option>
//                       </select>
//                     </div>

//                     <div className="form-group">
//                       <label htmlFor="printSides">Print Sides</label>
//                       <select
//                         id="printSides"
//                         value={printOptions.printSides}
//                         onChange={(e) => setPrintOptions({ ...printOptions, printSides: e.target.value })}
//                       >
//                         <option value="single">Single-sided</option>
//                         <option value="double">Double-sided</option>
//                       </select>
//                     </div>

//                     <div className="form-group">
//                       <label htmlFor="binding">Binding</label>
//                       <select
//                         id="binding"
//                         value={printOptions.binding}
//                         onChange={(e) => setPrintOptions({ ...printOptions, binding: e.target.value })}
//                       >
//                         <option value="none">None</option>
//                         <option value="staple">Staple</option>
//                         <option value="spiral">Spiral Binding</option>
//                         <option value="hardcover">Hardcover Binding</option>
//                       </select>
//                     </div>

//                     <div className="form-group">
//                       <label htmlFor="copies">Number of Copies</label>
//                       <input
//                         type="number"
//                         id="copies"
//                         min="1"
//                         value={printOptions.copies}
//                         onChange={(e) => setPrintOptions({ ...printOptions, copies: Number.parseInt(e.target.value) })}
//                       />
//                     </div>
//                   </div>

//                   <motion.div
//                     className="options-summary"
//                     initial={{ opacity: 0, x: 20 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     transition={{ delay: 0.2 }}
//                   >
//                     <h3>Order Summary</h3>
//                     <div className="summary-items">
//                       {uploadedFiles.map((file, index) => (
//                         <div key={file.id} className="summary-item">
//                           <span>{file.name} ({file.pages} pages)</span>
//                           <span>₹5/page</span>
//                         </div>
//                       ))}
//                       {printOptions.paperType === "premium" && (
//                         <div className="summary-item">
//                           <span>Premium Paper</span>
//                           <span>₹2/page</span>
//                         </div>
//                       )}
//                       {printOptions.printColor === "color" && (
//                         <div className="summary-item">
//                           <span>Color Printing</span>
//                           <span>₹10/page</span>
//                         </div>
//                       )}
//                       {printOptions.binding !== "none" && (
//                         <div className="summary-item">
//                           <span>{printOptions.binding === "spiral" ? "Spiral" : "Hardcover"} Binding</span>
//                           <span>${printOptions.binding === "spiral" ? "3.50" : "8.00"}</span>
//                         </div>
//                       )}
//                     </div>
//                     <div className="summary-divider"></div>
//                     <div className="summary-item total">
//                       <span>Total</span>
//                       <span>₹{calculateTotal()}</span>
//                     </div>
//                   </motion.div>
//                 </div>

//                 <div className="step-buttons">
//                   <motion.button
//                     className="btn-secondary"
//                     onClick={prevStep}
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                   >
//                     <ArrowLeft size={16} /> Previous
//                   </motion.button>
//                   <motion.button
//                     className="btn-primary"
//                     onClick={nextStep}
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                   >
//                     Next: Payment <ArrowRight size={16} />
//                   </motion.button>
//                 </div>
//               </motion.div>
//             )}

//             {currentStep === 3 && (
//               <motion.div
//                 key="step3"
//                 className="payment-step-content"
//                 initial={{ opacity: 0, x: 50 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 exit={{ opacity: 0, x: -50 }}
//                 transition={{ duration: 0.3 }}
//               >
//                 <h2>Payment Information</h2>
//                 <div className="payment-options">
//                   <div className="payment-tabs">
//                     <button
//                       className={`payment-tab ${paymentMethod === "rezorpay" ? "active" : ""}`}
//                       onClick={() => setPaymentMethod("rezorpay")}
//                     >
//                       <CreditCard size={16} />
//                       RazorPay
//                     </button>
//                     <button
//                       className={`payment-tab ${paymentMethod === "cash" ? "active" : ""}`}
//                       onClick={() => setPaymentMethod("cash")}
//                     >
//                       <CreditCard size={16} />
//                       Cash
//                     </button>
//                     <button
//                       className={`payment-tab ${paymentMethod === "card" ? "active" : ""}`}
//                       onClick={() => setPaymentMethod("card")}
//                     >
//                       {/* <CreditCard size={16} /> */}
//                       Credit Card
//                     </button>
//                     <button
//                       className={`payment-tab ${paymentMethod === "paypal" ? "active" : ""}`}
//                       onClick={() => setPaymentMethod("paypal")}
//                     >
//                       PayPal
//                     </button>
//                     <button
//                       className={`payment-tab ${paymentMethod === "bank" ? "active" : ""}`}
//                       onClick={() => setPaymentMethod("bank")}
//                     >
//                       Bank Transfer
//                     </button>
//                   </div>

//                   <AnimatePresence mode="wait">
//                     {paymentMethod === "rezorpay" && (
//                       <motion.div
//                         key="rezorpay"
//                         className="payment-form"
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         exit={{ opacity: 0, y: -20 }}
//                       >
//                         <div className="form-group">
//                           {/* <input type="text" id="totalAmount" value={calculateTotal()} placeholder=" ₹" disabled /> */}
//                           <form onSubmit={handlePayment} className="flex flex-col gap-4 w-64">
//                             <label htmlFor="cardName">Full Name</label>
//                             <input type="text" id="cardName" onChange={(e) => setCashPayerName(e.target.value)} placeholder="John Doe" required />
//                             <label htmlFor="totalAmount">Total Amount</label>
//                             <div className="amount-box" style={{flexGrow: 1, minWidth: '250px', display: 'flex', alignItems: 'center', position: 'relative'}}>
//                               <IndianRupee size={20} className="absolute ml-2 mt-3 text-gray-500" />
//                               <input
//                                 type="number"
//                                 placeholder="Enter Amount (₹)"
//                                 value={amount}
//                                 id="totalAmount"
//                                 onChange={(e) => setAmount(e.target.value)}
//                                 required
//                                 className="border p-2 rounded"
//                                 disabled
//                               />
//                             </div>

//                             <button type="submit" className="payment-tab">Payment</button>
//                           </form>
//                         </div>
//                         {transactionId && (
//                           <p className="mt-4 text-green-600">
//                             ✅ Payment Successful! Transaction ID: <b>{transactionId}</b>
//                           </p>
//                         )}


//                       </motion.div>
//                     )}
//                     {paymentMethod === "cash" && (
//                       <motion.div
//                         key="cash"
//                         className="payment-form"
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         exit={{ opacity: 0, y: -20 }}
//                       >
//                         <div className="form-group">
//                           <label htmlFor="cardName">Full Name</label>
//                           <input type="text" id="cardName" onChange={(e) => setCashPayerName(e.target.value)} placeholder="John Doe" required />
//                         </div>
//                         {cashPayerName && (
//                           <p className="mt-4 text-green-600">
//                             ✅ You can give money to Owner : <b>{cashPayerName}</b>
//                           </p>
//                         )}


//                       </motion.div>
//                     )}


//                     {paymentMethod === "card" && (
//                       <motion.div
//                         key="card"
//                         className="payment-form"
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         exit={{ opacity: 0, y: -20 }}
//                       >
//                         <div className="form-group">
//                           <label htmlFor="cardName">Cardholder Name</label>
//                           <input type="text" id="cardName" placeholder="John Doe" required />
//                         </div>
//                         <div className="form-group">
//                           <label htmlFor="cardNumber">Card Number</label>
//                           <input type="text" id="cardNumber" placeholder="1234 5678 9012 3456" required />
//                         </div>
//                         <div className="form-row">
//                           <div className="form-group">
//                             <label htmlFor="expDate">Expiration Date</label>
//                             <input type="text" id="expDate" placeholder="MM/YY" required />
//                           </div>
//                           <div className="form-group">
//                             <label htmlFor="cvv">CVV</label>
//                             <input type="text" id="cvv" placeholder="123" required />
//                           </div>
//                         </div>
//                         <div className="form-group">
//                           <label htmlFor="billingAddress">Billing Address</label>
//                           <input type="text" id="billingAddress" placeholder="Street Address" required />
//                         </div>
//                       </motion.div>
//                     )}

//                     {paymentMethod === "paypal" && (
//                       <motion.div
//                         key="paypal"
//                         className="paypal-content"
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         exit={{ opacity: 0, y: -20 }}
//                       >
//                         <div className="paypal-info">
//                           <img src="https://placehold.co/200x80/0070ba/white?text=PayPal" alt="PayPal" />
//                           <p>You will be redirected to PayPal to complete your payment securely.</p>
//                         </div>
//                       </motion.div>
//                     )}

//                     {paymentMethod === "bank" && (
//                       <motion.div
//                         key="bank"
//                         className="bank-content"
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         exit={{ opacity: 0, y: -20 }}
//                       >
//                         <h3>Bank Transfer Details</h3>
//                         <div className="bank-details">
//                           <div className="bank-detail">
//                             <span>Bank Name:</span>
//                             <span>SmartBank</span>
//                           </div>
//                           <div className="bank-detail">
//                             <span>Account Name:</span>
//                             <span>SmartDocX Inc.</span>
//                           </div>
//                           <div className="bank-detail">
//                             <span>Account Number:</span>
//                             <span>1234567890</span>
//                           </div>
//                           <div className="bank-detail">
//                             <span>Reference:</span>
//                             <span>ORD-2025-001</span>
//                           </div>
//                         </div>
//                       </motion.div>
//                     )}
//                   </AnimatePresence>
//                 </div>


//                 <div className="step-buttons">
//                   <motion.button
//                     className="btn-secondary"
//                     onClick={prevStep}
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                   >
//                     <ArrowLeft size={16} /> Previous
//                   </motion.button>
//                   {/* <motion.button
//                     className="btn-primary"
//                     onClick={nextStep}
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                   >
//                     Complete Order <ArrowRight size={16} />
//                   </motion.button> */}
//                   <motion.button
//                     className="btn-primary"
//                     onClick={handleCompleteOrder}
//                     disabled={loading}
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                   >
//                     Complete Order <ArrowRight size={16} />
//                   </motion.button>
//                   {/* <motion.button
//                     className="btn-primary"
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     disabled={loading}
//                     onClick={() => {
//                       if (!transactionId) {
//                         alert("⚠️ Please confirm payment first before completing your order.");
//                         return;
//                       }
//                       handleFinalSubmit(); // ✅ Proceed only if transaction ID exists
//                     }}
//                   >
//                     Complete Order <ArrowRight size={16} />
//                   </motion.button> */}

//                 </div>
//               </motion.div>
//             )}

//             {currentStep === 4 && (
//               <motion.div
//                 key="step4"
//                 className="payment-step-content"
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0, scale: 0.9 }}
//                 transition={{ duration: 0.5 }}
//               >
//                 <div className="confirmation-content">
//                   <motion.div
//                     className="confirmation-icon"
//                     initial={{ scale: 0 }}
//                     animate={{ scale: 1 }}
//                     transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
//                   >
//                     <Check size={48} />
//                   </motion.div>
//                   <h2>Order Confirmed!</h2>
//                   <p>Your order has been successfully placed and is being processed.</p>

//                   <div className="order-details">
//                     <h3>Order Details</h3>
//                     <div className="order-detail">
//                       <span>Order Number:</span>
//                       <span>{orderId}</span>
//                     </div>
//                     <div className="order-detail">
//                       <span>Order Date:</span>
//                       <span>{new Date().toLocaleDateString()}</span>
//                     </div>
//                     <div className="order-detail">
//                       <span>Order Time:</span>
//                       <span>{new Date().toLocaleTimeString()}</span>
//                     </div>
//                     <div className="order-detail">
//                       <span>Total Amount:</span>
//                       <span>₹{calculateTotal()}</span>
//                     </div>
//                     <div className="order-detail">
//                       <span>Payment Method:</span>
//                       <span>
//                         {/* {paymentMethod === "rezorpay"
//                           ? "Online Payment"
//                           : paymentMethod === "cash"
//                             ? "Pay at Store"
//                             : "Bank Transfer"} */}
//                         {paymentMethod}
//                       </span>
//                     </div>
//                     <div className="order-detail">
//                       <span>Estimated Completion:</span>
//                       <span>{new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
//                     </div>
//                   </div>

//                   <p className="confirmation-message">
//                     We've sent a confirmation email to your registered email address. You can track your order status in
//                     the dashboard.
//                   </p>

//                   <div className="confirmation-buttons">
//                     <Link to="/" className="btn-secondary">
//                       Back to Home
//                     </Link>
//                     <Link to="/dashboard" className="btn-primary">
//                       Track Order
//                     </Link>
//                   </div>
//                 </div>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </div>
//       </main>
//       <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">Shop Profile Preview</h1>
//       <OwnerProfileCard shop={shopData} />
//     </div>
//   );
// }




// import React, { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import { Link, useLocation } from "react-router-dom";
// import { ArrowLeft, Check } from "lucide-react";
// import '../styles/styles/payment.css';
// import '../styles/styles/ownerprofile.css';

// // Import step components
// import StepUpload from "../components/UploadPage/steps/StepUpload";
// import StepOptions from "../components/UploadPage/steps/StepOptions";
// import StepPayment from "../components/UploadPage/steps/StepPayment";
// import StepConfirmation from "../components/UploadPage/steps/StepConfirmation";
// import OwnerProfileCard from "../components/UploadPage/OwnerProfile";
// import { UploadDataAPI, UserToUploadDataAPI } from '../api/endpoints';

// export default function PrintOrderForm() {
//   const location = useLocation();

//   // State management
//   const [currentStep, setCurrentStep] = useState(1);
//   const [uploadedFiles, setUploadedFiles] = useState([]);
//   const [printOptions, setPrintOptions] = useState({
//     paperSize: "a4",
//     paperType: "standard",
//     printColor: "bw",
//     printSides: "single",
//     binding: "none",
//     copies: 1,
//   });
//   const [paymentMethod, setPaymentMethod] = useState("rezorpay");
//   const [amount, setAmount] = useState("");
//   const [transactionId, setTransactionId] = useState("");
//   const [cashPayerName, setCashPayerName] = useState("");
//   const [orderId, setOrderId] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [uniqueUrl, setUniqueUrl] = useState("");

//   // const shopData = {
//   //   name: "AutoPrintX Print Hub",
//   //   ownerName: "Owned by John Smith",
//   //   service: "Professional Printing & Binding",
//   //   location: "123 Main St, New York, NY",
//   //   image: "https://via.placeholder.com/150", // Replace with your image URL
//   //   whatsapp: "1234567890",
//   //   phone: "+11234567890",
//   //   email: "contact@autoprintx.com"
//   // };
//   const [shopData, setShopData] = useState(null);
//   // const [shopData, setShopData] = useState({});
//   // Calculate total price
//   const calculateTotal = () => {
//     const basePrice = printOptions.printColor === "bw" ? 5 : 10;
//     const paperCost = printOptions.paperType === "premium" ? 2 : 0;
//     const bindingCost = printOptions.binding === "spiral" ? 3 : printOptions.binding === "hardcover" ? 8 : 0;
//     const pages = uploadedFiles.reduce((acc, file) => acc + (file.pages || 0), 0);
//     return ((basePrice * pages + paperCost + bindingCost) * printOptions.copies).toFixed(2);
//   };

//   // Generate order ID
//   const generateOrderId = () => {
//     const now = new Date();
//     const timestamp = now.toISOString().replace(/[-T:.Z]/g, "").slice(10, 14);
//     const randomPart = Math.random().toString(36).substring(6, 8).toUpperCase();
//     return `ORD-${timestamp}-${randomPart}`;
//   };

//   // Handle final submission
//   const handleFinalSubmit = async ({ paymentMethod, transactionId, cashPayerName }) => {
//     setLoading(true);
//     const generatedOrderId = generateOrderId();
//     setOrderId(generatedOrderId);

//     try {
//       const formData = new FormData();

//       uploadedFiles.forEach((file) => {
//         formData.append('FileUpload', file.file);
//       });

//       formData.append('PaperSize', printOptions.paperSize);
//       formData.append('PaperType', printOptions.paperType);
//       formData.append('PrintColor', printOptions.printColor);
//       formData.append('PrintSide', printOptions.printSides);
//       formData.append('Binding', printOptions.binding);
//       formData.append('NumberOfCopies', printOptions.copies);
//       formData.append('PaymentAmount', amount);
//       formData.append('NoOfPages', uploadedFiles.reduce((acc, file) => acc + (file.pages || 0), 0));
//       formData.append('PaymentStatus', transactionId ? 1 : 0);
//       formData.append('Transaction_id', transactionId || "");
//       formData.append('CustomerName', cashPayerName || "");
//       formData.append('OrderId', generatedOrderId);
//       formData.append('PaymentMethod', paymentMethod);

//       const data = await UploadDataAPI(formData, uniqueUrl);
//       alert("Order submitted successfully!");
//       console.log("Backend response:", data);
//       nextStep();
//     } catch (error) {
//       console.error("Order submission failed:", error);
//       alert("Failed to submit order. Please try again.");
//     }

//     setLoading(false);
//   };

//   // Navigation functions
//   const nextStep = () => {
//     if (currentStep < 4) setCurrentStep(currentStep + 1);
//   };

//   const prevStep = () => {
//     if (currentStep > 1) setCurrentStep(currentStep - 1);
//   };

//   // Steps configuration
//   const steps = [
//     { number: 1, title: "Upload", active: currentStep >= 1, completed: currentStep > 1 },
//     { number: 2, title: "Options", active: currentStep >= 2, completed: currentStep > 2 },
//     { number: 3, title: "Payment", active: currentStep >= 3, completed: currentStep > 3 },
//     { number: 4, title: "Confirm", active: currentStep >= 4, completed: currentStep > 4 },
//   ];

//   const ownerInfo = async (url) => {
//     const data = await UserToUploadDataAPI(url);
//     return data;

//   }

//   // Initialize on mount
//   useEffect(() => {
//     document.title = 'AutoPrintX | Upload & Print';
//     const url = location.pathname.split('/').pop();
//     setUniqueUrl(url);
//     const data = ownerInfo(url);
//     // 2. Your API function returns null on error (4xx/5xx or network fail)
//     if (data) {
//       console.log("API call successful, data received:", data);
//       setShopData(data); // Set the received data into state
//     } else {
//       // If data is null, the API function already handled the toast/error message,
//       // so we just log a failure and keep shopData as null.
//       console.warn("API call failed, data is null. Error message shown via toast.");
//     }
//   }, [location]);

//   // Update amount when files or options change
//   useEffect(() => {
//     const total = calculateTotal();
//     setAmount(total);
//   }, [uploadedFiles, printOptions]);

//   return (
//     <div className="payment-page">
//       {/* Header */}
//       <header className="header">
//         <nav className="navbar">
//           <div className="logo">
//             <h1>Smart<span>DocX</span></h1>
//           </div>
//           <Link to="/" className="back-link">
//             <ArrowLeft size={16} />
//             Back to Home
//           </Link>
//         </nav>
//       </header>
//       <OwnerProfileCard shop={shopData} />

//       <main className="payment-main">
//         <div className="payment-container">
//           <motion.div
//             className="payment-header"
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//           >
//             <h1>Complete Your Order</h1>
//             <p>Upload your documents and make payment</p>
//           </motion.div>

//           {/* Progress Steps */}
//           <motion.div
//             className="payment-steps"
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.1 }}
//           >
//             {steps.map((step, index) => (
//               <React.Fragment key={step.number}>
//                 <div className={`step ${step.active ? "active" : ""} ${step.completed ? "completed" : ""}`}>
//                   <div className="step-number">
//                     {step.completed ? <Check size={16} /> : step.number}
//                   </div>
//                   <div className="step-text">{step.title}</div>
//                 </div>
//                 {index < steps.length - 1 && (
//                   <div className={`step-line ${step.completed ? "completed" : ""}`}></div>
//                 )}
//               </React.Fragment>
//             ))}
//           </motion.div>

//           {/* Step Content */}
//           {currentStep === 1 && (
//             <StepUpload
//               uploadedFiles={uploadedFiles}
//               setUploadedFiles={setUploadedFiles}
//               nextStep={nextStep}
//             />
//           )}

//           {currentStep === 2 && (
//             <StepOptions
//               printOptions={printOptions}
//               setPrintOptions={setPrintOptions}
//               uploadedFiles={uploadedFiles}
//               calculateTotal={calculateTotal}
//               nextStep={nextStep}
//               prevStep={prevStep}
//             />
//           )}

//           {currentStep === 3 && (
//             <StepPayment
//               paymentMethod={paymentMethod}
//               setPaymentMethod={setPaymentMethod}
//               amount={amount}
//               setAmount={setAmount}
//               transactionId={transactionId}
//               setTransactionId={setTransactionId}
//               cashPayerName={cashPayerName}
//               setCashPayerName={setCashPayerName}
//               loading={loading}
//               handleFinalSubmit={handleFinalSubmit}
//               prevStep={prevStep}
//             />
//           )}

//           {currentStep === 4 && (
//             <StepConfirmation
//               orderId={orderId}
//               calculateTotal={calculateTotal}
//               paymentMethod={paymentMethod}
//             />
//           )}
//         </div>
//       </main>

//       {/* Footer content goes here */}
//       <footer className="footer-upload">
//         <div className="footer-about-developer">
//           <div className="footer-about">
//             <h2>AutoPrintX</h2>
//             <p>Your trusted partner for all printing needs.</p>
//             <p>Contact us: support@autoprintx.com</p>
//           </div>

//           <div className="footer-developer">
//             <h3>Developed by BFCET Students</h3>
//             <p>Ratanveer Singh (CSE)</p>
//             <p>Riya Gupta (CSE)</p>

//           </div>
//         </div>
//         <div className="footer-bottom footer-bottom-upload">
//           <p>&copy; 2023 AutoPrintX. All rights reserved.</p>
//         </div>
//       </footer>

//     </div>
//   );
// }




import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";
import '../styles/styles/payment.css';
import '../styles/styles/ownerprofile.css';

// Import step components
import StepUpload from "../components/UploadPage/steps/StepUpload";
import StepOptions from "../components/UploadPage/steps/StepOptions";
import StepPayment from "../components/UploadPage/steps/StepPayment";
import StepConfirmation from "../components/UploadPage/steps/StepConfirmation";
import OwnerProfileCard from "../components/UploadPage/OwnerProfile";
import { UploadDataAPI, UserToUploadDataAPI } from '../api/endpoints';

export default function PrintOrderForm() {
  const location = useLocation();

  // State management
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [printOptions, setPrintOptions] = useState({
    paperSize: "a4",
    paperType: "standard",
    printColor: "bw",
    printSides: "single",
    binding: "none",
    copies: 1,
  });
  const [paymentMethod, setPaymentMethod] = useState("rezorpay");
  const [amount, setAmount] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [cashPayerName, setCashPayerName] = useState("");
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);
  const [uniqueUrl, setUniqueUrl] = useState("");
  const [shopData, setShopData] = useState(null);
  const [isLoadingShop, setIsLoadingShop] = useState(true);

  // Calculate total price
  const calculateTotal = () => {
    const basePrice = printOptions.printColor === "bw" ? 5 : 10;
    const paperCost = printOptions.paperType === "premium" ? 2 : 0;
    const bindingCost = printOptions.binding === "spiral" ? 3 : printOptions.binding === "hardcover" ? 8 : 0;
    const pages = uploadedFiles.reduce((acc, file) => acc + (file.pages || 0), 0);
    return ((basePrice * pages + paperCost + bindingCost) * printOptions.copies).toFixed(2);
  };

  // Generate order ID
  const generateOrderId = () => {
    const now = new Date();
    const timestamp = now.toISOString().replace(/[-T:.Z]/g, "").slice(10, 14);
    const randomPart = Math.random().toString(36).substring(6, 8).toUpperCase();
    return `ORD-${timestamp}-${randomPart}`;
  };

  // Handle final submission
  const handleFinalSubmit = async ({ paymentMethod, transactionId, cashPayerName }) => {
    setLoading(true);
    const generatedOrderId = generateOrderId();
    setOrderId(generatedOrderId);

    try {
      const formData = new FormData();

      uploadedFiles.forEach((file) => {
        formData.append('FileUpload', file.file);
      });

      formData.append('PaperSize', printOptions.paperSize);
      formData.append('PaperType', printOptions.paperType);
      formData.append('PrintColor', printOptions.printColor);
      formData.append('PrintSide', printOptions.printSides);
      formData.append('Binding', printOptions.binding);
      formData.append('NumberOfCopies', printOptions.copies);
      formData.append('PaymentAmount', amount);
      formData.append('NoOfPages', uploadedFiles.reduce((acc, file) => acc + (file.pages || 0), 0));
      formData.append('PaymentStatus', transactionId ? 1 : 0);
      formData.append('Transaction_id', transactionId || "");
      formData.append('CustomerName', cashPayerName || "");
      formData.append('OrderId', generatedOrderId);
      formData.append('PaymentMethod', paymentMethod);

      const data = await UploadDataAPI(formData, uniqueUrl);
      alert("Order submitted successfully!");
      console.log("Backend response:", data);
      nextStep();
    } catch (error) {
      console.error("Order submission failed:", error);
      alert("Failed to submit order. Please try again.");
    }

    setLoading(false);
  };

  // Navigation functions
  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  // Steps configuration
  const steps = [
    { number: 1, title: "Upload", active: currentStep >= 1, completed: currentStep > 1 },
    { number: 2, title: "Options", active: currentStep >= 2, completed: currentStep > 2 },
    { number: 3, title: "Payment", active: currentStep >= 3, completed: currentStep > 3 },
    { number: 4, title: "Confirm", active: currentStep >= 4, completed: currentStep > 4 },
  ];

  // Fetch owner info on mount
  useEffect(() => {
    const fetchOwnerInfo = async () => {
      try {
        document.title = 'AutoPrintX | Upload & Print';
        const url = location.pathname.split('/').pop();
        console.log("Extracted URL:", url);
        setUniqueUrl(url);

        setIsLoadingShop(true);
        const data = await UserToUploadDataAPI(url);

        // console.log("Received data from API:", data);

        if (data && typeof data === 'object') {
          console.log("Setting shop data:", data);
          setShopData(data);
        } else {
          // console.warn("No valid data received, setting shopData to null");
          setShopData(null);
        }
      } catch (error) {
        console.error("Error fetching owner info:", error);
        setShopData(null);
      } finally {
        setIsLoadingShop(false);
      }
    };

    fetchOwnerInfo();
  }, [location.pathname]);

  // Update amount when files or options change
  useEffect(() => {
    const total = calculateTotal();
    setAmount(total);
  }, [uploadedFiles, printOptions]);

  return (
    <div className="payment-page">
      {/* Header */}
      <header className="header">
        <nav className="navbar">
          <div className="logo">
            <h1>Smart<span>DocX</span></h1>
          </div>
          <Link to="/" className="back-link">
            <ArrowLeft size={16} />
            Back to Home
          </Link>
        </nav>
      </header>

      {/* Owner Profile Card - Show loading state */}
      {isLoadingShop ? (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <p>Loading shop information...</p>
        </div>
      ) : (
        <OwnerProfileCard shop={shopData} />
      )}

      <main className="payment-main">
        <div className="payment-container">
          <motion.div
            className="payment-header"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1>Complete Your Order</h1>
            <p>Upload your documents and make payment</p>
          </motion.div>

          {/* Progress Steps */}
          <motion.div
            className="payment-steps"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                <div className={`step ${step.active ? "active" : ""} ${step.completed ? "completed" : ""}`}>
                  <div className="step-number">
                    {step.completed ? <Check size={16} /> : step.number}
                  </div>
                  <div className="step-text">{step.title}</div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`step-line ${step.completed ? "completed" : ""}`}></div>
                )}
              </React.Fragment>
            ))}
          </motion.div>

          {/* Step Content */}
          {currentStep === 1 && (
            <StepUpload
              uploadedFiles={uploadedFiles}
              setUploadedFiles={setUploadedFiles}
              nextStep={nextStep}
            />
          )}

          {currentStep === 2 && (
            <StepOptions
              printOptions={printOptions}
              setPrintOptions={setPrintOptions}
              uploadedFiles={uploadedFiles}
              calculateTotal={calculateTotal}
              nextStep={nextStep}
              prevStep={prevStep}
            />
          )}

          {currentStep === 3 && (
            <StepPayment
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              amount={amount}
              setAmount={setAmount}
              transactionId={transactionId}
              setTransactionId={setTransactionId}
              cashPayerName={cashPayerName}
              setCashPayerName={setCashPayerName}
              loading={loading}
              handleFinalSubmit={handleFinalSubmit}
              prevStep={prevStep}
            />
          )}

          {currentStep === 4 && (
            <StepConfirmation
              orderId={orderId}
              calculateTotal={calculateTotal}
              paymentMethod={paymentMethod}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="footer-upload">
        <div className="footer-about-developer">
          <div className="footer-about">
            <h2>AutoPrintX</h2>
            <p>Your trusted partner for all printing needs.</p>
            <p>Contact us: support@autoprintx.com</p>
          </div>

          <div className="footer-developer">
            <h3>Developed by BFCET Students</h3>
            <p>Ratanveer Singh (CSE)</p>
            <p>Riya Gupta (CSE)</p>
          </div>
        </div>
        <div className="footer-bottom footer-bottom-upload">
          <p>&copy; 2023 AutoPrintX. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}