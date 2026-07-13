import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AlertCircle, ChevronRight, Check, X } from "lucide-react"
import { resumeDuplexPrint } from "../api/printerAgentapi"
import toast from "react-hot-toast"

/**
 * PrintDuplexConfirmDialog
 * ========================
 * Modal for pause/continue confirmation for manual duplex printing.
 * Shows when user selects manual duplex mode.
 */
const PrintDuplexConfirmDialog = ({ 
  isOpen, 
  onConfirm, 
  onCancel, 
  fileName = "Document",
  totalPages = 0,
  copies = 1,
  jobId = null
}) => {
  const [step, setStep] = useState("confirm") // "confirm" | "processing" | "pause"
  const [currentCopy, setCurrentCopy] = useState(0)
  const [currentSide, setCurrentSide] = useState("front") // "front" | "back"
  const [isResuming, setIsResuming] = useState(false)

  const handleConfirm = async () => {
    setStep("processing")
    try {
      await onConfirm?.()
      setStep("pause")
      setCurrentCopy(1)
      setCurrentSide("front")
    } catch (err) {
      console.error("Print failed:", err)
      setStep("confirm")
    }
  }

  const handleContinue = async () => {
    if (currentSide === "front") {
      setCurrentSide("back")
      
      // Resume print job on backend
      if (jobId) {
        setIsResuming(true)
        try {
          const result = await resumeDuplexPrint(jobId)
          if (result?.success) {
            toast.success("✅ Printing back side...", { duration: 2000 })
            await new Promise(r => setTimeout(r, 2000))
            setStep("confirm")
            onCancel?.()
          } else {
            toast.error(`❌ Failed to resume: ${result?.message || "Unknown error"}`)
          }
        } catch (err) {
          toast.error(`❌ Resume error: ${err.message}`)
        } finally {
          setIsResuming(false)
        }
      }
    } else if (currentCopy < copies) {
      setCurrentCopy(currentCopy + 1)
      setCurrentSide("front")
    } else {
      setStep("confirm")
      onCancel?.()
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10000,
          padding: 16,
        }}
        onClick={() => step === "confirm" && onCancel?.()}
      >
        <motion.div
          initial={{ scale: 0.92, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.92, y: 20 }}
          transition={{ type: "spring", stiffness: 320, damping: 26 }}
          onClick={e => e.stopPropagation()}
          style={{
            background: "#fff",
            borderRadius: 14,
            width: "100%",
            maxWidth: 420,
            boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "20px 24px",
              background: step === "pause" ? "#fff7ed" : "#fef2f2",
              borderBottom: "1px solid #e5e7eb",
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: step === "pause" ? "#fed7aa" : "#fecaca",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <AlertCircle
                size={20}
                color={step === "pause" ? "#d97706" : "#dc2626"}
              />
            </div>
            <div>
              <h3
                style={{
                  margin: 0,
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#111827",
                }}
              >
                {step === "confirm"
                  ? "Manual Duplex Mode"
                  : step === "processing"
                    ? "Preparing..."
                    : "Flip & Continue"}
              </h3>
              <p
                style={{
                  margin: "4px 0 0",
                  fontSize: 12,
                  color: "#6b7280",
                }}
              >
                {step === "confirm"
                  ? "Confirm to start manual duplex printing"
                  : step === "processing"
                    ? "Processing pages..."
                    : `Copy ${currentCopy} of ${copies} - ${
                        currentSide === "front" ? "Front" : "Back"
                      } side`}
              </p>
            </div>
          </div>

          {/* Content */}
          <div style={{ padding: "24px" }}>
            {step === "confirm" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div
                  style={{
                    background: "#f9fafb",
                    borderRadius: 10,
                    padding: 14,
                    border: "1px solid #e5e7eb",
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      fontSize: 13,
                      fontWeight: 500,
                      color: "#374151",
                      lineHeight: 1.6,
                    }}
                  >
                    You've selected <strong>Manual Duplex</strong> mode. You
                    will need to:
                  </p>
                  <ul
                    style={{
                      margin: "10px 0 0",
                      paddingLeft: 20,
                      fontSize: 13,
                      color: "#6b7280",
                      lineHeight: 1.8,
                    }}
                  >
                    <li>Print the front side first</li>
                    <li>Flip the printed pages manually</li>
                    <li>Return to printer and confirm to print back</li>
                  </ul>
                </div>

                <div
                  style={{
                    background: "#f0fdf4",
                    borderRadius: 10,
                    padding: 12,
                    border: "1px solid #bbf7d0",
                    display: "flex",
                    gap: 8,
                  }}
                >
                  <div style={{ color: "#059669", fontSize: 13, fontWeight: 500 }}>
                    📄 {fileName}
                  </div>
                  <div
                    style={{
                      marginLeft: "auto",
                      color: "#065f46",
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    {totalPages} pages × {copies} copy
                    {copies > 1 ? "ies" : ""}
                  </div>
                </div>
              </div>
            )}

            {step === "processing" && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 16,
                  padding: "20px 0",
                }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    border: "3px solid #e5e7eb",
                    borderTopColor: "#6366f1",
                  }}
                />
                <div style={{ textAlign: "center" }}>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 14,
                      fontWeight: 600,
                      color: "#111827",
                    }}
                  >
                    Printing front side...
                  </p>
                  <p
                    style={{
                      margin: "6px 0 0",
                      fontSize: 12,
                      color: "#6b7280",
                    }}
                  >
                    Please wait while pages are being processed
                  </p>
                </div>
              </div>
            )}

            {step === "pause" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div
                  style={{
                    background: "#fef3c7",
                    borderRadius: 10,
                    padding: 14,
                    border: "1px solid #fcd34d",
                    textAlign: "center",
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      fontSize: 14,
                      fontWeight: 700,
                      color: "#92400e",
                    }}
                  >
                    📋 Pause - Ready for Manual Action
                  </p>
                  <p
                    style={{
                      margin: "8px 0 0",
                      fontSize: 13,
                      color: "#b45309",
                      lineHeight: 1.6,
                    }}
                  >
                    Please remove the printed pages from the output tray, flip
                    them over,
                    <br />
                    and place them back in the input tray with the blank side
                    facing down.
                  </p>
                </div>

                <div
                  style={{
                    background: "#f3f4f6",
                    borderRadius: 10,
                    padding: 14,
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 10,
                  }}
                >
                  <div style={{ textAlign: "center" }}>
                    <div
                      style={{
                        fontSize: 20,
                        fontWeight: 700,
                        color: "#6366f1",
                        marginBottom: 4,
                      }}
                    >
                      {currentCopy}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: "#6b7280",
                        fontWeight: 500,
                      }}
                    >
                      Copy
                    </div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div
                      style={{
                        fontSize: 20,
                        fontWeight: 700,
                        color: "#f59e0b",
                        marginBottom: 4,
                      }}
                    >
                      {currentSide === "front" ? "↓" : "↑"}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: "#6b7280",
                        fontWeight: 500,
                      }}
                    >
                      {currentSide === "front" ? "Front" : "Back"} Side
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div
            style={{
              display: "flex",
              gap: 10,
              padding: "16px 24px",
              borderTop: "1px solid #e5e7eb",
              background: "#f9fafb",
            }}
          >
            {step === "confirm" && (
              <>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onCancel}
                  style={{
                    flex: 1,
                    padding: "10px 16px",
                    borderRadius: 8,
                    border: "1px solid #d1d5db",
                    background: "#fff",
                    cursor: "pointer",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#374151",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                  }}
                >
                  <X size={14} /> Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleConfirm}
                  style={{
                    flex: 1,
                    padding: "10px 16px",
                    borderRadius: 8,
                    border: "none",
                    background: "#dc2626",
                    cursor: "pointer",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                  }}
                >
                  <Check size={14} /> Confirm
                </motion.button>
              </>
            )}

            {step === "pause" && (
              <motion.button
                whileHover={{ scale: isResuming ? 1 : 1.02 }}
                whileTap={{ scale: isResuming ? 1 : 0.98 }}
                onClick={handleContinue}
                disabled={isResuming}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: 8,
                  border: "none",
                  background: isResuming ? "#d1d5db" : "linear-gradient(135deg, #f59e0b, #f97316)",
                  cursor: isResuming ? "not-allowed" : "pointer",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  opacity: isResuming ? 0.7 : 1,
                }}
              >
                {isResuming ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: "50%",
                        border: "2px solid rgba(255,255,255,0.3)",
                        borderTopColor: "#fff",
                      }}
                    />
                    Resuming...
                  </>
                ) : (
                  <>
                    Continue Printing <ChevronRight size={16} />
                  </>
                )}
              </motion.button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default PrintDuplexConfirmDialog
