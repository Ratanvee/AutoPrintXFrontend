// import React from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useDropzone } from "react-dropzone";
// import { Link } from "react-router-dom";
// import { Upload, X, FileText, ImageIcon, File, ArrowRight } from "lucide-react";
// import { toast } from 'react-hot-toast';
// import * as pdfjsLib from "pdfjs-dist";
// import { GlobalWorkerOptions } from "pdfjs-dist/build/pdf.mjs";

// GlobalWorkerOptions.workerSrc = new URL(
//     "pdfjs-dist/build/pdf.worker.mjs",
//     import.meta.url
// ).toString();

// export default function StepUpload({ uploadedFiles, setUploadedFiles, nextStep }) {
//     const { getRootProps, getInputProps, isDragActive } = useDropzone({
//         accept: {
//             "application/pdf": [".pdf"],
//             "application/msword": [".doc"],
//             "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
//             "image/*": [".png", ".jpg", ".jpeg"],
//         },
//         maxSize: 20 * 1024 * 1024, // 20MB per file for iOS compatibility
//         maxFiles: 5, //  Limit to 5 files
//         onDropRejected: (rejectedFiles) => {
//             rejectedFiles.forEach(({ file, errors }) => {
//                 errors.forEach((error) => {
//                     if (error.code === 'file-too-large') {
//                         toast.error(`❌ ${file.name} is too large. Maximum file size is 20MB.`, {
//                             duration: 5000,
//                         });
//                     } else if (error.code === 'file-invalid-type') {
//                         toast.error(`❌ ${file.name} is not a supported file type.`, {
//                             duration: 5000,
//                         });
//                     } else if (error.code === 'too-many-files') {
//                         toast.error(`❌ You can only upload up to 5 files at once.`, {
//                             duration: 5000,
//                         });
//                     }
//                 });
//             });
//         },
//         onDrop: async (acceptedFiles) => {
//             // Check total size for iOS (50MB total limit)
//             const currentSize = uploadedFiles.reduce((acc, f) => acc + f.size, 0);
//             const newSize = acceptedFiles.reduce((acc, f) => acc + f.size, 0);
//             const totalSize = currentSize + newSize;

//             if (totalSize > 50 * 1024 * 1024) {
//                 toast.error("Total upload size would exceed 50MB. Please remove some files first.", {
//                     duration: 6000,
//                     position: 'top-center',
//                 });
//                 return;
//             }

//             // Check total file count
//             if (uploadedFiles.length + acceptedFiles.length > 5) {
//                 toast.error("You can only upload up to 5 files total.", {
//                     duration: 5000,
//                 });
//                 return;
//             }

//             // Show processing toast
//             const processingToast = toast.loading(`Processing ${acceptedFiles.length} file(s)...`);

//             const newFiles = await Promise.all(
//                 acceptedFiles.map(async (file) => {
//                     let pageCount = null;
//                     let fileType = file.type;

//                     // Handle images
//                     if (fileType.startsWith("image/")) {
//                         pageCount = 1;

//                         // Handle PDFs with better error handling for iOS
//                     } else if (fileType === "application/pdf") {
//                         try {
//                             const pdfData = await file.arrayBuffer();
//                             const loadingTask = pdfjsLib.getDocument({ data: pdfData });
//                             const pdfDoc = await loadingTask.promise;
//                             pageCount = pdfDoc.numPages;
//                             console.log(`PDF ${file.name}: ${pageCount} pages`);

//                         } catch (err) {
//                             console.error("Error reading PDF:", err);
//                             pageCount = 1; // Default to 1 if can't read
//                             toast.error(`Could not read page count for ${file.name}. Assuming 1 page.`, {
//                                 duration: 4000,
//                             });
//                         }

//                         // Handle Word documents
//                     } else if (fileType.includes('word') || fileType.includes('document')) {
//                         console.warn(`File ${file.name} is a Word document.`);
//                         pageCount = 1; // Default for Word docs
//                         toast(`${file.name}: Page count estimated as 1`, {
//                             duration: 3000,
//                             icon: 'ℹ️',
//                         });
//                     } else {
//                         pageCount = 1; // Default for unknown types
//                     }

//                     return {
//                         id: Date.now() + Math.random(),
//                         file, // Keep the actual File object for FormData
//                         name: file.name,
//                         size: file.size,
//                         type: fileType,
//                         pages: pageCount,
//                     };
//                 })
//             );

//             toast.dismiss(processingToast);
//             setUploadedFiles((prev) => [...prev, ...newFiles]);

//             // Show success message
//             const totalPages = newFiles.reduce((acc, f) => acc + (f.pages || 0), 0);
//             toast.success(
//                 `Added ${newFiles.length} file(s) (${totalPages} pages)`,
//                 {
//                     duration: 3000,
//                     position: 'top-center',
//                 }
//             );
//         },
//     });

//     const removeFile = (id) => {
//         const fileToRemove = uploadedFiles.find(f => f.id === id);
//         setUploadedFiles((prev) => prev.filter((file) => file.id !== id));

//         if (fileToRemove) {
//             toast(`Removed ${fileToRemove.name}`, {
//                 duration: 2000,
//             });
//         }
//     };

//     const getFileIcon = (type) => {
//         if (type.includes("pdf")) return <FileText size={20} />;
//         if (type.includes("image")) return <ImageIcon size={20} />;
//         return <File size={20} />;
//     };

//     const formatFileSize = (bytes) => {
//         if (bytes === 0) return "0 Bytes";
//         const k = 1024;
//         const sizes = ["Bytes", "KB", "MB", "GB"];
//         const i = Math.floor(Math.log(bytes) / Math.log(k));
//         return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
//     };

//     // Calculate total size
//     const totalSize = uploadedFiles.reduce((acc, f) => acc + f.size, 0);
//     const totalPages = uploadedFiles.reduce((acc, f) => acc + (f.pages || 0), 0);

//     return (
//         <motion.div
//             key="step1"
//             className="payment-step-content"
//             initial={{ opacity: 0, x: 50 }}
//             animate={{ opacity: 1, x: 0 }}
//             exit={{ opacity: 0, x: -50 }}
//             transition={{ duration: 0.3 }}
//         >
//             <h2>Upload Your Documents</h2>
//             <div className="upload-container">
//                 <div {...getRootProps()} className={`upload-area ${isDragActive ? "drag-active" : ""}`}>
//                     <input {...getInputProps()} />
//                     <Upload size={48} />
//                     <h3>{isDragActive ? "Drop files here" : "Drag & Drop Files Here"}</h3>
//                     <p>or</p>
//                     <button className="btn-primary" type="button">Browse Files</button>
//                     <p className="upload-info">
//                         Supported: PDF, DOCX, JPG, PNG<br />
//                         Max: 20MB per file, 50MB total<br />
//                         Limit: 5 files maximum
//                     </p>
//                 </div>

//                 {uploadedFiles.length > 0 && (
//                     <motion.div
//                         className="uploaded-files"
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                     >
//                         <h3>
//                             Uploaded Files ({uploadedFiles.length}/5) -
//                             {' '}{formatFileSize(totalSize)} / 50MB
//                             {' '}({totalPages} pages)
//                         </h3>

//                         {/* Show warning if approaching limits */}
//                         {totalSize > 40 * 1024 * 1024 && (
//                             <div style={{
//                                 background: '#fef3c7',
//                                 color: '#92400e',
//                                 padding: '8px 12px',
//                                 borderRadius: '6px',
//                                 marginBottom: '12px',
//                                 fontSize: '14px'
//                             }}>
//                                 You're approaching the 50MB limit. Consider removing some files if upload fails.
//                             </div>
//                         )}

//                         <div className="file-list">
//                             <AnimatePresence>
//                                 {uploadedFiles.map((file) => (
//                                     <motion.div
//                                         key={file.id}
//                                         className="file-item"
//                                         initial={{ opacity: 0, scale: 0.9 }}
//                                         animate={{ opacity: 1, scale: 1 }}
//                                         exit={{ opacity: 0, scale: 0.9 }}
//                                         layout
//                                     >
//                                         <div className="file-icon">{getFileIcon(file.type)}</div>
//                                         <div className="file-info">
//                                             <p className="file-name">{file.name}</p>
//                                             <p className="file-size">
//                                                 {formatFileSize(file.size)} • {file.pages} page{file.pages !== 1 ? 's' : ''}
//                                             </p>
//                                         </div>
//                                         <button
//                                             className="remove-file"
//                                             onClick={() => removeFile(file.id)}
//                                             type="button"
//                                         >
//                                             <X size={16} />
//                                         </button>
//                                     </motion.div>
//                                 ))}
//                             </AnimatePresence>
//                         </div>
//                     </motion.div>
//                 )}
//             </div>

//             <div className="step-buttons">
//                 <Link to="/" className="btn-secondary">
//                     Cancel
//                 </Link>
//                 <motion.button
//                     className="btn-primary"
//                     onClick={nextStep}
//                     disabled={uploadedFiles.length === 0}
//                     whileHover={{ scale: uploadedFiles.length > 0 ? 1.05 : 1 }}
//                     whileTap={{ scale: uploadedFiles.length > 0 ? 0.95 : 1 }}
//                     type="button"
//                 >
//                     Next: Choose Options <ArrowRight size={16} />
//                 </motion.button>
//             </div>
//         </motion.div>
//     );
// }


import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";
import { Link } from "react-router-dom";
import { Upload, X, FileText, Image, File, ArrowRight, ChevronLeft } from "lucide-react";
import { toast } from 'react-hot-toast';
import * as pdfjsLib from "pdfjs-dist";
import { GlobalWorkerOptions } from "pdfjs-dist/build/pdf.mjs";

GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.mjs",
    import.meta.url
).toString();

export default function StepUpload({ uploadedFiles, setUploadedFiles, nextStep }) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            const mobile = /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
                || window.innerWidth <= 768;
            setIsMobile(mobile);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
        accept: {
            "application/pdf": [".pdf"],
            "application/msword": [".doc"],
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
            "image/*": [".png", ".jpg", ".jpeg"],
        },
        maxSize: 20 * 1024 * 1024,
        maxFiles: 5,
        noClick: isMobile,
        noDrag: isMobile,
        onDropRejected: (rejectedFiles) => {
            rejectedFiles.forEach(({ file, errors }) => {
                errors.forEach((error) => {
                    if (error.code === 'file-too-large') {
                        toast.error(`❌ ${file.name} is too large. Max 20MB.`, {
                            duration: 4000,
                        });
                    } else if (error.code === 'file-invalid-type') {
                        toast.error(`❌ ${file.name} is not supported.`, {
                            duration: 4000,
                        });
                    } else if (error.code === 'too-many-files') {
                        toast.error(`❌ Max 5 files allowed.`, {
                            duration: 4000,
                        });
                    }
                });
            });
        },
        onDrop: async (acceptedFiles) => {
            const currentSize = uploadedFiles.reduce((acc, f) => acc + f.size, 0);
            const newSize = acceptedFiles.reduce((acc, f) => acc + f.size, 0);
            const totalSize = currentSize + newSize;

            if (totalSize > 50 * 1024 * 1024) {
                toast.error("Total size exceeds 50MB. Remove some files.", {
                    duration: 5000,
                });
                return;
            }

            if (uploadedFiles.length + acceptedFiles.length > 5) {
                toast.error("Max 5 files total.", {
                    duration: 4000,
                });
                return;
            }

            const processingToast = toast.loading(`Processing ${acceptedFiles.length} file(s)...`);

            const newFiles = await Promise.all(
                acceptedFiles.map(async (file) => {
                    let pageCount = null;
                    let fileType = file.type;

                    if (fileType.startsWith("image/")) {
                        pageCount = 1;
                    } else if (fileType === "application/pdf") {
                        try {
                            const pdfData = await file.arrayBuffer();
                            const loadingTask = pdfjsLib.getDocument({ data: pdfData });
                            const pdfDoc = await loadingTask.promise;
                            pageCount = pdfDoc.numPages;
                        } catch (err) {
                            console.error("Error reading PDF:", err);
                            pageCount = 1;
                            toast.error(`Couldn't read ${file.name}. Assuming 1 page.`, {
                                duration: 3000,
                            });
                        }
                    } else if (fileType.includes('word') || fileType.includes('document')) {
                        pageCount = 1;
                        toast(`${file.name}: ~1 page`, {
                            duration: 2000,
                            icon: 'ℹ️',
                        });
                    } else {
                        pageCount = 1;
                    }

                    return {
                        id: Date.now() + Math.random(),
                        file,
                        name: file.name,
                        size: file.size,
                        type: fileType,
                        pages: pageCount,
                    };
                })
            );

            toast.dismiss(processingToast);
            setUploadedFiles((prev) => [...prev, ...newFiles]);

            const totalPages = newFiles.reduce((acc, f) => acc + (f.pages || 0), 0);
            toast.success(`Added ${newFiles.length} file(s) (${totalPages} pages)`, {
                duration: 2500,
            });
        },
    });

    const removeFile = (id) => {
        const fileToRemove = uploadedFiles.find(f => f.id === id);
        setUploadedFiles((prev) => prev.filter((file) => file.id !== id));

        if (fileToRemove) {
            toast(`Removed ${fileToRemove.name}`, {
                duration: 2000,
            });
        }
    };

    const getFileIcon = (type) => {
        if (type.includes("pdf")) return <FileText size={18} />;
        if (type.includes("image")) return <Image size={18} />;
        return <File size={18} />;
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return "0 B";
        const k = 1024;
        const sizes = ["B", "KB", "MB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 10) / 10 + " " + sizes[i];
    };

    const totalSize = uploadedFiles.reduce((acc, f) => acc + f.size, 0);
    const totalPages = uploadedFiles.reduce((acc, f) => acc + (f.pages || 0), 0);

    return (
        <motion.div
            key="step1"
            className="payment-step-content"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
        >
            <h2>Upload Your Documents</h2>
            <div className="upload-container">
                {isMobile ? (
                    <div className="upload-area mobile-upload">
                        <input {...getInputProps()} />
                        <Upload size={40} />
                        <h3>Choose Files to Upload</h3>
                        <button
                            className="btn-primary"
                            type="button"
                            onClick={open}
                        >
                            Select Files
                        </button>
                        <p className="upload-info">
                            PDF, DOCX, JPG, PNG • Max 20MB/file<br />
                            Up to 5 files (50MB total)
                        </p>
                    </div>
                ) : (
                    <div {...getRootProps()} className={`upload-area ${isDragActive ? "drag-active" : ""}`}>
                        <input {...getInputProps()} />
                        <Upload size={48} />
                        <h3>{isDragActive ? "Drop files here" : "Drag & Drop Files Here"}</h3>
                        <p>or</p>
                        <button className="btn-primary" type="button">Browse Files</button>
                        <p className="upload-info">
                            Supported: PDF, DOCX, JPG, PNG<br />
                            Max: 20MB per file, 50MB total<br />
                            Limit: 5 files maximum
                        </p>
                    </div>
                )}

                {uploadedFiles.length > 0 && (
                    <motion.div
                        className="uploaded-files"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h3>
                            {uploadedFiles.length}/5 Files • {formatFileSize(totalSize)}/50MB • {totalPages}p
                        </h3>

                        {totalSize > 40 * 1024 * 1024 && (
                            <div className="warning-box">
                                ⚠️ Approaching 50MB limit
                            </div>
                        )}

                        <div className="file-list">
                            <AnimatePresence>
                                {uploadedFiles.map((file) => (
                                    <motion.div
                                        key={file.id}
                                        className="file-item"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        layout
                                    >
                                        <div className="file-icon">{getFileIcon(file.type)}</div>
                                        <div className="file-info">
                                            <p className="file-name">{file.name}</p>
                                            <p className="file-size">
                                                {formatFileSize(file.size)} • {file.pages}p
                                            </p>
                                        </div>
                                        <button
                                            className="remove-file"
                                            onClick={() => removeFile(file.id)}
                                            type="button"
                                            aria-label="Remove file"
                                        >
                                            <X size={16} />
                                        </button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                )}
            </div>

            <div className="step-buttons">
                {/* <Link to="/" className="btn-secondary">
                    <ChevronLeft /> 
                </Link> */}
                <motion.button
                    className="btn-primary"
                    onClick={nextStep}
                    disabled={uploadedFiles.length === 0}
                    whileHover={{ scale: uploadedFiles.length > 0 ? 1.05 : 1 }}
                    whileTap={{ scale: uploadedFiles.length > 0 ? 0.95 : 1 }}
                    type="button"
                >
                    Next: Choose Options <ArrowRight size={16} />
                </motion.button>
            </div>
        </motion.div>
    );
}