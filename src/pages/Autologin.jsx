import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";


const useweblogintokenAPI = `${import.meta.env.VITE_BaseURL1}use-web-login-token/`;
function Autologin() {
    const navigate = useNavigate();

    useEffect(() => {
        console.log("🔥 Autologin page loaded");
        console.log("URL =", window.location.href);
        // console.log("Token param =", tokenParam);

    }, []);



    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const tokenParam = urlParams.get("token");

        if (!tokenParam) {
            alert("Token missing.");
            navigate("/login");
            return;
        }

        // STEP 1 — Validate token with backend
        fetch(`${useweblogintokenAPI}?token=${tokenParam}`)
            .then((res) => res.json())
            .then((data) => {
                if (!data.success) {
                    alert("Invalid or expired token.");
                    navigate("/login");
                    return;
                }

                // STEP 2 — Save new access token
                localStorage.setItem("token", data.access);

                // STEP 3 — Redirect to Dashboard
                navigate("/dashboard");
            })
            .catch(() => {
                alert("Network error.");
                navigate("/login");
            });
    }, []);

    return <p>Redirecting… please wait.</p>;
}

export default Autologin;
