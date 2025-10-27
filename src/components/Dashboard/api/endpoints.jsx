
import axios from "axios";
// import Dashboard from "pages/DashboardLayout";
import toast from 'react-hot-toast'; // 👈 Import the toast function
// const API_URL = "http://127.0.0.1:8000/api/";
const API_URL = import.meta.env.VITE_BaseURL1;
const LOGOUT_URL = `${API_URL}logout/`;
const DASHBOARD_URL = `${API_URL}dashboards/`;
const RECENTORDERS = `${API_URL}recent-orders/`;
const DASHBOARD_OVERVIEW = `${API_URL}orders/`
const FETCH_CHART_DATA = `${API_URL}chart-data/?filter=`;
const FETCH_ORDERS_MANAGE = `${API_URL}filter-orders/`;
const recentActivityURL = `${API_URL}recent-activity/`;
const DashboardSettingsURL = `${API_URL}dashboard-settings/`;
const CHANGE_PASSWORD_URL = `${API_URL}change-password/`;
axios.defaults.withCredentials = true;


export const get_dashboard = async () => {
  try {
    const response = await axios.get(DASHBOARD_URL, {
      withCredentials: true  // Ensure cookies are sent
    });
    // console.log('Dashboard Data:', response.data);
    return response.data;
  } 
  // catch (error) {
  //   console.error('Dashboard Fetch Error:', error);
  //   return null;
  // }
  catch (error) {
    // 2. Handle Network/HTTP Errors (Server Offline, 4xx, 5xx)

    let errorMessage = "An unknown error occurred. Try again later!";

    // Check if the error is due to the server being completely offline (Network Error)
    if (axios.isAxiosError(error) && !error.response) {
      errorMessage = "🔴 Connection Failed: The server is offline or unreachable.";
      // If offline, use a persistent toast
      toast.error(errorMessage, {
        duration: 10000, // Keeps the toast visible
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
    // console.error("Logout Error:", error);
    return false;
  }
};


export const recentOrders = async () => {
  try {
    const response = await axios.get(RECENTORDERS, {
      withCredentials: true, // Ensure cookies are sent
    });
    return response.data; 
  } catch (error) {
    console.error("Recent Orders Fetch Error:", error);

    return null;
  }
}

export const dashboardOverview = async () => {
  try {
    const response = await axios.get(DASHBOARD_OVERVIEW, {
      withCredentials: true, // Ensure cookies are sent
    });
    return response.data;
  } catch (error) {
    console.error("Dashboard Overview Fetch Error:", error);
    return null;
  }
}

export const fetchChartDataAPI = async (filterType) => {
  try {
    const res = await axios.get(`${FETCH_CHART_DATA}${filterType}`, {
      withCredentials: true, // Ensure cookies are sent
    });
    return res.data;
  } catch (error) {
    console.error("Chart Data Fetch Error:", error);
    return null;
  }
};

export const fetchOrdersAPI = async (search, status, from, to, page, per_page) => {
  try {
    const response = await axios.get(FETCH_ORDERS_MANAGE, {
      params: {
        search,
        status,
        from,
        to,
        page,
        per_page
      },
      withCredentials: true, // Ensure cookies are sent
    });
    return response.data;
  }
  catch (error) {
    console.error("Orders Fetch Error:", error);
    return null;
  }
}

// api/endpoints.js
export const recentActivity = async (limit = 4) => {
  try {
    const response = await axios.get(`${recentActivityURL}?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    throw error;
  }
};




export const DashboardSettings = async () => {
  try {
    const response = await axios.get(DashboardSettingsURL, { withCredentials: true });

    console.log("Dashbaoared settings data : ", response);

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
        duration: 10000, // Keeps the toast visible
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


// export const UpdateDashboardSettings = async (section, data) => {
//   try {
//     const response = await axios.post(DashboardSettingsURL, { section, data }, {
//       withCredentials: true,
//       headers: { 'Content-Type': 'multipart/form-data' },
//     });
//     console.log("Dashboard settings updated successfully:", response);
//     return response.data
//   } catch (error) {
//     console.error("Dashboard settings update Error : ",error)
//     return false;
//   }
// };


// export const UpdateDashboardSettings = async (section, data) => {
//   try {
//     const response = await axios.post(DashboardSettingsURL,
//       // 1. Axios sends this object as JSON by default
//       {
//         section,
//         data
//       },
//       {
//         withCredentials: true,
//         // 2. We remove the custom 'multipart/form-data' header
//       }
//     );
//     console.log("Dashboard settings updated successfully:", response);
//     toast.success(response.data.message, { duration: 5000 });

//     return response.data
//   } catch (error) {
//     let errorMessage = "An unknown error occurred. Try again later!";
//     toast.error(errorMessage, {
//       duration: Infinity, // Keeps the toast visible
//       position: 'top-center'
//     });
//     console.error("Dashboard settings update Error : ", error)
//     return false;
//   }
// };

export const UpdateDashboardSettings = async (section, data) => {
  try {
    let response;

    // Check if this is a profile update with a file
    if (section === 'profile' && data.avatar instanceof File) {
      // Use FormData for file upload
      const formData = new FormData();
      formData.append('section', section);

      // Create a copy of data without the avatar file
      const dataWithoutFile = { ...data };
      delete dataWithoutFile.avatar;

      // Append the data object as a JSON string
      formData.append('data', JSON.stringify(dataWithoutFile));

      // Append the avatar file
      formData.append('avatar', data.avatar);

      response = await axios.post(DashboardSettingsURL, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } else {
      // For all other sections or profile without file, use JSON
      const cleanData = { ...data };

      // Remove avatar field if it exists and is not a File (e.g., it's a URL string)
      if (section === 'profile' && cleanData.avatar && !(cleanData.avatar instanceof File)) {
        delete cleanData.avatar;
      }

      response = await axios.post(
        DashboardSettingsURL,
        {
          section,
          data: cleanData,
        },
        {
          withCredentials: true,
        }
      );
    }

    console.log("Dashboard settings updated successfully:", response);
    toast.success(response.data.message, { duration: 5000 });

    return response.data;
  } catch (error) {
    let errorMessage = "An unknown error occurred. Try again later!";

    if (error.response?.data?.error) {
      errorMessage = error.response.data.error;
    } else if (error.message) {
      errorMessage = error.message;
    }

    toast.error(errorMessage, {
      duration: 10000,
      position: 'top-center',
    });

    console.error("Dashboard settings update Error:", error);
    return false;
  }
};



export const ChangePasswordAPI = async (data) => {
  try {
    const response = await axios.post(CHANGE_PASSWORD_URL, data, {
      withCredentials: true,
    });
    console.log("Password changed successfully:", response);
    toast.success(response.data.message, { duration: 5000 });

    return response.data;
  } catch (error) {
    let errorMessage = "An unknown error occurred. Try again later!";

    if (error.response?.data?.error) {
      errorMessage = error.response.data.error;
    } else if (error.message) {
      errorMessage = error.message;
    }

    toast.error(errorMessage, {
      duration: 10000,
      position: 'top-center',
    });

    console.error("Change password Error:", error);
    return false;
  }
};