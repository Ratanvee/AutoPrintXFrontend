
import axios from "axios";
import toast from 'react-hot-toast'; // 👈 Import the toast function
// const API_URL = "http://127.0.0.1:8000/api/";
const API_URL = import.meta.env.VITE_BaseURL1;
const LOGOUT_URL = `${API_URL}logout/`;
const DASHBOARD_URL = `${API_URL}dashboards/`;
const RECENTORDERS = `${API_URL}recent-orders/`;
const DASHBOARD_OVERVIEW = `${API_URL}orders/`
const FETCH_CHART_DATA = `${API_URL}chart-data/?filter=`;
const FETCH_ORDERS_MANAGE = `${API_URL}filter-orders/`;

axios.defaults.withCredentials = true;


export const get_dashboard = async () => {
  try {
    const response = await axios.get(DASHBOARD_URL, {
      withCredentials: true  // Ensure cookies are sent
    });
    console.log('Dashboard Data:', response.data);
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