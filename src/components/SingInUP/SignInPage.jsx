
// import React, { use, useState } from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//     faFacebookF,
//     faGoogle
// } from "@fortawesome/free-brands-svg-icons";
// // import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { login } from "../../api/endpoints";
// // import { AuthContext } from "../contexts/useAuth";
// import { useAuth } from "../../contexts/useAuth";
// import toast from 'react-hot-toast'; // <--- MUST BE HERE

// function SignInForm() {

//     const [username, setUsername] = useState("");
//     const [password, setPassword] = useState("");
//     const { login_user } = useAuth();
//     const [errorMessage, setErrorMessage] = useState('');  // For showing errors
//     const nav = useNavigate();


//     const handleLogin = async () => {
//         // const [isAuthenticated, setIsAuthenticated] = useState(false);
//         const success = await login(username, password);
//         if (success) {
//             // Handle successful login (e.g., redirect to dashboard)
//             console.log("Login successful");
//             // setIsAuthenticated(true);
//             nav("/dashboard");
//         } else {
//             // Handle login failure (e.g., show error message)
//             toast.error('Incorrect username or password');
//             // setErrorMessage('Incorrect username or password');
//             console.log("Login failed");
//         }
//         // setErrorMessage('Incorrect username or password');
//         // console.log(username)
//         // console.log(password)
//         // login_user(username, password)
//     }


//     return (
//         <div className="form-container sign-in-container">
//             <form className="snin-form">
//                 {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
//                 <h1 className="snin-h1">Sign in</h1>

//                 <div className="social-container">
//                     <a href="#" className="social snin-a">
//                         <FontAwesomeIcon icon={faGoogle} />
//                     </a>
//                     <a href="#" className="social snin-a">
//                         <FontAwesomeIcon icon={faFacebookF} />
//                     </a>
//                 </div>

//                 <span className="snin-span">or use your account</span>
//                 <input
//                     className="snin-input"
//                     //   type="email"
//                     type="text"
//                     placeholder="Username or Email"
//                     name="email"
//                     value={username}
//                     onChange={(e) => setUsername(e.target.value)}
//                 />
//                 <input
//                     className="snin-input"
//                     type="password"
//                     name="password"
//                     placeholder="Password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                 />

//                 <a className="snin-a" href="#">
//                     Forgot your password?
//                 </a>
//                 <button className="snin-button" type="button" onClick={handleLogin}>
//                     Sign In
//                 </button>
//             </form>
//         </div>
//     );
// }

// export default SignInForm;


import React, { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faFacebookF,
    faGoogle
} from "@fortawesome/free-brands-svg-icons";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { login, sendOTPAPI, verifyOTPAPI, resetPasswordAPI } from "../../api/endpoints";
// import { AuthContext } from "../contexts/useAuth";
import { useAuth } from "../../contexts/useAuth";
import toast from 'react-hot-toast'; // <--- MUST BE HERE
import { useNavigate } from "react-router-dom";
// import { LoaderCircle, TruckElectric } from 'lucide-react';
import { Loader } from 'rsuite';
import CircularProgress from '@mui/material/CircularProgress';

function SignInForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState('');
    const { login_user } = useAuth();
    // const [errorMessage, setErrorMessage] = useState('');  // For showing errors
    const nav = useNavigate();

    // Forgot password states
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [forgotPasswordStep, setForgotPasswordStep] = useState(1); // 1: email, 2: otp, 3: new password
    const [emailOrPhone, setEmailOrPhone] = useState("");
    const [otp, setOtp] = useState(["", "", "", ""]);
    const [otpStatus, setOtpStatus] = useState(""); // "success" or "error"
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    // const nav = useNavigate();


    const otpRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

    const handleLogin = async () => {
        // Your existing login logic
        const success = await login(username, password);
        if (success) {
            // Handle successful login (e.g., redirect to dashboard)
            console.log("Login successful");
            // setIsAuthenticated(true);
            nav("/dashboard");
        } else {
            // Handle login failure (e.g., show error message)
            toast.error('Incorrect username or password');
            // setErrorMessage('Incorrect username or password');
            console.log("Login failed");
        }
        // console.log("Login with:", username, password);
    };

    const handleForgotPasswordClick = () => {
        setShowForgotPassword(true);
        setForgotPasswordStep(1);
        setEmailOrPhone("");
        setOtp(["", "", "", ""]);
        setOtpStatus("");
        setErrorMessage("");
    };

    const handleBackToSignIn = () => {
        setShowForgotPassword(false);
        setForgotPasswordStep(1);
        setEmailOrPhone("");
        setOtp(["", "", "", ""]);
        setOtpStatus("");
        setNewPassword("");
        setConfirmPassword("");
        setErrorMessage("");
    };

    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingv, setIsLoadingv] = useState(false);

    const handleSendOTP = async () => {
        setIsLoading(true);
        if (!emailOrPhone.trim()) {
            setErrorMessage("Please enter your email or phone number");
            setIsLoading(false);
            return;
        }

        // API call to send OTP
        try {
            const response = await sendOTPAPI(emailOrPhone);
            if (response && response.success) {
                console.log("Sending OTP to:", emailOrPhone);
                setForgotPasswordStep(2);
                setErrorMessage("");
                setIsLoading(false);
            } else {
                // setErrorMessage(response.error || "Failed to send OTP");
                console.log("Failed to send OTP:", response);
                setIsLoading(false);
            }
        } catch (error) {
            setErrorMessage("Failed to send OTP. Please try again.");
            setIsLoading(false);
        }
    };

    const handleOtpChange = (index, value) => {
        if (value.length > 1) {
            value = value.slice(0, 1);
        }

        if (!/^\d*$/.test(value)) {
            return;
        }

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        setOtpStatus("");

        // Auto-focus next input
        if (value && index < 3) {
            otpRefs[index + 1].current?.focus();
        }
    };

    const handleOtpKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            otpRefs[index - 1].current?.focus();
        }
    };

    const handleVerifyOTP = async () => {
        const otpValue = otp.join("");

        if (otpValue.length !== 4) {
            setErrorMessage("Please enter complete OTP");
            setIsLoadingv(false);
            return;
        }

        // API call to verify OTP
        try {
            const isValid = await verifyOTPAPI(emailOrPhone, otpValue);
            console.log("Verifying OTP:", otpValue);
            console.log("Is OTP valid?:", isValid);

            // const isValid = otpValue === "1234"; // Mock validation

            if (isValid.message) {
                setOtpStatus("success");
                setErrorMessage("");
                setTimeout(() => {
                    setForgotPasswordStep(3);
                }, 500);
                setIsLoadingv(false);
            } else {
                setOtpStatus("error");
                setErrorMessage("Invalid OTP. Please try again.");
                setIsLoadingv(false);
            }
        } catch (error) {
            setOtpStatus("error");
            setErrorMessage("Failed to verify OTP. Please try again.");
            setIsLoadingv(false);
        }
    };
    const handleResetPassword = async () => {
        // Frontend validation
        if (!newPassword || !confirmPassword) {
            setErrorMessage("Please fill in all fields");
            return;
        }

        if (newPassword !== confirmPassword) {
            setErrorMessage("Passwords do not match");
            return;
        }

        if (newPassword.length < 8) {
            setErrorMessage("Password must be at least 8 characters");
            return;
        }

        // Optional: Add more frontend validations
        // if (!/\d/.test(newPassword)) {
        //     setErrorMessage("Password must contain at least one number");
        //     return;
        // }

        // if (!/[A-Z]/.test(newPassword)) {
        //     setErrorMessage("Password must contain at least one uppercase letter");
        //     return;
        // }

        // API call - only send newPassword (not confirmPassword)
        try {
            const response = await resetPasswordAPI(emailOrPhone, newPassword);
            console.log("Password reset for:", emailOrPhone);

            if (response.success) {
                toast.success(response.message, { duration: 5000 });
                handleBackToSignIn();
            } else {
                setErrorMessage(response.error);
                toast.error(response.error, { duration: 5000 });
            }
        } catch (error) {
            setErrorMessage("Failed to reset password. Please try again.");
            toast.error("Failed to reset password. Please try again.", { duration: 5000 });
        }
    };
    return (
        <div className="form-container sign-in-container">
            <div className="snin-form">
                {!showForgotPassword ? (
                    // Regular Sign In Form
                    <>
                        {errorMessage && <p style={{ color: 'red', marginBottom: '10px' }}>{errorMessage}</p>}
                        <h1 className="snin-h1">Sign in</h1>

                        <div className="social-container">
                            <a href="#" className="social snin-a">
                                <FontAwesomeIcon icon={faGoogle} />
                            </a>
                            <a href="#" className="social snin-a">
                                <FontAwesomeIcon icon={faFacebookF} />
                            </a>
                        </div>

                        <span className="snin-span">or use your account</span>
                        <input
                            className="snin-input"
                            type="text"
                            placeholder="Username or Email"
                            name="email"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <input
                            className="snin-input"
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <a className="snin-a" href="#" onClick={(e) => {
                            e.preventDefault();
                            handleForgotPasswordClick();
                        }}>
                            Forgot your password?
                        </a>
                        {/* <Loader content="Sending OTP..." speed="slow" size="sm" /> */}
                        <button className="snin-button" type="button" onClick={handleLogin}>
                            Sign In
                        </button>
                    </>
                ) : (
                    // Forgot Password Flow
                    <>
                        <button
                            type="button"
                            onClick={handleBackToSignIn}
                            style={{
                                alignSelf: 'flex-start',
                                background: 'none',
                                border: 'none',
                                color: '#5a67d8',
                                cursor: 'pointer',
                                fontSize: '14px',
                                marginBottom: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px'
                            }}
                        >
                            <FontAwesomeIcon icon={faArrowLeft} /> Back to Sign In
                        </button>

                        {/* Step 1: Enter Email/Phone */}
                        {forgotPasswordStep === 1 && (
                            <>
                                <h1 className="snin-h1" style={{ fontSize: '24px' }}>Forgot Password</h1>
                                <p style={{ color: '#666', marginBottom: '20px', fontSize: '14px' }}>
                                    Enter your email or phone number to receive an OTP
                                </p>

                                {errorMessage && <p style={{ color: 'red', marginBottom: '10px' }}>{errorMessage}</p>}

                                <input
                                    className="snin-input"
                                    type="text"
                                    placeholder="Email or Phone Number"
                                    value={emailOrPhone}
                                    onChange={(e) => setEmailOrPhone(e.target.value)}
                                />

                                <button
                                    className="snin-button"
                                    type="button"
                                    onClick={handleSendOTP}
                                    style={{ marginTop: '10px' }}
                                >
                                        {isLoading ? <span deactivate ><CircularProgress size="20px" color="inherit" /> Sending OTP...</span> : "Send OTP"}
                                </button>
                            </>
                        )}

                        {/* Step 2: Enter OTP */}
                        {forgotPasswordStep === 2 && (
                            <>
                                <h1 className="snin-h1" style={{ fontSize: '24px' }}>Enter OTP</h1>
                                <p style={{ color: '#666', marginBottom: '20px', fontSize: '14px' }}>
                                    We've sent a verification code to<br /><strong>{emailOrPhone}</strong>
                                </p>

                                {errorMessage && <p style={{ color: 'red', marginBottom: '10px' }}>{errorMessage}</p>}
                                {otpStatus === "success" && <p style={{ color: 'green', marginBottom: '10px' }}>OTP Verified Successfully!</p>}

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

                                <button
                                    className="snin-button"
                                    type="button"
                                    onClick={handleVerifyOTP}
                                >
                                    {isLoadingv ? <span style={{ marginLeft: '10px' }}><CircularProgress size="16px" color="inherit" /> Verifing...</span> : "Verify OTP"}
                                </button>

                                <a
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleSendOTP();
                                    }}
                                    style={{
                                        marginTop: '15px',
                                        color: '#5a67d8',
                                        fontSize: '14px',
                                        textDecoration: 'none'
                                    }}
                                >
                                    {isLoading ? <span style={{ marginLeft: '10px' }}><CircularProgress size="16px" color="inherit" /> Sending...</span> : "Resend OTP"}
                                </a>
                            </>
                        )}

                        {/* Step 3: Set New Password */}
                        {forgotPasswordStep === 3 && (
                            <>
                                <h1 className="snin-h1" style={{ fontSize: '24px' }}>Set New Password</h1>
                                <p style={{ color: '#666', marginBottom: '20px', fontSize: '14px' }}>
                                    Create a strong password for your account
                                </p>

                                {errorMessage && <p style={{ color: 'red', marginBottom: '10px' }}>{errorMessage}</p>}

                                <input
                                    className="snin-input"
                                    type="password"
                                    placeholder="New Password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />

                                <input
                                    className="snin-input"
                                    type="password"
                                    placeholder="Confirm Password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />

                                <button
                                    className="snin-button"
                                    type="button"
                                    onClick={handleResetPassword}
                                    style={{ marginTop: '10px' }}
                                >
                                    Reset Password
                                </button>
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default SignInForm;