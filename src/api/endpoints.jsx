

import axios from "axios";

// const API_URL = "http://127.0.0.1:8000/api/";
const API_URL = import.meta.env.VITE_BaseURL1 ;
const LOGIN_URL = `${API_URL}token/`;
const REFRESH_URL = `${API_URL}token/refresh/`;
const NOTES_URL = `${API_URL}notes/`;
const LOGOUT_URL = `${API_URL}logout/`;
const AUTH_URL = `${API_URL}auth/`;
const DASHBOARD_URL = `${API_URL}dashboards/`;
const UPLOAD_URL = `${API_URL}upload/`
const CREATEORDERS_URL = `${API_URL}create-order/`
const SIGNUP_URL = `${API_URL}register/`
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

export const SignUpAPI = async(username, email, password) => {
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

export const is_authenticated = async () => {
  console.log("Checking authentication status..................");
  try {
    await axios.post(
      AUTH_URL,
      {},
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return true;
  } catch (error) {
    console.error("Auth Check Error:", error);
    return false;
  }
};

// export const is_authenticated = async () => {
//   console.log("Checking authentication status..................");
//   try {
//     await axios.get(AUTH_URL, { withCredentials: true, credentials: 'include' });
//     console.log("User is authenticated.");
//     return true;
//   } catch (error) {
//     console.error("Auth Check Error:", error);
//     return false;
//   }
// };

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
    const response = await axios.get(`${UPLOAD_URL}${uniqueUrl}/`, { withCredentials: true });

    console.log("This is data user : ", response);

    // 1. Handle Application-Level Errors (Django returned a 200, but included an error field)
    if (response.data.error) {
      // alert(response.data.error); // Replace alert with toast
      toast.error(response.data.error);
      // Optionally, return null or throw an error here if you don't want to return the partial data
    }

    return response.data;

  } catch (error) {
    // 2. Handle Network/HTTP Errors (Server Offline, 4xx, 5xx)

    let errorMessage = "An unknown error occurred. Try again later!";

    // Check if the error is due to the server being completely offline (Network Error)
    if (axios.isAxiosError(error) && !error.response) {
      errorMessage = "🔴 Connection Failed: The server is offline or unreachable.";
      // If offline, use a persistent toast
      toast.error(errorMessage, {
        duration: Infinity, // Keeps the toast visible
        position: 'top-center'
      });

      // Check for specific HTTP status codes (e.g., 404, 500)
    } else if (error.response) {
      // Use the status code or the error message from the server response
      const status = error.response.status;
      errorMessage = `Request failed: HTTP ${status} - ${error.response.data.detail || 'Server error'}`;
      toast.error(errorMessage);
    } else {
      // Other errors (e.g., request setup failed)
      toast.error(errorMessage);
    }

    // Return the error object or null so the calling function can handle the failure
    return null; // or throw error;
  }
}


export const UploadDataAPI = async (data, uniqueUrl) => {
  try {
    const response = await axios.post(`${UPLOAD_URL}${uniqueUrl}/`, data, {
      withCredentials: true,
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data
  } catch (error) {
    console.error("Order place Error : ",error)
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


