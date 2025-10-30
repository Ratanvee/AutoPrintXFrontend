

import axios from "axios";
// import { c } from "framer-motion/dist/types.d-Cjd591yU";

// const API_URL = "http://127.0.0.1:8000/api/";
const API_URL = import.meta.env.VITE_BaseURL1;
const LOGIN_URL = `${API_URL}token/`;
const REFRESH_URL = `${API_URL}token/refresh/`;
const NOTES_URL = `${API_URL}notes/`;
const LOGOUT_URL = `${API_URL}logout/`;
const AUTH_URL = `${API_URL}auth/`;
const DASHBOARD_URL = `${API_URL}dashboards/`;
const UPLOAD_URL = `${API_URL}upload/`
const CREATEORDERS_URL = `${API_URL}create-order/`
const SIGNUP_URL = `${API_URL}register/`
const sendOTPURL = `${API_URL}send-otp/`;
const verifyOTPURL = `${API_URL}verify-otp/`;
const resetPasswordURL = `${API_URL}reset-password/`;




axios.defaults.withCredentials = true;

// export const login = async (username, password) => {
//   try {
//     console.log("Attempting login...")
//     const response = await axios.post(
//       LOGIN_URL,
//       { username, password },
//       {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );
//     return response.data.success;
//   } catch (error) {
//     console.error("Login Error:", error);
//     return false;
//   }
// };


export const login = async (username, password) => {
  try {
    console.log("Attempting login...");
    const response = await axios.post(LOGIN_URL, { username, password }, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,  // Important for cookies
    });

    if (response.data.success) {
      console.log("Access Token : ", response.data.AccessToken)
      console.log("Access Token : ", response.data.RefreshToken)
      return true;
    } else {
      // console.error('Login failed:', response.data.error);
      // setErrorMessage('Incorrect username or password');
      return false;
    }

  } catch (error) {
    // 2. Handle Network/HTTP Errors (Server Offline, 4xx, 5xx)

    let errorMessage = "An unknown error occurred. Try again later!";

    // Check if the error is due to the server being completely offline (Network Error)
    if (axios.isAxiosError(error) && !error.response) {
      errorMessage = "Connection Failed: The server is offline or unreachable.";
      // If offline, use a persistent toast
      toast.error(errorMessage, {
        duration: 5000, // Keeps the toast visible
        position: 'top-center'
      });

      // Check for specific HTTP status codes (e.g., 404, 500)
    } else if (error.response) {
      // Use the status code or the error message from the server response
      const status = error.response.status;
      errorMessage = `Request failed: HTTP ${status} - ${error.response.data.detail || 'Server error'}`;
      toast.error(errorMessage, { duration: 5000 });
    } else {
      // Other errors (e.g., request setup failed)
      toast.error(errorMessage, { duration: 5000 });
    }

    // Return the error object or null so the calling function can handle the failure
    return null; // or throw error;
  }
};

export const SignUpAPI = async (username, email, password) => {
  try {
    const response = await axios.post(
      SIGNUP_URL,
      {
        username,
        email,
        password,
      },
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true, // ✅ ensures cookie handling works
      }
    );
    return response.data;
  } catch (error) {
    // 2. Handle Network/HTTP Errors (Server Offline, 4xx, 5xx)

    let errorMessage = "An unknown error occurred. Try again later!";

    // Check if the error is due to the server being completely offline (Network Error)
    if (axios.isAxiosError(error) && !error.response) {
      errorMessage = "Connection Failed: The server is offline or unreachable.";
      // If offline, use a persistent toast
      toast.error(errorMessage, {
        duration: 5000, // Keeps the toast visible
        position: 'top-center'
      });

      // Check for specific HTTP status codes (e.g., 404, 500)
    } else if (error.response) {
      // Use the status code or the error message from the server response
      const status = error.response.status;
      errorMessage = `Request failed: HTTP ${status} - ${error.response.data.detail || 'Server error'}`;
      toast.error(errorMessage, { duration: 5000 });
    } else {
      // Other errors (e.g., request setup failed)
      toast.error(errorMessage, { duration: 5000 });
    }

    // Return the error object or null so the calling function can handle the failure
    return null; // or throw error;
  }
};


export const refreshToken = async () => {
  try {
    await axios.post(
      REFRESH_URL,
      {},
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    return true;
  } catch (error) {
    console.error("Refresh Error:", error);
    return false;
  }
};

export const get_notes = async () => {
  try {
    const response = await axios.get(NOTES_URL, { withCredentials: true, });
    return response.data;
  } catch (error) {
    return call_refresh(error, () => axios.get(NOTES_URL, { withCredentials: true, }));
  }
};

const call_refresh = async (error, func) => {
  if (error.response && error.response.status === 401) {
    const refresh_response = await refreshToken();
    if (refresh_response) {
      const retry_response = await func();
      return retry_response.data;
    }
  }
};

export const logout = async () => {
  try {
    await axios.post(
      LOGOUT_URL,
      {},
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    return true;
  } catch (error) {
    console.error("Logout Error:", error);
    return false;
  }
};

// export const is_authenticated = async () => {
//   console.log("Checking authentication status..................");
//   try {
//     await axios.post(
//       AUTH_URL,
//       {},
//       {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );
//     return true;
//   } catch (error) {
//     console.error("Auth Check Error:", error);
//     return false;
//   }
// };

export const is_authenticated = async () => {
  console.log("Checking authentication status..................");
  try {
    await axios.get(AUTH_URL, { withCredentials: true, credentials: 'include' });
    console.log("User is authenticated.");
    return true;
  } catch (error) {
    console.error("Auth Check Error:", error);
    return false;
  }
};

// export const UserToUploadDataAPI = async(uniqueUrl) => {
//   try{
//     const response = await axios.get(`${UPLOAD_URL}${uniqueUrl}/`, { withCredentials: true });
//     console.log("This is data user : ", response)
//     if (response.data.error){
//       alert(response.data.error)
//     }
//     return response.data;
//   } catch (error) {
//     // console.log("Somthing Whent Wrong..")
//     // alert("Somthing went Wrong... Try again later!!")
//     return error;
//   }
// }
// import axios from 'axios';
import toast from 'react-hot-toast'; // 👈 Import the toast function
export const UserToUploadDataAPI = async (uniqueUrl) => {
  try {
    const response = await axios.get(`${UPLOAD_URL}${uniqueUrl}/`, {
      withCredentials: true
    });

    console.log("Full API Response:", response);
    console.log("Response Data:", response.data);

    // Check if response has an error field
    if (response.data && response.data.error) {
      toast.error(response.data.error);
      return null;
    }

    // Return owner_info if it exists
    if (response.data && response.data.owner_info) {
      console.log("Owner Info:", response.data.owner_info);
      return response.data.owner_info;
    }

    // If no owner_info, return null
    console.warn("No owner_info in response");
    return null;

  } catch (error) {
    console.error("API Error:", error);

    let errorMessage = "An unknown error occurred. Try again later!";

    // Network error (server offline)
    if (axios.isAxiosError(error) && !error.response) {
      errorMessage = "🔴 Connection Failed: The server is offline or unreachable.";
      toast.error(errorMessage, {
        duration: Infinity,
        position: 'top-center'
      });
    }
    // HTTP error (4xx, 5xx)
    else if (error.response) {
      const status = error.response.status;
      const detail = error.response.data?.detail || error.response.data?.error || 'Server error';
      errorMessage = `Request failed: HTTP ${status} - ${detail}`;
      toast.error(errorMessage);
    }
    // Other errors
    else {
      toast.error(errorMessage);
    }

    return null;
  }
};

export const UploadDataAPI = async (data, uniqueUrl) => {
  try {
    const response = await axios.post(`${UPLOAD_URL}${uniqueUrl}/`, data, {
      withCredentials: true,
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data
  } catch (error) {
    console.error("Order place Error : ", error)
    return false;
  }
};


export const CreateOrdersRazorpay = async (data) => {
  try {
    const response = await fetch(CREATEORDERS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
      body: data,
    });
    return response.json();
  } catch (error) {
    console.error("Create Order Error : ", error)
    return false;
  }
};



// 1. Send OTP
// export const sendOTPAPI = async (emailOrPhone) => {
//   try {
//     const response = await fetch(sendOTPURL, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ email_or_phone: emailOrPhone })
//     });
//     console.log("This is send otp response : ", response)
//     return response;
//   } catch (error) {
//     console.error("Send OTP Error : ", error)
//     return false;
//   }
// };

// 1. Send OTP
export const sendOTPAPI = async (emailOrPhone, purpose) => {
  try {
    const response = await fetch(sendOTPURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email_or_phone: emailOrPhone, purpose: purpose })
    });

    const data = await response.json();
    // console.log("Send OTP response:", data);
    

    if (!response.ok) {
      // Return error data for handling in component
      toast.error(data.error || 'Failed to send OTP', { duration: 5000 });
      return {
        success: false,
        error: data || 'Failed to send OTP',
        status: response.status
      };
    }

    // console.log("Send OTP success:", data);
    toast.success(data.message, { duration: 5000 });

    return {
      success: true,
      message: data.message,
      status: response.status
    };

  } catch (error) {
    console.error("Send OTP Error:", error);
    return {
      success: false,
      error: 'Network error. Please try again.',
      status: null
    };
  }
};

// 2. Verify OTP
// 2. Verify OTP
export const verifyOTPAPI = async (emailOrPhone, otp) => {
  try {
    const response = await fetch(verifyOTPURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email_or_phone: emailOrPhone,
        otp: otp
      })
    });

    const data = await response.json();
    console.log("Verify OTP response:", data);

    if (!response.ok) {
      toast.error(data.error || 'Failed to verify OTP', { duration: 10000 });
      return {
        success: false,
        error: data.error || 'Failed to verify OTP',
        status: response.status
      };
    }
    toast.success(data.message, { duration: 5000 });

    return {
      success: true,
      message: data.message,
      status: response.status
    };

  } catch (error) {
    console.error("Verify OTP Error:", error);
    return {
      success: false,
      error: 'Network error. Please try again.',
      status: null
    };
  }
};

// 3. Reset Password
// 3. Reset Password
export const resetPasswordAPI = async (emailOrPhone, newPassword) => {
  try {
    const response = await fetch(resetPasswordURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email_or_phone: emailOrPhone,
        new_password: newPassword
        // Remove confirm_password from here
      })
    });

    const data = await response.json();
    console.log("Reset Password response:", data);

    if (!response.ok) {
      return {
        success: false,
        error: typeof data.error === 'object'
          ? Object.values(data.error).flat().join(', ')
          : data.error || 'Failed to reset password',
        status: response.status
      };
    }

    return {
      success: true,
      message: data.message,
      status: response.status
    };

  } catch (error) {
    console.error("Reset Password Error:", error);
    return {
      success: false,
      error: 'Network error. Please try again.',
      status: null
    };
  }
};