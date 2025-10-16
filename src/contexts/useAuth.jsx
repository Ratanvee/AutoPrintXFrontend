import React, { createContext, useContext, useEffect, useState } from "react";
import { is_authenticated } from "../api/endpoints";
import { login } from "../api/endpoints";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();
// const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [Loading, setLoading] = useState(true);
  const nav = useNavigate();

  const get_authenticated = async () => {
    try {
      const success = await is_authenticated();
      setIsAuthenticated(success);
    } catch (error) {
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }


  const login_user = async (username, password) => {
    console.log("Logging in user...")

    const success = await login(username, password);
    // if (success){
    //   console.log("Login successful");
    // }
    if (success) {
      setIsAuthenticated(true);
      nav("/dashboard");
    }
    // else {
    //   // setIsAuthenticated(false);
    //   setErrorMessage('Incorrect username or password');
    //   // nav("/login");
    // }

  }

  useEffect(() => {
    get_authenticated();
  }, [window.location.pathname]);




  return (
    <AuthContext.Provider value={{ isAuthenticated, Loading, login_user }}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => useContext(AuthContext);