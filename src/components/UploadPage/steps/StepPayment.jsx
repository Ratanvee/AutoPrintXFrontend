import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CreditCard, ArrowLeft, ArrowRight, IndianRupee } from "lucide-react";
import { CreateOrdersRazorpay } from '../../../api/endpoints';

export default function StepPayment({
    paymentMethod,
    setPaymentMethod,
    amount,
    setAmount,
    transactionId,
    setTransactionId,
    cashPayerName,
    setCashPayerName,
    loading,
    handleFinalSubmit,
    prevStep
}) {
    const handlePayment = async (e) => {
        e.preventDefault();
        const order = await CreateOrdersRazorpay(JSON.stringify({ amount }));

        const options = {
            key: import.meta.env.VITE_RazorPay_Key,
            amount: order.amount || amount * 100,
            currency: order.currency || "INR",
            name: "PrintEase",
            description: "Test Transaction",
            order_id: order.id,
            handler: function (res) {
                let paidAmount = order.amount / 100;
                setTransactionId(res.razorpay_payment_id);
                alert(`Payment successful! ₹${paidAmount} paid. Transaction ID: ${res.razorpay_payment_id}`);
            },
            theme: { color: "#3399cc" },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
    };

    const handleCompleteOrder = () => {
        if (paymentMethod === "online") {
            if (!transactionId) {
                alert("⚠️ Please complete online payment first.");
                return;
            }
        } else if (paymentMethod === "cash") {
            if (!cashPayerName.trim()) {
                alert("⚠️ Please enter your name to confirm cash payment.");
                return;
            }
        } else if (cashPayerName.trim() === "" || transactionId === "") {
            alert("⚠️ Please enter your name or complete online payment.");
            return;
        }

        handleFinalSubmit({ paymentMethod, transactionId, cashPayerName });
    };

    return (
        <motion.div
            key="step3"
            className="payment-step-content"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
        >
            <h2>Payment Information</h2>
            <div className="payment-options">
                <div className="payment-tabs">
                    <button
                        className={`payment-tab ${paymentMethod === "rezorpay" ? "active" : ""}`}
                        onClick={() => setPaymentMethod("rezorpay")}
                    >
                        <CreditCard size={16} />
                        RazorPay
                    </button>
                    <button
                        className={`payment-tab ${paymentMethod === "cash" ? "active" : ""}`}
                        onClick={() => setPaymentMethod("cash")}
                    >
                        <CreditCard size={16} />
                        Cash
                    </button>
                    <button
                        className={`payment-tab ${paymentMethod === "card" ? "active" : ""}`}
                        onClick={() => setPaymentMethod("card")}
                    >
                        Credit Card
                    </button>
                    <button
                        className={`payment-tab ${paymentMethod === "paypal" ? "active" : ""}`}
                        onClick={() => setPaymentMethod("paypal")}
                    >
                        PayPal
                    </button>
                    <button
                        className={`payment-tab ${paymentMethod === "bank" ? "active" : ""}`}
                        onClick={() => setPaymentMethod("bank")}
                    >
                        Bank Transfer
                    </button>
                </div>

                <AnimatePresence mode="wait">
                    {paymentMethod === "rezorpay" && (
                        <motion.div
                            key="rezorpay"
                            className="payment-form"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <div className="form-group">
                                <form onSubmit={handlePayment} className="flex flex-col gap-4 w-64">
                                    <label htmlFor="cardName">Full Name</label>
                                    <input
                                        type="text"
                                        id="cardName"
                                        onChange={(e) => setCashPayerName(e.target.value)}
                                        placeholder="John Doe"
                                        required
                                    />
                                    <label htmlFor="totalAmount">Total Amount</label>
                                    <div className="amount-box" style={{ flexGrow: 1, minWidth: '250px', display: 'flex', alignItems: 'center', position: 'relative' }}>
                                        <IndianRupee size={20} className="absolute ml-2 mt-3 text-gray-500" />
                                        <input
                                            type="number"
                                            placeholder="Enter Amount (₹)"
                                            value={amount}
                                            id="totalAmount"
                                            onChange={(e) => setAmount(e.target.value)}
                                            required
                                            className="border p-2 rounded"
                                            disabled
                                        />
                                    </div>
                                    <button type="submit" className="payment-tab">Payment</button>
                                </form>
                            </div>
                            {transactionId && (
                                <p className="mt-4 text-green-600">
                                    ✅ Payment Successful! Transaction ID: <b>{transactionId}</b>
                                </p>
                            )}
                        </motion.div>
                    )}

                    {paymentMethod === "cash" && (
                        <motion.div
                            key="cash"
                            className="payment-form"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <div className="form-group">
                                <label htmlFor="cardName">Full Name</label>
                                <input
                                    type="text"
                                    id="cardName"
                                    onChange={(e) => setCashPayerName(e.target.value)}
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                            {cashPayerName && (
                                <p className="mt-4 text-green-600">
                                    ✅ You can give money to Owner : <b>{cashPayerName}</b>
                                </p>
                            )}
                        </motion.div>
                    )}

                    {paymentMethod === "card" && (
                        <motion.div
                            key="card"
                            className="payment-form"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <div className="form-group">
                                <label htmlFor="cardName">Cardholder Name</label>
                                <input type="text" id="cardName" placeholder="John Doe" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="cardNumber">Card Number</label>
                                <input type="text" id="cardNumber" placeholder="1234 5678 9012 3456" required />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="expDate">Expiration Date</label>
                                    <input type="text" id="expDate" placeholder="MM/YY" required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="cvv">CVV</label>
                                    <input type="text" id="cvv" placeholder="123" required />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="billingAddress">Billing Address</label>
                                <input type="text" id="billingAddress" placeholder="Street Address" required />
                            </div>
                        </motion.div>
                    )}

                    {paymentMethod === "paypal" && (
                        <motion.div
                            key="paypal"
                            className="paypal-content"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <div className="paypal-info">
                                <img src="https://placehold.co/200x80/0070ba/white?text=PayPal" alt="PayPal" />
                                <p>You will be redirected to PayPal to complete your payment securely.</p>
                            </div>
                        </motion.div>
                    )}

                    {paymentMethod === "bank" && (
                        <motion.div
                            key="bank"
                            className="bank-content"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <h3>Bank Transfer Details</h3>
                            <div className="bank-details">
                                <div className="bank-detail">
                                    <span>Bank Name:</span>
                                    <span>SmartBank</span>
                                </div>
                                <div className="bank-detail">
                                    <span>Account Name:</span>
                                    <span>SmartDocX Inc.</span>
                                </div>
                                <div className="bank-detail">
                                    <span>Account Number:</span>
                                    <span>1234567890</span>
                                </div>
                                <div className="bank-detail">
                                    <span>Reference:</span>
                                    <span>ORD-2025-001</span>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
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
                    onClick={handleCompleteOrder}
                    disabled={loading}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Complete Order <ArrowRight size={16} />
                </motion.button>
            </div>
        </motion.div>
    );
}