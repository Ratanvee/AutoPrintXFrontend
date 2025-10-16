// import axios from "axios";

// const API_URL = "http://127.0.0.1:8000/api/";
// const LOGIN_URL = `${API_URL}token/`;
// const REFRESH_URL = `${API_URL}token/refresh/`;
// const NOTES_URL = `${API_URL}notes/`;
// const LOGOUT_URL = `${API_URL}logout/`;
// const AUTH_URL = `${API_URL}auth/`;

// export const login = async (username, password) => {
//     const response = await axios.post(LOGIN_URL,
//         { username: username, password: password },
//         { withCredentials: true }

//     )
//     return response.data.success
// }

// export const refreshToken = () => {
//     try {
//         const response = axios.post(REFRESH_URL,
//             {},
//             { withCredentials: true }
//         )
//         return true
//     } catch (error) {
//         return false
//     }
// }


// export const get_notes = async () => {
//     try {
//         const response = await axios.get(NOTES_URL,
//             { withCredentials: true }
//         )
//         return response.data

//     } catch (error) {
//         return call_refresh(error, axios.get(NOTES_URL, { withCredentials: true }))
//     }
// }

// const call_refresh = async (error, func) => {
//     if (error.response && error.response.status === 401) {
//         const refresh_response = await refreshToken();
//         if (refresh_response) {
//             const retry_response = await func();
//             return retry_response.data
//         }
//     }
// }


// export const logout = async () => {
//     try {
//         await axios.post(LOGOUT_URL,
//             {},
//             { withCredentials: true }
//         )
//         return true
//     } catch (error) {
//         return false
//     }
// }


// export const is_authenticated = async () => {
//     try {
//         await axios.post(AUTH_URL,
//             {},
//             { withCredentials: true }
//         )
//         return true 
//     } catch (error) {
//         return false
//     }

// }


import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/";
// const API_URL = "http://localhost:8000/api/";
const LOGIN_URL = `${API_URL}token/`;
const REFRESH_URL = `${API_URL}token/refresh/`;
const NOTES_URL = `${API_URL}notes/`;
const LOGOUT_URL = `${API_URL}logout/`;
const AUTH_URL = `${API_URL}auth/`;
const DASHBOARD_URL = `${API_URL}dashboards/`;
// const UPLOAD_URL = "http://localhost:8000/api/uploadss/";
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
      return true;
    } else {
      // console.error('Login failed:', response.data.error);
      // setErrorMessage('Incorrect username or password');
      return false;
    }

  } catch (error) {
    console.error("Login Error:", error.response?.data || error.message);
    return false;
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
    console.error("Register Error:", error);
    // alert('Somthing is wrong : ',error)
    return response.errors;
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
    const response = await axios.get(NOTES_URL);
    return response.data;
  } catch (error) {
    return call_refresh(error, () => axios.get(NOTES_URL));
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
      }
    );
    return true;
  } catch (error) {
    console.error("Logout Error:", error);
    return false;
  }
};

// export const is_authenticated = async () => {
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
    await axios.get(AUTH_URL, { withCredentials: true });
    console.log("User is authenticated.");
    return true;
  } catch (error) {
    // console.error("Auth Check Error:", error);
    return false;
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
    console.error("Order place Error : ",error)
    return false;
  }
};


export const CreateOrdersRazorpay = async (data) => {
  try {
    const response = await fetch(CREATEORDERS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: data,
    });
    return response.json();
  } catch (error) {
    console.error("Create Order Error : ", error)
    return false;
  }
};


