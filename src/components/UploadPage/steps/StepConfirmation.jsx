import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import HoverRating from "../../RatingWeb/Rating";
import RatingDialog from "../../RatingWeb/Rating";
import { Button } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
// import RatingDialog from './RatingDialog';

export default function StepConfirmation({ orderId, calculateTotal, paymentMethod, uniqueID }) {

    const [openRatingDialog, setOpenRatingDialog] = useState(false);

    const handleOpenRatingDialog = () => {
        setOpenRatingDialog(true);
    };

    const handleCloseRatingDialog = () => {
        setOpenRatingDialog(false);
    };

    return (
        <motion.div
            key="step4"
            className="payment-step-content"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
        >
            <div className="confirmation-content">
                <motion.div
                    className="confirmation-icon"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                    <Check size={48} />
                </motion.div>
                <h2>Order Confirmed!</h2>
                <p>Your order has been successfully placed and is being processed.</p>

                <div className="order-details">
                    <h3>Order Details</h3>
                    <div className="order-detail">
                        <span>Order Number:</span>
                        <span>{orderId}</span>
                    </div>
                    <div className="order-detail">
                        <span>Order Date:</span>
                        <span>{new Date().toLocaleDateString()}</span>
                    </div>
                    <div className="order-detail">
                        <span>Order Time:</span>
                        <span>{new Date().toLocaleTimeString()}</span>
                    </div>
                    <div className="order-detail">
                        <span>Total Amount:</span>
                        <span>₹{calculateTotal()}</span>
                    </div>
                    <div className="order-detail">
                        <span>Payment Method:</span>
                        <span>{paymentMethod}</span>
                    </div>
                    <div className="order-detail">
                        <span>Estimated Completion:</span>
                        {/* <span>{new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString()}</span> */}
                        <span>
                            {new Date(Date.now() + 5 * 60 * 1000).toLocaleString([], {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </span>
                    </div>
                </div>

                <p className="confirmation-message">
                    Please take a screenshot of this page to present to the owner or staff when you arrive to receive your order. This screenshot serves as your official order receipt and tracking reference.
                </p>



                <div className="confirmation-buttons">
                    <Link to="/" className="btn-secondary">
                        Back to Home
                    </Link>
                    {/* <Link to='/' className="btn-primary">
                        Again Order
                    </Link> */}
                    <button onClick={() => window.location.reload()} className="btn-primary">
                        Order Again
                    </button>
                </div>
            </div>
            <div>
                {/* Your other components */}

                {/* Button to open the rating dialog */}
                <Button
                    variant="contained"
                    startIcon={<StarIcon />}
                    onClick={handleOpenRatingDialog}
                    sx={{
                        backgroundColor: '#003d5c',
                        color: '#ffffff',
                        textTransform: 'none',
                        fontSize: '1rem',
                        fontWeight: 500,
                        px: 3,
                        py: 1.5,
                        borderRadius: 1,
                        '&:hover': {
                            backgroundColor: '#00293d',
                        },
                    }}
                >
                    Rate Us
                </Button>

                {/* Rating Dialog */}
                <RatingDialog
                    open={openRatingDialog}
                    onClose={handleCloseRatingDialog}
                />
            </div>
        </motion.div>
    );
}