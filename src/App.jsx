import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import MainSignInUpPage from "./pages/MainSignInUpPage";
import DashboardLayout from "./pages/DashboardLayout";
import { AuthProvider } from "./contexts/useAuth";
import PrivateRoute from "./components/private_route";
import PrintOrderForm from "./pages/UploadPage";
import { Toaster } from 'react-hot-toast';
// import PrintOrderForm from "./pages/PrintOrderForm";

// In your main.jsx or App.jsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()




/**
 * Dynamically sets a CSS class on the body element
 * based on the current route
 */
const BodyClassController = () => {
  const location = useLocation();

  useEffect(() => {
    // Reset body class
    document.body.className = "";

    if (location.pathname === "/") {
      document.body.classList.add("landing-body");
    } else if (location.pathname.startsWith("/login") || location.pathname.startsWith("/register")) {
      document.body.classList.add("login-body");
    } else if (location.pathname.startsWith("/dashboard")) {
      document.body.classList.add("dashboard-body");
    }
  }, [location]);

  return null; // Component does not render UI
};

function App() {
  return (
    <Router>


      <QueryClientProvider client={queryClient}>
        <BodyClassController />
        <AuthProvider>
          <Routes>

            {/* ✅ Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/*" element={<MainSignInUpPage />} />
            <Route path="/upload/:slug" element={<PrintOrderForm />} />


            {/* ✅ Protected Dashboard Routes */}
            <Route path="/dashboard/*" element={<PrivateRoute> <DashboardLayout /></PrivateRoute>}></Route>


            {/* <Route element={<PrivateRoute><Layout><Menu /></Layout></PrivateRoute>} path='/' /> */}
            {/* ✅ Fallback for 404 */}
            <Route path="*" element={<h2>404 - Page Not Found</h2>} />
          </Routes>
        </AuthProvider>
        <Toaster position="top-center" />

      </QueryClientProvider>
    </Router>
  );
}

export default App;
