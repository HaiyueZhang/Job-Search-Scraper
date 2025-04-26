/* src/components/CreateAccount/CreateAccount.js */
import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "./CreateAccount.css";
import { Link, useNavigate } from "react-router-dom";

const CreateAccount = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gender, setGender] = useState(""); // New state for gender
  const navigate = useNavigate();
  // const USER_SERVICE_API_URL = process.env.REACT_APP_USER_SERVICE_API_URL; // Get API URL from .env

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate first and last names
    if (!firstName.trim() || !lastName.trim()) {
      toast.error("Please enter both your first and last names.");
      return;
    }

    // Validate gender
    if (!gender) {
      toast.error("Please enter your gender.");
      return;
    }

    // Validate email format using a regular expression
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email.trim())) {
      toast.error("Please enter a valid email address.");
      return;
    }

    // Validate password match
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    // Prepare the data to be sent
    const requestData = {
      email: email.trim(),
      password: password,
      firstname: firstName.trim(),
      lastname: lastName.trim(),
      gender: gender,
    };
    try {

      // Retrieve the pendingUser data from localStorage
      const signUpType = localStorage.getItem("SignUpType");

      const url = new URL(`/userapi/saveUser`, window.location.origin);
      url.searchParams.append('userType', signUpType);  // Append signUpType as a query parameter
      
      // Send the verified user's data to save it in the backend
      const saveUserResponse = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData), // Send the pending user data
      });

      if (saveUserResponse.ok) {
        toast.success("Account successfully created and verified!");

        // Redirect to the homepage or another page, e.g., dashboard
        setTimeout(() => {
          navigate("/job-services");
        }, 1500);
      } else {
        const saveUserError = await saveUserResponse.text();
        toast.error(`Failed to save user data: ${saveUserError}`);
      }

    } catch (error) {
      console.error("Error:", error);
      toast.error(
        "An error occurred while creating the account. Please try again later."
      );
    }
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
          <div className="name-section">
            <div className="name-field">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter your first name"
              />
            </div>
            <div className="name-field">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter your last name"
              />
            </div>
          </div>
          <div className="gender-section">
            <label htmlFor="gender">Gender</label>
            <select
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">Select your gender</option>
              <option value="MALE">MALE</option>
              <option value="FEMALE">FEMALE</option>
              <option value="OTHER">OTHER</option>
            </select>
          </div>

          <label htmlFor="email">Email</label>
          <input
            type="text"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Choose an email"
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a password"
          />

          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
          />

          <button type="submit">Create Account</button>
        </form>
        <div className="login-section">
          <p>Already have an account?</p>
          <Link to="/login">
            <button>Login</button>
          </Link>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default CreateAccount;
