


import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF, faGoogle } from "@fortawesome/free-brands-svg-icons";
import axios from "axios";

function SignUpForm() {
  const [state, setState] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (evt) => {
    setState({ ...state, [evt.target.name]: evt.target.value });
  };

  // const handleOnSubmit = async (evt) => {
  //   evt.preventDefault();
  //   setLoading(true);

  //   try {
  //     const response = await axios.post("http://127.0.0.1:8000/api/register/", {
  //       username: state.name,
  //       email: state.email,
  //       password: state.password
  //     });

  //     alert("Registration successful! Please sign in.");
  //     setState({ name: "", email: "", password: "" });
  //   } catch (error) {
  //     if (error.response && error.response.data) {
  //       alert("Error: " + JSON.stringify(error.response.data));
  //     } else {
  //       alert("Something went wrong!");
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleOnSubmit = async (evt) => {
    evt.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/register/",
        {
          username: state.name,
          email: state.email,
          password: state.password,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true, // ✅ ensures cookie handling works
        }
      );

      if (response.data.success) {
        alert("Registration successful! Please sign in.");
        setState({ name: "", email: "", password: "" });
      } else {
        alert("Error: " + JSON.stringify(response.data.errors));
      }
    } catch (error) {
      console.error("Registration error:", error);

      if (error.response) {
        alert("Server Error: " + JSON.stringify(error.response.data));
      } else if (error.request) {
        alert("No response from server. Make sure backend is running!");
      } else {
        alert("Error: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="form-container sign-up-container ">
      <form className="snin-form" onSubmit={handleOnSubmit}>
        <h1 className="snin-h1">Create Account</h1>

        <div className="social-container">
          <a href="#" className="social snin-a">
            <FontAwesomeIcon icon={faGoogle} />
          </a>
          <a href="#" className="social snin-a">
            <FontAwesomeIcon icon={faFacebookF} />
          </a>
        </div>

        <span className="snin-span">or use your email for registration</span>

        <input
          className="snin-input"
          type="text"
          name="name"
          value={state.name}
          onChange={handleChange}
          placeholder="Name"
          required
        />
        <input
          className="snin-input"
          type="email"
          name="email"
          value={state.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <input
          className="snin-input"
          type="password"
          name="password"
          value={state.password}
          onChange={handleChange}
          placeholder="Password"
          required
        />

        <button className="snin-button" type="submit" disabled={loading}>
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
}

export default SignUpForm;
