import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";
import '../styles/payment/payment.css';
import '../styles/payment/ownerprofile.css';

// Import step components
import StepUpload from "../components/UploadPage/steps/StepUpload";
import StepOptions from "../components/UploadPage/steps/StepOptions";
import StepPayment from "../components/UploadPage/steps/StepPayment";
import StepConfirmation from "../components/UploadPage/steps/StepConfirmation";
import OwnerProfileCard from "../components/UploadPage/OwnerProfile";
import { UploadDataAPI, UserToUploadDataAPI } from '../api/endpoints';
// import LoadingButton from "components/SingInUP/components/LoadingButton";

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
  const [paymentMethod, setPaymentMethod] = useState("cash");
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
        setUniqueUrl(url);

        setIsLoadingShop(true);
        const data = await UserToUploadDataAPI(url);

        if (data && typeof data === 'object') {
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
              uniqueID={uniqueUrl}
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