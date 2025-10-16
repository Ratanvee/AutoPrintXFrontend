
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/";
// const API_URL = "http://localhost:8000/api/";
const LOGIN_URL = `${API_URL}token/`;
const REFRESH_URL = `${API_URL}token/refresh/`;
const NOTES_URL = `${API_URL}notes/`;
const LOGOUT_URL = `${API_URL}logout/`;
const AUTH_URL = `${API_URL}auth/`;
const DASHBOARD_URL = `${API_URL}dashboards/`;
// const UPLOAD_URL = "http://localhost:8000/customerside/upload/";

axios.defaults.withCredentials = true;


export const get_dashboard = async () => {
  try {
    const response = await axios.get(DASHBOARD_URL, {
      withCredentials: true  // Ensure cookies are sent
    });
    console.log('Dashboard Data:', response.data);
    return response.data;
  } catch (error) {
    console.error('Dashboard Fetch Error:', error);
    return null;
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
    // console.error("Logout Error:", error);
    return false;
  }
};


export const recentOrders = async () => {
  try {
    const response = await axios.get(`${API_URL}recent-orders/`, {
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
    const response = await axios.get(`${API_URL}orders/`, {
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
    const res = await axios.get(`${API_URL}chart-data/?filter=${filterType}`, {
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
    const response = await axios.get(`${API_URL}filter-orders/`, {
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