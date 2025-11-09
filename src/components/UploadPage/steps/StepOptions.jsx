import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function StepOptions({
    printOptions,
    setPrintOptions,
    uploadedFiles,
    calculateTotal,
    nextStep,
    prevStep
}) {
    return (
        <motion.div
            key="step2"
            className="payment-step-content"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
        >
            <h2>Choose Printing Options</h2>
            <div className="options-container">
                <div className="options-form">
                    {/* <div className="form-group">
                        <label htmlFor="paperSize">Paper Size</label>
                        <select
                            id="paperSize"
                            value={printOptions.paperSize}
                            onChange={(e) => setPrintOptions({ ...printOptions, paperSize: e.target.value })}
                        >
                            <option value="a4">A4 (210 × 297 mm)</option>
                            <option value="letter">Letter (8.5 × 11 in)</option>
                            <option value="legal">Legal (8.5 × 14 in)</option>
                            <option value="a3">A3 (297 × 420 mm)</option>
                        </select>
                    </div> */}

                    {/* <div className="form-group">
                        <label htmlFor="paperType">Paper Type</label>
                        <select
                            id="paperType"
                            value={printOptions.paperType}
                            onChange={(e) => setPrintOptions({ ...printOptions, paperType: e.target.value })}
                        >
                            <option value="standard">Standard (80 gsm)</option>
                            <option value="premium">Premium (100 gsm)</option>
                            <option value="glossy">Glossy (120 gsm)</option>
                            <option value="matte">Matte (120 gsm)</option>
                        </select>
                    </div> */}

                    <div className="form-group">
                        <label htmlFor="printColor">Print Color</label>
                        <select
                            id="printColor"
                            value={printOptions.printColor}
                            onChange={(e) => setPrintOptions({ ...printOptions, printColor: e.target.value })}
                        >
                            <option value="bw">Black & White</option>
                            <option value="color">Color</option>
                        </select>
                    </div>

                    {/* <div className="form-group">
                        <label htmlFor="printSides">Print Sides</label>
                        <select
                            id="printSides"
                            value={printOptions.printSides}
                            onChange={(e) => setPrintOptions({ ...printOptions, printSides: e.target.value })}
                        >
                            <option value="single">Single-sided</option>
                            <option value="double">Double-sided</option>
                        </select>
                    </div> */}

                    {/* <div className="form-group">
                        <label htmlFor="binding">Binding</label>
                        <select
                            id="binding"
                            value={printOptions.binding}
                            onChange={(e) => setPrintOptions({ ...printOptions, binding: e.target.value })}
                        >
                            <option value="none">None</option>
                            <option value="staple">Staple</option>
                            <option value="spiral">Spiral Binding</option>
                            <option value="hardcover">Hardcover Binding</option>
                        </select>
                    </div> */}

                    <div className="form-group">
                        <label htmlFor="copies">Number of Copies</label>
                        <input
                            type="number"
                            id="copies"
                            min="1"
                            value={printOptions.copies}
                            onChange={(e) => setPrintOptions({ ...printOptions, copies: Number.parseInt(e.target.value) })}
                        />
                    </div>
                </div>

                <motion.div
                    className="options-summary"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <h3>Order Summary</h3>
                    <div className="summary-items">
                        {uploadedFiles.map((file) => (
                            <div key={file.id} className="summary-item">
                                <span>{file.name} ({file.pages} pages)</span>
                                <span>₹{printOptions.printColor === "bw" ? "5" : "10"}/page</span>
                            </div>
                        ))}
                        {printOptions.paperType === "premium" && (
                            <div className="summary-item">
                                <span>Premium Paper</span>
                                <span>₹2/page</span>
                            </div>
                        )}
                        {printOptions.printColor === "color" && (
                            <div className="summary-item">
                                <span>Color Printing</span>
                                <span>₹10/page</span>
                            </div>
                        )}
                        {printOptions.binding !== "none" && (
                            <div className="summary-item">
                                <span>{printOptions.binding === "spiral" ? "Spiral" : "Hardcover"} Binding</span>
                                <span>₹{printOptions.binding === "spiral" ? "3" : "8"}</span>
                            </div>
                        )}
                    </div>
                    <div className="summary-divider"></div>
                    <div className="summary-item total">
                        <span>Total</span>
                        <span>₹{calculateTotal()}</span>
                    </div>
                </motion.div>
            </div>

            <div className="step-buttons">
                <motion.button
                    className="btn-secondary"
                    onClick={prevStep}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <ArrowLeft size={16} /> Previous
                </motion.button>
                <motion.button
                    className="btn-primary"
                    onClick={nextStep}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Next: Payment <ArrowRight size={16} />
                </motion.button>
            </div>
        </motion.div>
    );
}