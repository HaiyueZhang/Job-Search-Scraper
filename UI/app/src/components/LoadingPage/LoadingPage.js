import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "./LoadingPage.css";

const LoadingPage = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const code = searchParams.get("code");

    if (code) {
      const fetchAuthCallback = async () => {
        try {
          // Fetch the auth callback
          const response = await fetch(
            `/verifylocalapi/auth/callback?code=${code}`
          );

          if (response.ok) {
            const data = await response.json();
            console.log("Auth callback result:", data);

            if (data.executionId) {
              // If executionId is present, start polling
              console.log("Starting status polling...");
              pollRegistrationStatus(data.executionId);
            } else {
              setError("Missing executionId in the response.");
              setLoading(false);
            }
          } else {
            const errorText = await response.text();
            console.error("Error fetching auth callback:", errorText);
            setError(`Error: ${errorText}`);
            setLoading(false);
          }
        } catch (err) {
          console.error("Error fetching auth callback:", err.message);
          setError("Failed to fetch auth callback. Please try again.");
          setLoading(false);
        }
      };

      const pollRegistrationStatus = (executionId) => {
        let attempts = 0;
        const maxAttempts = 20; // Poll for 10 seconds (0.5s interval)

        const interval = setInterval(async () => {
          try {
            const response = await fetch(
              `/verifylocalapi/register/status?executionId=${executionId}`
            );

            if (!response.ok) {
              throw new Error("Failed to fetch registration status.");
            }

            const result = await response.text();
            console.log("Registration status:", result);

            if (result.includes("Registration successful")) {
              clearInterval(interval);
              const parsedResult = JSON.parse(result.match(/(\{.*\})/)[1]); // Extract JSON payload

              // Store email in localStorage
              localStorage.setItem(
                "pendingUser",
                JSON.stringify({ email: parsedResult.email })
              );
              console.log("Stored email in localStorage:", parsedResult.email);

              setLoading(false);
              navigate("/email-verification");
            } else if (result.includes("User already exists")) {
              clearInterval(interval);
              setLoading(false);
              navigate("/job-services");
            } else {
              console.log("Workflow still processing...");
            }
          } catch (err) {
            console.error("Error polling registration status:", err.message);
            clearInterval(interval);
            setError("Failed to fetch registration status.");
            setLoading(false);
          }

          attempts++;
          if (attempts >= maxAttempts) {
            clearInterval(interval);
            setError("Polling timed out. Please try again later.");
            setLoading(false);
          }
        }, 500); // Poll every 0.5 seconds
      };

      fetchAuthCallback();
    } else {
      setError("Missing authorization code in the URL.");
      setLoading(false);
    }
  }, [searchParams, navigate]);

  if (loading) {
    return (
      <div className="loading-page">
        <div className="spinner"></div>
        <p>Loading, please wait...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="loading-page">
        <p className="error-message">{error}</p>
      </div>
    );
  }

  return (
    <div className="loading-page">
      <h3>Auth Callback Result</h3>
      <pre>{JSON.stringify(result, null, 2)}</pre>
    </div>
  );
};

export default LoadingPage;
