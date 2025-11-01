import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";
import { Link } from "react-router-dom";
import { Upload, X, FileText, ImageIcon, File, ArrowRight } from "lucide-react";
import * as pdfjsLib from "pdfjs-dist";
import { GlobalWorkerOptions } from "pdfjs-dist/build/pdf.mjs";

GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.mjs",
    import.meta.url
).toString();

export default function StepUpload({ uploadedFiles, setUploadedFiles, nextStep }) {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: {
            "application/pdf": [".pdf"],
            "application/msword": [".doc"],
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
            "image/*": [".png", ".jpg", ".jpeg"],
        },
        onDrop: async (acceptedFiles) => {
            const newFiles = await Promise.all(
                acceptedFiles.map(async (file) => {
                    let pageCount = null;
                    let fileType = file.type;

                    if (fileType.startsWith("image/")) {
                        pageCount = 1;
                    } else if (fileType === "application/pdf") {
                        try {
                            const pdfData = await file.arrayBuffer();
                            const pdfDoc = await pdfjsLib.getDocument({ data: pdfData }).promise;
                            pageCount = pdfDoc.numPages;
                        } catch (err) {
                            console.error("Error reading PDF:", err);
                            pageCount = null;
                        }
                    } else {
                        console.warn(`File ${file.name} is a non-PDF document. Conversion to PDF required for page count.`);
                        // alert('Your document should only be PDF or in image format!!!');
                        pageCount = null;
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

            setUploadedFiles((prev) => [...prev, ...newFiles]);
        },
    });

    const removeFile = (id) => {
        setUploadedFiles((prev) => prev.filter((file) => file.id !== id));
    };

    const getFileIcon = (type) => {
        if (type.includes("pdf")) return <FileText size={20} />;
        if (type.includes("image")) return <ImageIcon size={20} />;
        return <File size={20} />;
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

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
                <div {...getRootProps()} className={`upload-area ${isDragActive ? "drag-active" : ""}`}>
                    <input {...getInputProps()} />
                    <Upload size={48} />
                    <h3>{isDragActive ? "Drop files here" : "Drag & Drop Files Here"}</h3>
                    <p>or</p>
                    <button className="btn-primary">Browse Files</button>
                    <p className="upload-info">Supported formats: PDF, DOCX, JPG, PNG (Max: 20MB per file)</p>
                </div>

                {uploadedFiles.length > 0 && (
                    <motion.div
                        className="uploaded-files"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h3>Uploaded Files ({uploadedFiles.length})</h3>
                        <div className="file-list">
                            <AnimatePresence>
                                {uploadedFiles.map((file) => (
                                    <motion.div
                                        key={file.id}
                                        className="file-item"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        layout
                                    >
                                        <div className="file-icon">{getFileIcon(file.type)}</div>
                                        <div className="file-info">
                                            <p className="file-name">{file.name}</p>
                                            <p className="file-size">{formatFileSize(file.size)}</p>
                                        </div>
                                        <button className="remove-file" onClick={() => removeFile(file.id)}>
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
                <Link to="/" className="btn-secondary">
                    Cancel
                </Link>
                <motion.button
                    className="btn-primary"
                    onClick={nextStep}
                    disabled={uploadedFiles.length === 0}
                    whileHover={{ scale: uploadedFiles.length > 0 ? 1.05 : 1 }}
                    whileTap={{ scale: uploadedFiles.length > 0 ? 0.95 : 1 }}
                >
                    Next: Choose Options <ArrowRight size={16} />
                </motion.button>
            </div>
        </motion.div>
    );
}