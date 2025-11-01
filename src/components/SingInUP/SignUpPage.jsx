import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF, faGoogle } from "@fortawesome/free-brands-svg-icons";
import { SignUpAPI, sendOTPAPI, verifyOTPAPI } from '../../api/endpoints';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from "lucide-react";
import OTPInput from "./components/OTPInput";
import LoadingButton from "./components/LoadingButton";
import { validatePassword, isValidEmail } from "./utils/authUtils";

function SignUpForm() {
  const [state, setState] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  // Verification states
  const [signupStep, setSignupStep] = useState(1); // 1: form, 2: verify email, 3: set password
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [otpStatus, setOtpStatus] = useState("");

  // Loading states
  const [loading, setLoading] = useState(false);
  const [sendingOTP, setSendingOTP] = useState(false);
  const [verifyingOTP, setVerifyingOTP] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (evt) => {
    setState({ ...state, [evt.target.name]: evt.target.value });
  };

  const handleSendOTP = async () => {
    if (!state.name.trim()) {
      toast.error("Please enter your name");
      return;
    }

    if (!state.email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    if (!isValidEmail(state.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setSendingOTP(true);
    try {
      const response = await sendOTPAPI(state.email, 'signup');
      if (response?.success) {
        setSignupStep(2);
        toast.success("Verification code sent to your email!");
      } else {
        console.log("something wrong")
        // toast.error(response?.error || "Failed to send verification code");
      }
    } catch (error) {
      toast.error("Failed to send verification code. Please try again.");
    } finally {
      setSendingOTP(false);
    }
  };

  const handleVerifyOTP = async () => {
    const otpValue = otp.join("");

    if (otpValue.length !== 4) {
      toast.error("Please enter complete OTP");
      return;
    }

    setVerifyingOTP(true);
    try {
      const response = await verifyOTPAPI(state.email, otpValue);

      if (response?.message) {
        setOtpStatus("success");
        setIsEmailVerified(true);
        toast.success("Email verified successfully!");
        setTimeout(() => setSignupStep(3), 500);
      } else {
        setOtpStatus("error");
        toast.error("Invalid OTP. Please try again.");
      }
    } catch (error) {
      setOtpStatus("error");
      toast.error("Failed to verify OTP. Please try again.");
    } finally {
      setVerifyingOTP(false);
    }
  };

  const handleOnSubmit = async (evt) => {
    evt.preventDefault();

    if (!isEmailVerified) {
      toast.error("Please verify your email first");
      return;
    }

    if (!state.password || !state.confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }

    if (state.password !== state.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const validation = validatePassword(state.password);
    if (!validation.isValid) {
      toast.error(validation.errors[0]);
      return;
    }

    setLoading(true);
    try {
      const data = await SignUpAPI(state.name, state.email, state.password);
      if (data?.success) {
        toast.success("Registration Successful! Please sign in.", { duration: 5000 });
        setState({ name: "", email: "", password: "", confirmPassword: "" });
        setSignupStep(1);
        setIsEmailVerified(false);
        setOtp(["", "", "", ""]);
      } else {
        toast.error(data?.error || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToForm = () => {
    setSignupStep(1);
    setOtp(["", "", "", ""]);
    setOtpStatus("");
  };

  return (
    <div className="form-container sign-up-container">
      <form className="snin-form" onSubmit={handleOnSubmit}>
        {signupStep === 1 && (
          // Step 1: Basic Info + Email with Verify Button
          <>
            <h1 className="snin-h1">Create Account</h1>

            <div className="social-container">
              <a href="#" className="social snin-a">
                <FontAwesomeIcon icon={faGoogle} />
              </a>
              <a href="#" className="social snin-a">
                <FontAwesomeIcon icon={faFacebookF} />
              </a>
            </div>

            <span className="snin-span">or use your email for registration</span>

            <input
              className="snin-input"
              type="text"
              name="name"
              value={state.name}
              onChange={handleChange}
              placeholder="Name"
              required
            />

            <div style={{ position: 'relative', width: '100%' }}>
              <input
                className="snin-input"
                type="email"
                name="email"
                value={state.email}
                onChange={handleChange}
                placeholder="Email"
                required
                style={{ paddingRight: '80px' }}
              />
              <button
                type="button"
                onClick={handleSendOTP}
                disabled={sendingOTP || !state.email || !state.name}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#5a67d8',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '600',
                  textDecoration: 'underline',
                  padding: '5px',
                  opacity: sendingOTP || !state.email || !state.name ? 0.5 : 1,
                  pointerEvents: sendingOTP || !state.email || !state.name ? 'none' : 'auto'
                }}
              >
                {sendingOTP ? 'Sending...' : 'Verify'}
              </button>
            </div>

            <p style={{ fontSize: '12px', color: '#666', marginTop: '-10px', textAlign: 'left', width: '100%' }}>
              Click "Verify" to receive a verification code
            </p>
          </>
        )}

        {signupStep === 2 && (
          // Step 2: OTP Verification
          <>
            <button
              type="button"
              onClick={handleBackToForm}
              style={{
                alignSelf: 'flex-start',
                background: 'none',
                border: 'none',
                color: '#5a67d8',
                cursor: 'pointer',
                fontSize: '14px',
                marginBottom: '10px'
              }}
            >
              ← Back
            </button>

            <h1 className="snin-h1" style={{ fontSize: '24px' }}>Verify Email</h1>
            <p style={{ color: '#666', marginBottom: '20px', fontSize: '14px' }}>
              We've sent a verification code to<br /><strong>{state.email}</strong>
            </p>

            {otpStatus === "success" && (
              <p style={{ color: 'green', marginBottom: '10px' }}>Email Verified Successfully!</p>
            )}

            <OTPInput
              otp={otp}
              setOtp={setOtp}
              otpStatus={otpStatus}
            />

            <LoadingButton
              loading={verifyingOTP}
              loadingText="Verifying..."
              onClick={handleVerifyOTP}
              type="button"
            >
              Verify OTP
            </LoadingButton>

            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setOtp(["", "", "", ""]);
                setOtpStatus("");
                handleSendOTP();
              }}
              style={{
                marginTop: '15px',
                color: '#5a67d8',
                fontSize: '14px',
                textDecoration: 'none'
              }}
            >
              {sendingOTP ? "Sending..." : "Resend Code"}
            </a>
          </>
        )}

        {signupStep === 3 && (
          // Step 3: Set Password
          <>
            <button
              type="button"
              onClick={() => setSignupStep(2)}
              style={{
                alignSelf: 'flex-start',
                background: 'none',
                border: 'none',
                color: '#5a67d8',
                cursor: 'pointer',
                fontSize: '14px',
                marginBottom: '10px'
              }}
            >
              ← Back
            </button>

            <h1 className="snin-h1" style={{ fontSize: '24px' }}>Set Password</h1>
            <p style={{ color: '#666', marginBottom: '20px', fontSize: '14px' }}>
              Create a secure password for your account
            </p>

            <div style={{ position: 'relative', width: '100%' }}>
              <input
                type={showPassword ? "text" : "password"}
                className="snin-input"
                name="password"
                placeholder="Password"
                value={state.password}
                onChange={handleChange}
                required
              />
              <span
                className="signup-eye-icon"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '15px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  cursor: 'pointer',
                  color: '#666'
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </span>
            </div>

            <div style={{ position: 'relative', width: '100%' }}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="snin-input"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={state.confirmPassword}
                onChange={handleChange}
                required
              />
              <span
                className="signup-eye-icon"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: 'absolute',
                  right: '15px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  cursor: 'pointer',
                  color: '#666'
                }}
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </span>
            </div>

            <LoadingButton
              loading={loading}
              loadingText="Creating Account..."
              type="submit"
              style={{ marginTop: '10px' }}
            >
              Sign Up
            </LoadingButton>
          </>
        )}
      </form>
    </div>
  );
}

export default SignUpForm;