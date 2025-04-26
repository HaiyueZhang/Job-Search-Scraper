// src/components/LoginPage/LoginPage.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "./LoginPage.css";
import GoogleLogo from "../../assets/images/Google.png";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  // const USER_SERVICE_API_URL = process.env.REACT_APP_USER_SERVICE_API_URL;
  const googleAuthUrl =
    "https://accounts.google.com/o/oauth2/v2/auth?" +
    "client_id=579917709023-s8s4km4gc1seif59t4qbav0ijk4v8mi9.apps.googleusercontent.com" +
    "&redirect_uri=http://localhost:3000/loading" + // Updated redirect URI
    "&response_type=code" +
    "&scope=https://www.googleapis.com/auth/userinfo.email%20https://www.googleapis.com/auth/userinfo.profile%20openid" +
    "&access_type=offline";

  const handleGoogleLogin = () => {
    window.location.href = googleAuthUrl; // Redirect to the Google OAuth URL
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Trim the email for any leading or trailing whitespace
    const trimmedEmail = email.trim();

    // Check if the email starts with 'admin'
    if (!trimmedEmail.startsWith("admin")) {
      // If it doesn't start with 'admin', then check the pattern
      if (!emailPattern.test(trimmedEmail)) {
        toast.error("Please enter a valid email address.");
        return;
      }
    } else {
      console.log("Email starts with 'admin', skipping pattern check.");
    }

    if (!email || !password) {
      toast.error("Please enter your account information.");
      return;
    }

    // Prepare the data to be sent
    const loginData = {
      email: email.trim(),
      password: password,
    };

    try {
      // Send POST request to the backend login API
      const response = await fetch("/userapi/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      // Check if the request was successful
      if (response.ok) {
        const user = await response.json();
        console.log("Login Successful:", user);

        // Set the login flag in localStorage
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("email", user.user.email);
        localStorage.setItem("token", user.token);

        // Show success notification
        toast.success("Login successful!");

        // Redirect to the dashboard page or another protected page
        setTimeout(() => {
          navigate("/job-services"); // Adjust this path as needed
        }, 2000); // Delay to let the success toast show
      } else {
        const errorText = await response.text(); // Retrieve error text from response
        if (errorText === "User or Password Incorrect") {
          toast.error("User or Password Incorrect");
        } else {
          toast.error(`Error: ${errorText || "Failed to login"}`);
        }
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        "An error occurred while logging in. Please try again later."
      );
    }
  };

  return (
    <div className="login-page">
      <nav className="navbar">
        <div className="logo">
          <Link to="/">Job Search</Link>
        </div>
        <div className="login-icon">
          <Link to="/login">Login</Link>
        </div>
      </nav>
      <div className="login-container">
        <h2 className="Head">Login</h2>
        <p className="Subhead">Welcome back! Please login to your account.</p>
        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="account" className="Prompt">
            Email
          </label>
          <input
            type="text"
            id="account"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="inputField"
          />

          <label htmlFor="password" className="Prompt">
            Password
          </label>
          <input
            type="password"
            id="passcode"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="inputField"
          />

          <button type="submit">Login</button>
        </form>
        <div className="signup-section">
          <p>
            Don't have an account?{" "}
            <Link to="/signupchoice" className="signup-link">
              Sign Up
            </Link>
          </p>
        </div>

        <div className="divider">
          <span>OR</span>
        </div>

        <div className="google-login">
          <button className="google-button" onClick={handleGoogleLogin}>
            <img src={GoogleLogo} alt="Google Logo" className="google-logo" />
            Continue with Google
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default LoginPage;
