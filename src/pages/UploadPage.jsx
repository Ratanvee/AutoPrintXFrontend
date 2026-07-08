import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";
import { toast } from 'react-hot-toast';
import '../styles/payment/payment.css';
import '../styles/payment/ownerprofile.css';
import Divider from '@mui/material/Divider';

// Import step components
import StepUpload from "../components/UploadPage/steps/StepUpload";
import StepOptions from "../components/UploadPage/steps/StepOptions";
import StepPayment from "../components/UploadPage/steps/StepPayment";
import StepConfirmation from "../components/UploadPage/steps/StepConfirmation";
import OwnerProfileCard from "../components/UploadPage/OwnerProfile";
import { UserToUploadDataAPI } from '../api/endpoints';

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


  const [shopPricing, setShopPricing] = useState({
    bw: 2,
    color: 8,
    spiral: 30,
    hardcover: 80,
    staple: 0,
    premium: 2,
    glossy: 3,
    a3: 5,
    doubleside: 0,
  })

  const calculateTotal = () => {
    const bwPrice = Number(shopPricing.bw) || 2
    const colorPrice = Number(shopPricing.color) || 8
    const premiumExtra = Number(shopPricing.premium) || 2
    const spiralCost = Number(shopPricing.spiral) || 30
    const hardcoverCost = Number(shopPricing.hardcover) || 80
    const stapleCost = Number(shopPricing.staple) || 0

    const basePrice = printOptions.printColor === "bw" ? bwPrice : colorPrice
    const paperExtra = printOptions.paperType === "premium" ? premiumExtra : 0

    const bindingCost =
      printOptions.binding === "spiral" ? spiralCost :
        printOptions.binding === "hardcover" ? hardcoverCost :
          printOptions.binding === "staple" ? stapleCost : 0

    const totalPages = uploadedFiles.reduce((acc, file) => acc + (file.pages || 0), 0)

    const printCost = (basePrice + paperExtra) * totalPages * printOptions.copies
    const bindingTotal = bindingCost * uploadedFiles.length

    return (printCost + bindingTotal).toFixed(2)
  }


  // Generate order ID
  const generateOrderId = () => {
    const now = new Date();
    const timestamp = now.toISOString().replace(/[-T:.Z]/g, "").slice(10, 12);
    const randomPart = Math.random().toString(36).substring(6, 8).toUpperCase();
    return `ORD-${timestamp}${randomPart}`;
  };


  const handleFinalSubmit = async ({ paymentMethod, transactionId, cashPayerName }) => {
    setLoading(true);
    const loadingToast = toast.loading('Submitting your order...');
    const generatedOrderId = generateOrderId();
    setOrderId(generatedOrderId);

    try {
      // Validation checks
      if (uploadedFiles.length === 0) {
        toast.dismiss(loadingToast);
        toast.error('Please upload at least one file');
        setLoading(false);
        return;
      }

      if (uploadedFiles.length > 5) {
        toast.dismiss(loadingToast);
        toast.error('You can only upload up to 5 files at once');
        setLoading(false);
        return;
      }

      // ✅ Check total file size for iOS
      const totalSize = uploadedFiles.reduce((acc, file) => acc + file.size, 0);
      if (totalSize > 50 * 1024 * 1024) {
        toast.dismiss(loadingToast);
        toast.error('Total file size exceeds 50MB limit');
        setLoading(false);
        return;
      }

      if (paymentMethod === 'upi' && !transactionId) {
        toast.dismiss(loadingToast);
        toast.error('Transaction ID is required for UPI payments');
        setLoading(false);
        return;
      }

      if (paymentMethod === 'cash' && !cashPayerName) {
        toast.dismiss(loadingToast);
        toast.error('Please enter your name for cash payment');
        setLoading(false);
        return;
      }

      const formData = new FormData();

      // Build page counts
      const pageCounts = {};
      let totalPages = 0;

      uploadedFiles.forEach((file, index) => {
        // ✅ Ensure proper file object for iOS
        if (file.file instanceof File || file.file instanceof Blob) {
          formData.append('FileUpload', file.file, file.name);
        }

        const pageCount = file.pages || 0;
        pageCounts[file.name] = pageCount;
        totalPages += pageCount;

        toast.loading(`Uploading ${file.name}...`, {
          id: `file-${index}`,
          duration: Infinity
        });
      });

      // Add form data
      formData.append('FilePagesCount', JSON.stringify(pageCounts));
      formData.append('PaperSize', printOptions.paperSize);
      formData.append('PaperType', printOptions.paperType);
      formData.append('PrintColor', printOptions.printColor);
      formData.append('PrintSide', printOptions.printSides);
      formData.append('Binding', printOptions.binding);
      formData.append('NumberOfCopies', printOptions.copies);
      formData.append('PaymentAmount', amount);
      formData.append('NoOfPages', totalPages);
      formData.append('PaymentStatus', transactionId ? 1 : 0);
      formData.append('Transaction_id', transactionId || "");
      formData.append('CustomerName', cashPayerName || "");
      formData.append('OrderId', generatedOrderId);
      formData.append('PaymentMethod', paymentMethod);

      // ✅ Get API URL from environment
      const apiUrl = import.meta.env.VITE_BaseURL1;

      // ✅ Check if API URL is HTTPS (required for iOS in production)
      if (apiUrl && !apiUrl.startsWith('https://') && !apiUrl.includes('localhost')) {
        console.error('⚠️ API URL must be HTTPS for iOS:', apiUrl);
        toast.dismiss(loadingToast);
        toast.error('Server configuration error. Please contact support.');
        setLoading(false);
        // return;
      }

      console.log('📤 Uploading to:', `${apiUrl}upload/${uniqueUrl}/`);

      // ✅ Use fetch with proper iOS configuration
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 300000); // 5 min timeout

      const response = await fetch(`${apiUrl}upload/${uniqueUrl}/`, {
        method: 'POST',
        body: formData,
        // ✅ CRITICAL: Remove credentials for cross-origin on iOS
        // credentials: 'include',  // Comment this out if having issues
        mode: 'cors',
        signal: controller.signal,
        // ✅ Don't set Content-Type - let browser set it with boundary
      });

      clearTimeout(timeoutId);

      // Dismiss loading toasts
      toast.dismiss(loadingToast);
      uploadedFiles.forEach((_, index) => toast.dismiss(`file-${index}`));

      // ✅ Check response
      if (!response.ok) {
        let errorMessage = `Server error: ${response.status}`;

        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch (e) {
          // Response is not JSON
          const errorText = await response.text();
          console.error('Error response:', errorText);
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();

      if (data && data.success) {
        console.log('✅ Upload successful:', data);
        toast.success(
          `Order submitted successfully!\nOrder ID: ${generatedOrderId}`,
          {
            duration: 6000,
            position: 'top-center',
            style: {
              background: '#10b981',
              color: '#fff',
              fontWeight: 'bold',
            },
          }
        );
        nextStep();
      } else {
        throw new Error(data?.error || data?.message || 'Failed to submit order');
      }

    } catch (error) {
      console.error("❌ Order submission failed:", error);
      toast.dismiss(loadingToast);
      uploadedFiles.forEach((_, index) => toast.dismiss(`file-${index}`));

      // ✅ Better error messages for iOS
      let errorMessage = 'Failed to submit order';

      if (error.name === 'AbortError') {
        errorMessage = 'Upload timeout. Please try with smaller files or check your connection.';
      } else if (error.message.includes('Failed to fetch') || error.message.includes('Load failed')) {
        // ✅ This is the iOS "Load failed" error
        errorMessage = 'Connection failed. Please check:\n• Your internet connection\n• The server is accessible\n• Try again in a moment';
      } else if (error.message.includes('NetworkError')) {
        errorMessage = 'Network error. Please check your internet connection.';
      } else if (error.message.includes('CORS')) {
        errorMessage = 'Server configuration error. Please contact support.';
      } else {
        errorMessage = error.message || errorMessage;
      }

      toast.error(errorMessage, {
        duration: 8000,
        position: 'top-center',
      });
    } finally {
      setLoading(false);
    }
  };

  // Navigation functions
  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      toast.success(`✓ Step ${currentStep} completed!`, {
        duration: 2000,
        position: 'top-right',
      });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      toast('← Going back to previous step', {
        duration: 2000,
        position: 'top-right',
      });
    }
  };

  // Steps configuration
  const steps = [
    { number: 1, title: "Upload", active: currentStep >= 1, completed: currentStep > 1 },
    { number: 2, title: "Options", active: currentStep >= 2, completed: currentStep > 2 },
    { number: 3, title: "Payment", active: currentStep >= 3, completed: currentStep > 3 },
    { number: 4, title: "Confirm", active: currentStep >= 4, completed: currentStep > 4 },
  ];


  useEffect(() => {
    const fetchOwnerInfo = async () => {
      try {
        document.title = 'AutoPrintX | Upload & Print';
        const url = location.pathname.split('/').pop();
        setUniqueUrl(url);
        setIsLoadingShop(true);

        const loadingToast = toast.loading('Loading shop information...');
        const data = await UserToUploadDataAPI(url);
        // const data = await UserToUploadDataAPI(url);
        console.log("API Response:", data);  // ← add this

        setShopData(data.owner_info);        // ✅ shop name, phone, etc.
        setShopPricing(data.pricing);        // ✅ owner's real pricing
        toast.dismiss(loadingToast);

        if (data && typeof data === 'object') {
          // ✅ Shop info lives under data.owner_info now
          setShopData(data.owner_info || data);

          // ✅ Extract pricing from the same response — no extra API call needed
          if (data.pricing && typeof data.pricing === 'object') {
            setShopPricing(data.pricing);
          }

          toast.success(`Welcome to ${data.owner_info?.name || data.name || 'our shop'}!`, {
            duration: 3000,
            position: 'top-center',
          });
        } else {
          setShopData(null);
          toast.error('Shop information not available', { duration: 4000 });
        }
      } catch (error) {
        console.error("Error fetching owner info:", error);
        setShopData(null);
        toast.error('Failed to load shop information', { duration: 4000 });
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

    if (uploadedFiles.length > 0 && currentStep === 2) {
      toast(`Total amount: ₹${total}`, {
        duration: 2000,
        position: 'bottom-right',
        icon: '💵',
      });
    }
  }, [uploadedFiles, printOptions]);

  return (
    <div className="payment-page">
      {/* Header */}
      <header className="header">
        <nav className="navbar">
          <div className="logo">
            <h1>Auto<span>PrintX</span></h1>
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
          <Divider></Divider>

          {/* Progress Steps */}
          {/* <motion.div
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
          </motion.div> */}

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
              shopPricing={shopPricing}
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
            <p>Contact us: autoprintx@gmail.com</p>
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