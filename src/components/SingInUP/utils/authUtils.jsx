/**
 * Shared authentication utility functions
 */

/**
 * Validates email format
 */
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Validates password strength
 */
export const validatePassword = (password) => {
    const errors = [];

    if (password.length < 8) {
        errors.push("Password must be at least 8 characters");
    }

    // Optional: Add more validations
    // if (!/\d/.test(password)) {
    //   errors.push("Password must contain at least one number");
    // }
    // if (!/[A-Z]/.test(password)) {
    //   errors.push("Password must contain at least one uppercase letter");
    // }

    return {
        isValid: errors.length === 0,
        errors
    };
};

/**
 * Validates OTP (4 digits)
 */
export const isValidOTP = (otp) => {
    return otp.length === 4 && /^\d{4}$/.test(otp);
};

/**
 * Formats error messages from API responses
 */
export const formatErrorMessage = (error, defaultMessage = "An error occurred") => {
    if (typeof error === 'string') return error;
    if (error?.message) return error.message;
    if (error?.error) return error.error;
    return defaultMessage;
};

/**
 * Checks if input is email or phone
 */
export const getContactType = (input) => {
    if (isValidEmail(input)) return 'email';
    if (/^\d{10}$/.test(input)) return 'phone';
    return 'unknown';
};