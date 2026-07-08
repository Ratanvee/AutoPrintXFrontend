import { ArrowRight, ChevronLeft } from "lucide-react"
import { motion } from "framer-motion"

export default function StepOptions({
    printOptions,
    setPrintOptions,
    uploadedFiles,
    calculateTotal,
    shopPricing = {},   // ✅ new prop with fallback
    nextStep,
    prevStep,
}) {
    // Safe price lookups with fallbacks
    const bwPrice = Number(shopPricing.bw) || 2
    const colorPrice = Number(shopPricing.color) || 8
    const premiumPrice = Number(shopPricing.premium) || 2
    const spiralPrice = Number(shopPricing.spiral) || 30
    const hardcoverPrice = Number(shopPricing.hardcover) || 80
    const staplePrice = Number(shopPricing.staple) || 0

    const perPagePrice = printOptions.printColor === "bw" ? bwPrice : colorPrice

    return (
        <div className="payment-step-content">
            <h2>Choose Printing Options</h2>

            <div className="options-container">
                <div className="options-form">

                    {/* Print Sides Toggle */}
                    <div className="toggle-group">
                        <button type="button"
                            className={`toggle-btn ${printOptions.printSides === "double" ? "active" : ""}`}
                            onClick={() => setPrintOptions({ ...printOptions, printSides: "double" })}
                        >DOUBLE-SIDED</button>
                        <button type="button"
                            className={`toggle-btn ${printOptions.printSides === "single" ? "active" : ""}`}
                            onClick={() => setPrintOptions({ ...printOptions, printSides: "single" })}
                        >SINGLE-SIDED</button>
                    </div>

                    {/* Print Color Toggle */}
                    <div className="toggle-group">
                        <button type="button"
                            className={`toggle-btn ${printOptions.printColor === "bw" ? "active" : ""}`}
                            onClick={() => setPrintOptions({ ...printOptions, printColor: "bw" })}
                        >Black&White — ₹{bwPrice}/p</button>
                        <button type="button"
                            className={`toggle-btn ${printOptions.printColor === "color" ? "active" : ""}`}
                            onClick={() => setPrintOptions({ ...printOptions, printColor: "color" })}
                        >COLOR — ₹{colorPrice}/p</button>
                    </div>

                    {/* Binding */}
                    <div className="form-group">
                        <label htmlFor="binding">Binding</label>
                        <select id="binding" value={printOptions.binding}
                            onChange={(e) => setPrintOptions({ ...printOptions, binding: e.target.value })}
                        >
                            <option value="none">None</option>
                            <option value="staple">Staple {staplePrice > 0 ? `(₹${staplePrice})` : "(Free)"}</option>
                            <option value="spiral">Spiral Binding (₹{spiralPrice}/file)</option>
                            <option value="hardcover">Hardcover Binding (₹{hardcoverPrice}/file)</option>
                        </select>
                    </div>

                    {/* Copies Counter */}
                    <div className="copies-section">
                        <label className="copies-label">Copies:</label>
                        <div className="copies-counter">
                            <button type="button" className="counter-btn decrease"
                                onClick={() => setPrintOptions({ ...printOptions, copies: Math.max(1, printOptions.copies - 1) })}
                            >−</button>
                            <span className="counter-value">{printOptions.copies}</span>
                            <button type="button" className="counter-btn increase"
                                onClick={() => setPrintOptions({ ...printOptions, copies: printOptions.copies + 1 })}
                            >+</button>
                        </div>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="options-summary">
                    <h3>Order Summary</h3>
                    <div className="summary-items">

                        {/* Per-file breakdown */}
                        {uploadedFiles.map((file) => (
                            <div key={file.id} className="summary-item">
                                <span>{file.name}<br />({file.pages || 0} pages × {printOptions.copies} copies)</span>
                                <span>₹{(perPagePrice * (file.pages || 0) * printOptions.copies).toFixed(2)}</span>
                            </div>
                        ))}

                        {/* Premium paper */}
                        {printOptions.paperType === "premium" && (
                            <div className="summary-item">
                                <span>Premium Paper</span>
                                <span>₹{premiumPrice}/page</span>
                            </div>
                        )}

                        {/* Binding cost */}
                        {printOptions.binding !== "none" && (
                            <div className="summary-item">
                                <span>
                                    {printOptions.binding === "spiral" ? "Spiral Binding" :
                                        printOptions.binding === "hardcover" ? "Hardcover Binding" :
                                            "Staple Binding"} × {uploadedFiles.length} file(s)
                                </span>
                                <span>
                                    ₹{(
                                        (printOptions.binding === "spiral" ? spiralPrice :
                                            printOptions.binding === "hardcover" ? hardcoverPrice :
                                                staplePrice) * uploadedFiles.length
                                    ).toFixed(2)}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="summary-divider" />
                    <div className="summary-item total">
                        <span>Total</span>
                        <span>₹{calculateTotal()}</span>
                    </div>
                </div>
            </div>

            <div className="step-buttons">
                <motion.button className="btn-secondary" onClick={prevStep}
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <ChevronLeft />
                </motion.button>
                <motion.button className="btn-primary" onClick={nextStep}
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    Next: Payment <ArrowRight size={16} />
                </motion.button>
            </div>
        </div>
    )
}