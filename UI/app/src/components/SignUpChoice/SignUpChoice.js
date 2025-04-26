/* src/components/SignUpChoice/SignUpChoice.js */
import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "./SignUpChoice.css";
import { Link, useNavigate } from "react-router-dom";
import GoogleLogo from "../../assets/images/Google.png";

const SignUpChoice = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  // const USER_SERVICE_API_URL = process.env.REACT_APP_USER_SERVICE_API_URL; // Get API URL from .env

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate email format using a regular expression
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email.trim())) {
      toast.error("Please enter a valid email address.");
      return;
    }

    // Prepare the data to be sent
    const requestData = {
      email: email.trim(),
    };
    try {
      const url = new URL("/verifyapi/register", window.location.origin);
      url.searchParams.append("email", email.trim());
      // Send POST request to backend API
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Check if the request was successful
      if (response.ok) {
        const result = await response.text();
        console.log("Connected to the verifyapi/register api:", result);

        // Store requestData in localStorage for use after verification
        localStorage.setItem("pendingUser", JSON.stringify(requestData));
        localStorage.setItem("allowEmailVerificationAccess", "true");
        localStorage.setItem("SignUpType", "BUGGYSOFT");

        // Show success notification
        toast.success(
          "Registration successful! Please complete email verification."
        );

        // Redirect to the email verification page
        setTimeout(() => {
          navigate("/email-verification");
        }, 2000); // Delay to let the success toast show
      } else {
        const errorText = await response.text(); // Retrieve error text from response
        if (errorText === "User Already Exists!") {
          toast.error("User Already Exists!");
        } else {
          toast.error(`Error: ${errorText || "Failed to create account"}`);
        }
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        "An error occurred while creating the account. Please try again later."
      );
    }
  };

  const googleAuthUrl =
    "https://accounts.google.com/o/oauth2/v2/auth?" +
    "client_id=579917709023-s8s4km4gc1seif59t4qbav0ijk4v8mi9.apps.googleusercontent.com" +
    "&redirect_uri=http://localhost:3000/loading" +
    "&response_type=code" +
    "&scope=https://www.googleapis.com/auth/userinfo.email%20https://www.googleapis.com/auth/userinfo.profile%20openid" +
    "&access_type=offline";
  const handleGoogleLogin = () => {
    localStorage.setItem("SignUpType", "GOOGLE");
    window.location.href = googleAuthUrl; // Redirect to the Google OAuth URL
  };

  return (
    <div className="create-account-page">
      <nav className="navbar">
        <div className="logo">
          <Link to="/">Job Search</Link>
        </div>
        <div className="login-icon">
          <Link to="/login">Login</Link>
        </div>
      </nav>
      <div className="create-account-container">
        <h2>Create Account</h2>
        <form className="account-form" onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            type="text"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Choose an email"
          />

          <button type="submit">Create Account</button>
        </form>
        <div className="login-section">
          <div className="login-prompt">
            <p>Already have an account?</p>
            <Link to="/login" className="login-link">
              Login
            </Link>
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
      </div>
      <ToastContainer />
    </div>
  );
};

export default SignUpChoice;
