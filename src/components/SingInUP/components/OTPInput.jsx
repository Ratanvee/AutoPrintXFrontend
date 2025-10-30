import React, { useRef } from 'react';

/**
 * Reusable OTP Input Component
 * @param {Array} otp - Array of OTP digits
 * @param {Function} setOtp - Function to update OTP state
 * @param {string} otpStatus - Status: "success", "error", or ""
 * @param {Function} onComplete - Optional callback when OTP is complete
 */
const OTPInput = ({ otp, setOtp, otpStatus = "", onComplete }) => {
    const otpRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

    const handleOtpChange = (index, value) => {
        // Limit to single character
        if (value.length > 1) {
            value = value.slice(0, 1);
        }

        // Only allow digits
        if (!/^\d*$/.test(value)) {
            return;
        }

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 3) {
            otpRefs[index + 1].current?.focus();
        }

        // Call onComplete if all 4 digits are filled
        if (onComplete && newOtp.every(digit => digit !== "") && index === 3) {
            onComplete(newOtp.join(""));
        }
    };

    const handleOtpKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            otpRefs[index - 1].current?.focus();
        }
    };

    return (
        <div style={{
            display: 'flex',
            gap: '10px',
            justifyContent: 'center',
            marginBottom: '20px'
        }}>
            {otp.map((digit, index) => (
                <input
                    key={index}
                    ref={otpRefs[index]}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    style={{
                        width: '50px',
                        height: '50px',
                        textAlign: 'center',
                        fontSize: '24px',
                        border: `2px solid ${otpStatus === "error"
                                ? 'red'
                                : otpStatus === "success"
                                    ? 'green'
                                    : '#ddd'
                            }`,
                        borderRadius: '8px',
                        outline: 'none',
                        transition: 'border-color 0.3s'
                    }}
                />
            ))}
        </div>
    );
};

export default OTPInput;