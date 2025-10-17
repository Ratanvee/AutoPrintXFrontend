
import React, { use, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faFacebookF,
    faGoogle
} from "@fortawesome/free-brands-svg-icons";
// import axios from "axios";
import { useNavigate } from "react-router-dom";
import { login } from "../api/endpoints";
// import { AuthContext } from "../contexts/useAuth";
import { useAuth } from "../contexts/useAuth";
import toast from 'react-hot-toast'; // <--- MUST BE HERE

function SignInForm() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { login_user } = useAuth();
    const [errorMessage, setErrorMessage] = useState('');  // For showing errors
    const nav = useNavigate();
    
    
    const handleLogin = async () => {
        // const [isAuthenticated, setIsAuthenticated] = useState(false);
        const success = await login(username, password);
        if (success) {
            // Handle successful login (e.g., redirect to dashboard)
            console.log("Login successful");
            // setIsAuthenticated(true);
            nav("/dashboard");
        } else {
            // Handle login failure (e.g., show error message)
            toast.error('Incorrect username or password');
            // setErrorMessage('Incorrect username or password');
            console.log("Login failed");
        }
        // setErrorMessage('Incorrect username or password');
        // console.log(username)
        // console.log(password)
        // login_user(username, password)
    }


    return (
        <div className="form-container sign-in-container">
            <form className="snin-form">
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                <h1 className="snin-h1">Sign in</h1>

                <div className="social-container">
                    <a href="#" className="social snin-a">
                        <FontAwesomeIcon icon={faGoogle} />
                    </a>
                    <a href="#" className="social snin-a">
                        <FontAwesomeIcon icon={faFacebookF} />
                    </a>
                </div>

                <span className="snin-span">or use your account</span>
                <input
                    className="snin-input"
                    //   type="email"
                    type="text"
                    placeholder="Username or Email"
                    name="email"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    className="snin-input"
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <a className="snin-a" href="#">
                    Forgot your password?
                </a>
                <button className="snin-button" type="button" onClick={handleLogin}>
                    Sign In
                </button>
            </form>
        </div>
    );
}

export default SignInForm;


