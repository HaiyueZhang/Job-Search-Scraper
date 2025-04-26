import React from "react";
import { Link } from "react-router-dom";
import "./LandingPage.css";
import JobImage from "../../assets/images/1140-new-job-keyboard.jpg";

const LandingPage = () => {
  return (
    <div className="landing-page">
      <nav className="navbar">
        <div className="logo">
          <Link to="/">Job Search</Link>
        </div>
        <div className="login-icon">
          <Link to="/login">Login</Link>
        </div>
      </nav>
      <div className="hero-section">
        {/* Image on the left */}
        <img src={JobImage} alt="Job Search" className="hero-image" />

        {/* Text and buttons on the right */}
        <div className="hero-text">
          <h2>Need help finding a job?</h2>
          <p>Building solutions that make life easier.</p>
          <div className="cta-buttons">
            <Link to="/signupchoice" className="signup-button">
              Get Started
            </Link>
          </div>
        </div>
      </div>
      <footer className="footer">
        <p>&copy; 2024 Job Search. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
