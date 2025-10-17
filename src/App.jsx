
// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import LandingPage from './pages/LandingPage';
// import MainSignInUpPage from './pages/MainSignInUpPage';
// import { useLocation } from "react-router-dom";
// import { useEffect } from "react";
// // import SignInPage from "./SignInPage";
// // import SignUpPage from "./SignUpPage";
// import SignInForm from "./pages/SignInPage";
// import SignUpForm from "./pages/SignUpPage";

// const BodyClassController = () => {
//   const location = useLocation();

//   useEffect(() => {
//     // Clean previous body classes
//     document.body.className = "";

//     // Add class based on current path
//     if (location.pathname === "/") {
//       document.body.classList.add("landing-body");
//     } else if (location.pathname === "/login") {
//       document.body.classList.add("login-body");
//     }
//     // Add more conditions as needed
//   }, [location]);

//   return null; // This component renders nothing
// };


// function App() {
//   return (
//     <Router>
//       <BodyClassController />
//       <Routes>
//         <Route path="/" element={<LandingPage />} />
//         <Route path="/login" element={<MainSignInUpPage />} />
//         {/* <Route path="/login" element={<SignInForm />} />
//         <Route path="/signup" element={<SignUpForm />} /> */}
//       </Routes>
//     </Router>
//   );
// }


// export default App;



// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import LandingPage from './pages/LandingPage';
// import MainSignInUpPage from './pages/MainSignInUpPage';
// import DashboardLayout from './pages/DashboardLayout';
// import DashboardHome from './pages/DashboardHome';
// import Orders from './pages/Orders';
// import Customers from './pages/Customers';
// import ProtectedRoute from './components/ProtectedRoute';
// import { AuthProvider } from './context/AuthContext';
// import { useLocation } from "react-router-dom";
// import { useEffect } from "react";





// const BodyClassController = () => {
//   const location = useLocation();

//   useEffect(() => {
//     document.body.className = "";

//     if (location.pathname === "/") {
//       document.body.classList.add("landing-body");
//     } else if (location.pathname.startsWith("/login")) {
//       document.body.classList.add("login-body");
//     } else if (location.pathname.startsWith("/dashboard")) {
//       document.body.classList.add("dashboard-body");
//     }
//   }, [location]);

//   return null;
// };

// function App() {
//   return (
//     <AuthProvider>
//       <Router>
//         <BodyClassController />
//         <Routes>
//           {/* Public Pages */}
//           <Route path="/" element={<LandingPage />} />
//           <Route path="/login" element={<MainSignInUpPage />} />

//           {/* Protected Dashboard Routes */}
//           <Route
//             path="/dashboard/*"
//             element={
//               <ProtectedRoute>
//                 <DashboardLayout />
//               </ProtectedRoute>
//             }
//           >
//             <Route path="home" element={<DashboardHome />} />
//             <Route path="orders" element={<Orders />} />
//             <Route path="customers" element={<Customers />} />
//             {/* Add other nested routes */}
//           </Route>
//         </Routes>
//       </Router>
//     </AuthProvider>
//   );
// }

// export default App;



import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import MainSignInUpPage from "./pages/MainSignInUpPage";
import DashboardLayout from "./pages/DashboardLayout";
import { AuthProvider } from "./contexts/useAuth";
import PrivateRoute from "./components/private_route";
import PrintOrderForm from "./pages/UploadPage";
import { Toaster } from 'react-hot-toast';
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
      <AuthProvider>


        <BodyClassController />
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

    </Router>
  );
}

export default App;
