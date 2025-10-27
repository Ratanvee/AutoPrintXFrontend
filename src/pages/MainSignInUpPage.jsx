// import React, { useState } from "react";
// import "../styles/SignInUp.css";
// import SignInForm from "../pages/SignInPage";
// import SignUpForm from "../pages/SignUpPage";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { Routes, Route } from "react-router-dom"

// const MainSignInUpPage = () => {
//   const [type, setType] = useState("signIn");
//   const handleOnClick = text => {
//     if (text !== type) {
//       setType(text);
//       return;
//     }
//   };
//   const containerClass =
//     "snin-container " + (type === "signUp" ? "right-panel-active" : "");
//   return (
//     <div className="App">
//       {/* <h2 className="snin-h2" >Sign in/up Form</h2> */}
//       <div className={containerClass} id="container">
//         <Routes>
//           <Route path="/register" element={<SignUpForm />} />
//           <Route path="/login" element={<SignInForm />} />
//         </Routes>
//         {/* <SignUpForm />
//         <SignInForm /> */}
//         <div className="overlay-container">
//           <div className="overlay">
//             <div className="overlay-panel overlay-left">
//               <h1 className="snin-h1" >Welcome Back!</h1>
//               <p className="snin-p" >
//                 To keep connected with us please login with your personal info
//               </p>
//               <button
//                 className="ghost snin-button"
//                 id="signIn"
//                 onClick={() => handleOnClick("signIn")}
//               >
//                 Sign In
//               </button>
//             </div>
//             <div className="overlay-panel overlay-right">
//               <h1 className="snin-h1" >Hello, Friend!</h1>
//               <p className="snin-p" >Enter your personal details and start journey with us</p>
//               <button
//                 className="ghost snin-button"
//                 id="signUp"
//                 onClick={() => handleOnClick("signUp")}
//               >
//                 Sign Up
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };


// export default MainSignInUpPage;



import React, { useState, useEffect } from "react";
import "../styles/SignInUp.css";
import SignInForm from "../components/SingInUP/SignInPage";
import SignUpForm from "../components/SingInUP/SignUpPage";
// import StepConfirmation from "../components/UploadPage/steps/StepConfirmation";

import { Routes, Route, useLocation, useNavigate } from "react-router-dom";

const MainSignInUpPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [type, setType] = useState("signIn");

  // Sync type with URL path
  useEffect(() => {
    document.title = 'AutoPrintX | Sign In/Up';
    if (location.pathname === "/register") {
      setType("signUp");
    } else if (location.pathname === "/login") {
      setType("signIn");
    }
  }, [location.pathname]);

  const handleOnClick = (text) => {
    if (text !== type) {
      setType(text);
      navigate(text === "signIn" ? "/login" : "/register");
    }
  };

  const containerClass =
    "snin-container " + (type === "signUp" ? "right-panel-active" : "");

  return (
    <div className="App">
      <div className={containerClass} id="container">
        <Routes>
          <Route path="/login" element={<SignInForm />} />
          <Route path="/register" element={<SignUpForm />} />
        </Routes>

        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1 className="snin-h1">Welcome Back!</h1>
              <p className="snin-p">
                To keep connected with us please login with your personal info
              </p>
              <button
                className="ghost snin-button"
                id="signIn"
                onClick={() => handleOnClick("signIn")}
              >
                Sign In
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1 className="snin-h1">Hello, Friend!</h1>
              <p className="snin-p">
                Enter your personal details and start journey with us
              </p>
              <button
                className="ghost snin-button"
                id="signUp"
                onClick={() => handleOnClick("signUp")}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainSignInUpPage;