import axios from "axios";
import toast from 'react-hot-toast';

// ============================================
// CONFIGURATION
// ============================================

const API_URL = import.meta.env.VITE_BaseURL1;
axios.defaults.withCredentials = true;

// API Endpoints
const ENDPOINTS = {
  LOGOUT: `${API_URL}logout/`,
  DASHBOARD: `${API_URL}dashboards/`,
  RECENT_ORDERS: `${API_URL}recent-orders/`,
  DASHBOARD_OVERVIEW: `${API_URL}orders/`,
  CHART_DATA: `${API_URL}chart-data/`,
  ORDERS_MANAGE: `${API_URL}filter-orders/`,
  RECENT_ACTIVITY: `${API_URL}recent-activity/`,
  DASHBOARD_SETTINGS: `${API_URL}dashboard-settings/`,
  CHANGE_PASSWORD: `${API_URL}change-password/`,
};

// ============================================
// REQUEST MANAGEMENT
// ============================================

// Store active requests for cancellation
const activeRequests = new Map();

/**
 * Cancel a specific request by key
 */
export const cancelRequest = (key) => {
  const controller = activeRequests.get(key);
  if (controller) {
    controller.abort();
    activeRequests.delete(key);
  }
};

/**
 * Cancel all active requests
 */
export const cancelAllRequests = () => {
  activeRequests.forEach((controller) => controller.abort());
  activeRequests.clear();
};

/**
 * Create a new axios instance with abort controller
 */
const createRequest = (key) => {
  // Cancel previous request with same key
  cancelRequest(key);

  // Create new abort controller
  const controller = new AbortController();
  activeRequests.set(key, controller);

  return controller;
};

// ============================================
// ERROR HANDLING
// ============================================

/**
 * Centralized error handler
 */
const handleError = (error, options = {}) => {
  const { silent = false, persistent = false } = options;

  // Don't show error if request was cancelled
  if (axios.isCancel(error)) {
    console.log('Request cancelled:', error.message);
    return null;
  }

  let errorMessage = "An unknown error occurred. Try again later!";
  let toastOptions = { duration: 5000, position: 'top-center' };

  if (persistent) {
    toastOptions.duration = 10000;
  }

  // Network error (server offline)
  if (axios.isAxiosError(error) && !error.response) {
    errorMessage = "🔴 Connection Failed: Server is offline or unreachable.";
    if (!silent) {
      toast.error(errorMessage, { ...toastOptions, duration: 10000 });
    }
  }
  // HTTP error with response
  else if (error.response) {
    const status = error.response.status;
    const detail = error.response.data?.detail || error.response.data?.error || 'Server error';
    errorMessage = `Request failed: HTTP ${status} - ${detail}`;

    if (!silent) {
      toast.error(errorMessage, toastOptions);
    }
  }
  // Other errors
  else {
    if (!silent) {
      toast.error(errorMessage, toastOptions);
    }
  }

  console.error('API Error:', error);
  return null;
};

// ============================================
// SMART POLLING UTILITIES
// ============================================

class SmartPoller {
  constructor(fetchFunction, options = {}) {
    this.fetchFunction = fetchFunction;
    this.interval = options.interval || 6000; // Default 3 seconds
    this.maxInterval = options.maxInterval || 30000; // Max 30 seconds
    this.minInterval = options.minInterval || 6000; // Min 3 seconds
    this.noChangeThreshold = options.noChangeThreshold || 5; // Slow down after 5 no-changes

    this.currentInterval = this.interval;
    this.noChangeCount = 0;
    this.timeoutId = null;
    this.lastData = null;
    this.isActive = false;
    this.isPaused = false;
  }

  /**
   * Check if data has changed
   */
  hasDataChanged(newData) {
    if (!this.lastData) return true;

    // Simple JSON comparison (you can customize this)
    return JSON.stringify(newData) !== JSON.stringify(this.lastData);
  }

  /**
   * Adjust polling interval based on activity
   */
  adjustInterval() {
    if (this.noChangeCount >= this.noChangeThreshold) {
      // Gradually increase interval
      this.currentInterval = Math.min(
        this.currentInterval * 1.5,
        this.maxInterval
      );
    } else {
      // Reset to minimum interval
      this.currentInterval = this.minInterval;
    }
  }

  /**
   * Start polling
   */
  start(callback) {
    this.isActive = true;
    this.poll(callback);
  }

  /**
   * Pause polling (useful when tab is inactive)
   */
  pause() {
    this.isPaused = true;
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  /**
   * Resume polling
   */
  resume(callback) {
    if (this.isPaused && this.isActive) {
      this.isPaused = false;
      this.poll(callback);
    }
  }

  /**
   * Stop polling
   */
  stop() {
    this.isActive = false;
    this.isPaused = false;
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  /**
   * Execute polling cycle
   */
  async poll(callback) {
    if (!this.isActive || this.isPaused) return;

    try {
      const data = await this.fetchFunction();

      if (data) {
        const hasChanged = this.hasDataChanged(data);

        if (hasChanged) {
          this.noChangeCount = 0;
          this.lastData = data;
          callback(data, true); // true = data changed
        } else {
          this.noChangeCount++;
          callback(data, false); // false = no change
        }

        this.adjustInterval();
      }
    } catch (error) {
      console.error('Polling error:', error);
    }

    // Schedule next poll
    if (this.isActive) {
      this.timeoutId = setTimeout(() => this.poll(callback), this.currentInterval);
    }
  }
}

// ============================================
// API FUNCTIONS
// ============================================

/**
 * Get dashboard data with smart polling support
 */
export const get_dashboard = async () => {
  try {
    const controller = createRequest('dashboard');
    const response = await axios.get(ENDPOINTS.DASHBOARD, {
      signal: controller.signal,
    });

    activeRequests.delete('dashboard');
    return response.data;
  } catch (error) {
    return handleError(error, { silent: axios.isCancel(error) });
  }
};

/**
 * Create smart poller for dashboard
 */
export const createDashboardPoller = (options) => {
  return new SmartPoller(get_dashboard, options);
};

/**
 * Logout user
 */
export const logout = async () => {
  try {
    await axios.post(ENDPOINTS.LOGOUT, {});
    cancelAllRequests(); // Cancel all pending requests
    return true;
  } catch (error) {
    handleError(error);
    return false;
  }
};

/**
 * Get recent orders
 */
export const recentOrders = async () => {
  try {
    const controller = createRequest('recentOrders');
    const response = await axios.get(ENDPOINTS.RECENT_ORDERS,
      {
        signal: controller.signal,
      }
    );

    activeRequests.delete('recentOrders');
    return response.data;
  } catch (error) {
    return handleError(error, { silent: axios.isCancel(error) });
  }
};

/**
 * Get dashboard overview
 */
export const dashboardOverview = async () => {
  try {
    const controller = createRequest('dashboardOverview');
    const response = await axios.get(ENDPOINTS.DASHBOARD_OVERVIEW, {
      signal: controller.signal,
    });

    activeRequests.delete('dashboardOverview');
    return response.data;
  } catch (error) {
    return handleError(error, { silent: axios.isCancel(error) });
  }
};

/**
 * Fetch chart data with caching
 */
const chartDataCache = new Map();
const CACHE_DURATION = 60000; // 1 minute

export const fetchChartDataAPI = async (filterType) => {
  const cacheKey = `chart_${filterType}`;
  const cached = chartDataCache.get(cacheKey);

  // Return cached data if still valid
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  try {
    const controller = createRequest(cacheKey);
    const response = await axios.get(`${ENDPOINTS.CHART_DATA}?filter=${filterType}`, {
      signal: controller.signal,
    });

    // Cache the response
    chartDataCache.set(cacheKey, {
      data: response.data,
      timestamp: Date.now(),
    });

    activeRequests.delete(cacheKey);
    return response.data;
  } catch (error) {
    return handleError(error, { silent: axios.isCancel(error) });
  }
};

/**
 * Fetch orders with filters
 */
export const fetchOrdersAPI = async (search, status, from, to, page, per_page) => {
  try {
    const controller = createRequest('fetchOrders');
    const response = await axios.get(ENDPOINTS.ORDERS_MANAGE, {
      params: { search, status, from, to, page, per_page },
      signal: controller.signal,
    });

    activeRequests.delete('fetchOrders');
    return response.data;
  } catch (error) {
    return handleError(error, { silent: axios.isCancel(error) });
  }
};

/**
 * Get recent activity
 */
export const recentActivity = async (limit = 1000) => {
  try {
    const controller = createRequest('recentActivity');
    const response = await axios.get(`${ENDPOINTS.RECENT_ACTIVITY}?limit=${limit}`, {
      signal: controller.signal,
    });

    activeRequests.delete('recentActivity');
    return response.data;
  } catch (error) {
    return handleError(error, { silent: axios.isCancel(error) });
  }
};

/**
 * Get dashboard settings
 */

const DASHBOARD_SETTINGS_URL = `${API_URL}dashboard-settings/`;

// axios.defaults.withCredentials = true;

/**
 * Fetch dashboard settings
 * Returns user settings in structured format
 */
export const DashboardSettings = async () => {
  try {
    const response = await axios.get(DASHBOARD_SETTINGS_URL, {
      withCredentials: true
    });

    // Check for application-level errors
    if (response.data.error) {
      toast.error(response.data.error);
      return null;
    }


    return response.data;

  } catch (error) {
    let errorMessage = "Failed to load settings. Try again later!";

    // Network error (server offline)
    if (axios.isAxiosError(error) && !error.response) {
      errorMessage = "🔴 Connection Failed: The server is offline or unreachable.";
      toast.error(errorMessage, {
        duration: 10000,
        position: 'top-center'
      });
    }
    // HTTP error
    else if (error.response) {
      const status = error.response.status;
      errorMessage = `Request failed: HTTP ${status} - ${error.response.data.detail || error.response.data.error || 'Server error'}`;
      toast.error(errorMessage);
    }
    // Other errors
    else {
      toast.error(errorMessage);
    }

    console.error("Dashboard settings fetch error:", error);
    return null;
  }
};

/**
 * Update dashboard settings
 */
export const UpdateDashboardSettings = async (section, data) => {
  try {
    let response;

    // Handle file upload
    if (section === 'profile' && data.avatar instanceof File) {
      const formData = new FormData();
      formData.append('section', section);

      const dataWithoutFile = { ...data };
      delete dataWithoutFile.avatar;

      formData.append('data', JSON.stringify(dataWithoutFile));
      formData.append('avatar', data.avatar);

      response = await axios.post(ENDPOINTS.DASHBOARD_SETTINGS, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    } else {
      const cleanData = { ...data };

      if (section === 'profile' && cleanData.avatar && !(cleanData.avatar instanceof File)) {
        delete cleanData.avatar;
      }

      response = await axios.post(ENDPOINTS.DASHBOARD_SETTINGS, {
        section,
        data: cleanData,
      });
    }

    toast.success(response.data.message || 'Settings updated successfully!', {
      duration: 5000,
    });

    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.error || error.message || 'Update failed';
    toast.error(errorMessage, { duration: 10000, position: 'top-center' });
    return false;
  }
};

/**
 * Change password
 */
export const ChangePasswordAPI = async (data) => {
  try {
    const response = await axios.post(ENDPOINTS.CHANGE_PASSWORD, data);

    toast.success(response.data.message || 'Password changed successfully!', {
      duration: 5000,
    });

    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.error || error.message || 'Password change failed';
    toast.error(errorMessage, { duration: 10000, position: 'top-center' });
    return false;
  }
};

// ============================================
// PAGE VISIBILITY HANDLING
// ============================================

/**
 * Setup page visibility listener for smart polling
 */
export const setupVisibilityListener = (poller) => {
  const handleVisibilityChange = () => {
    if (document.hidden) {
      poller.pause();
    } else {
      poller.resume((data) => {
        // Callback will be provided by the component
      });
    }
  };

  document.addEventListener('visibilitychange', handleVisibilityChange);

  // Return cleanup function
  return () => {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  };
};

// ============================================
// CLEANUP
// ============================================

/**
 * Call this when unmounting components
 */
export const cleanup = () => {
  cancelAllRequests();
  chartDataCache.clear();
};