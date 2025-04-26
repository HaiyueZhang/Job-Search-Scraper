import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "./JobServices.css";

const JobServices = () => {
  const [user, setUser] = useState({});
  const [searchType, setSearchType] = useState("id");
  const [searchQuery, setSearchQuery] = useState("");
  const [jobs, setJobs] = useState([]);
  const [defaultJobs, setDefaultJobs] = useState([]);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showUserInfoModal, setShowUserInfoModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  // const [htmlContent, setHtmlContent] = useState("");
  const [iframeSrcDoc, setIframeSrcDoc] = useState("");
  const [jobName, setJobName] = useState("");
  const [jobCompany, setJobCompany] = useState("");

  const urlHashPairs = useRef({});
  const currentUserEmail = localStorage.getItem("email");
  console.log("Current user email:", currentUserEmail);

  const JOB_SERVICE_API_URL = process.env.REACT_APP_JOB_SERVICE_API_URL; // Get API URL from .env
  const SCRAPER_SERVICE_API_URL = process.env.REACT_APP_SCRAPER_SERVICE_API_URL; // Get API URL from .env

  const getCurrentUser = async () => {
    try {
      const email = localStorage.getItem("email");
      // Check if email is present in localStorage
      if (!email) {
        toast.error("No email found. Please log in.");
        return; // Early return if email is not available
      }
      // Use URLSearchParams to correctly encode and append the email parameter
      const params = new URLSearchParams({ email: email });
      const response = await fetch(`/userapi/getUser?${params.toString()}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("User data:", data);
      setUser(data);
    } catch (error) {
      console.error("Error fetching user:", error);
      toast.error("Error fetching user information. Please try again.");
    }
  };

  useEffect(() => {
    getCurrentUser();
  }, []);
  const closeModal = () => {
    setShowModal(false);
  };
  const navigate = useNavigate();

  const closeUserInfoModal = () => {
    setShowUserInfoModal(false);
  };

  const openUserInfoModal = () => {
    setShowUserInfoModal(true);
    fetchUsers(currentPage);
  };

  useEffect(() => {
    const fetchDefaultJobs = async () => {
      const defaultJobData = [];
      const response = await fetch(
        `${JOB_SERVICE_API_URL}/jobs_of_user/${currentUserEmail}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      console.log("Default job data:", data);
      for (let i = 0; i < data.length; i++) {
        const job = data[i];
        defaultJobData.push({
          job_id: job.job_id,
          job_name: job.job_name,
          job_company: job.job_company,
          job_created_at: job.job_create_time,
          job_url: job.job_url,
        });
      }

      setJobs(defaultJobData);
      setDefaultJobs(defaultJobData);
    };
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
      toast.error("Please login to access this page.");
      navigate("/login");
    } else {
      fetchDefaultJobs();
    }
  }, [navigate, JOB_SERVICE_API_URL, searchQuery]);

  const fetchJobs = async () => {
    let url = "";

    if (searchType === "id") {
      // Fetch jobs by ID from the default jobs list
      if (!searchQuery) {
        setJobs(defaultJobs);
      } else {
        const job = defaultJobs.find(
          (job) => job.job_id === parseInt(searchQuery, 10)
        );
        if (job) {
          setJobs([job]);
        } else {
          setError("No job found with that ID.");
          setJobs([]);
        }
      }
    } else if (searchType === "company") {
      // Fetch jobs by Company from the default jobs list
      if (!searchQuery) {
        setJobs(defaultJobs);
      } else {
        const filteredJobs = defaultJobs.filter((job) =>
          job.job_company.toLowerCase().includes(searchQuery.toLowerCase())
        );
        if (filteredJobs.length > 0) {
          setJobs(filteredJobs);
        } else {
          setError("No jobs found for that company.");
          setJobs([]);
        }
      }
    }
  };

  const fetchUsers = async (page = 1) => {
    try {
      // Fetch the initial user data
      const response = await fetch(`/userapi/getAllUsers?page=${page}&size=3`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      if (data.callbackUrl) {
        // Fetch user details using the callbackUrl
        const userResponse = await fetch(`/userapi${data.callbackUrl}`);
        const userData = await userResponse.json();

        setUsers(userData.data);
        setNextPage(userData.links.next ? userData.links.next.href : null);
        setPrevPage(userData.links.prev ? userData.links.prev.href : null);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Error fetching user information. Please try again.");
    }
  };

  const handleNextPage = () => {
    if (nextPage) {
      const nextPageNumber = new URLSearchParams(nextPage.split("?")[1]).get(
        "page"
      );
      fetchUsers(nextPageNumber);
      setCurrentPage(parseInt(nextPageNumber, 10));
    }
  };

  const handlePrevPage = () => {
    if (prevPage) {
      const prevPageNumber = new URLSearchParams(prevPage.split("?")[1]).get(
        "page"
      );
      fetchUsers(prevPageNumber);
      setCurrentPage(parseInt(prevPageNumber, 10));
    }
  };

  const deleteUser = async (email) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user account? This action cannot be undone."
    );

    if (!confirmDelete) return; // Exit if the user cancels the action

    try {
      const response = await fetch(`/userapi/delete`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        toast.success("User deleted successfully.");
        setUsers(users.filter((user) => user.email !== email)); // Remove the deleted user from local state
      } else {
        throw new Error("Failed to delete user.");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Error deleting user. Please try again.");
    }
  };

  const renderJobItem = (job) => (
    <div key={job.job_id} className="job-item">
      <div className="job-details">
        <h3>{job.job_name}</h3>
        <p>Company: {job.job_company}</p>
        <p>Created At: {new Date(job.job_created_at).toLocaleDateString()}</p>
      </div>
      <a
        href={job.job_url}
        target="_blank"
        rel="noopener noreferrer"
        className="job-button"
      >
        Details
      </a>
    </div>
  );
  async function scrapeJob() {
    console.log("Scraping job...");
    const jobUrl = document.getElementById("jobUrlInput").value;
    if (!jobUrl) {
      alert("Please enter a job URL.");
      return;
    }

    try {
      const scrapeResponse = await fetch(`${SCRAPER_SERVICE_API_URL}/scrape`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: jobUrl }),
      });

      if (scrapeResponse.status === 201) {
        const scrapeData = await scrapeResponse.json();
        const hash = scrapeData.hash;
        console.log("Scrape started, hash:", hash);
        urlHashPairs.current[jobUrl] = hash;
        toast.success("Scraped successfully!");

        // Consider adding functionality to enable "Add Job" button here
      } else {
        console.error("Scraping job failed:", scrapeResponse.status);
      }
    } catch (error) {
      console.error("Error during job scraping process:", error);
    }
  }

  async function displayJob() {
    const jobUrl = document.getElementById("jobUrlInput").value;
    if (!jobUrl || !urlHashPairs.current[jobUrl]) {
      alert("No job URL or scrape data found.");
      return;
    }

    try {
      const hash = urlHashPairs.current[jobUrl];
      setShowModal(true);
      const retrieveResponse = await fetch(
        `${SCRAPER_SERVICE_API_URL}/retrieve/${hash}`
      );
      if (retrieveResponse.ok) {
        const retrieveData = await retrieveResponse.json();
        const content = retrieveData.content;
        console.log("Retrieved content:", content);
        setIframeSrcDoc(content);
      } else {
        console.error("Failed to retrieve job data");
      }
    } catch (error) {
      console.error("Error during job creation process:", error);
    }
  }

  async function addJob() {
    const jobUrl = document.getElementById("jobUrlInput").value;
    console.log("Adding job:", jobUrl);
    console.log("urlHashPairs:", urlHashPairs);
    if (!jobUrl || !urlHashPairs.current[jobUrl]) {
      alert("No job URL or scrape data found.");
      return;
    }

    const createJobResponse = await fetch(`${JOB_SERVICE_API_URL}/create_job`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        job_company: jobCompany,
        job_create_time: new Date().toISOString(),
        job_decide_time: new Date().toISOString(),
        job_hash: urlHashPairs.current[jobUrl],
        job_name: jobName,
        job_uid: currentUserEmail,
        job_url: jobUrl,
      }),
    });

    if (createJobResponse.ok) {
      const jobData = await createJobResponse.json();
      console.log("Job created with ID:", jobData);
      toast.success("Job created successfully!");
    } else {
      console.error("Failed to create job");
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    toast.success("Logged out successfully");
    setTimeout(() => {
      navigate("/login");
    }, 3000);
  };

  return (
    <div className="job-services">
      <nav className="navbar">
        <div className="logo">
          <Link to="/">Job Search</Link>
        </div>
        <div className="navbar-buttons">
          {user?.userType === "ADMIN" && (
            <button className="user-info-button" onClick={openUserInfoModal}>
              User Info
            </button>
          )}

          <div className="login-icon">
            <button onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </nav>
      <ToastContainer />
      {showUserInfoModal && (
        <div className="user-info-modal-overlay" onClick={closeUserInfoModal}>
          <div className="user-info-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="close-user-info-modal"
              onClick={(e) => {
                e.stopPropagation();
                closeUserInfoModal();
              }}
              aria-label="Close modal"
            >
              X
            </button>
            <div className="user-info-modal-content">
              <h2>User Information</h2>
              <div className="user-list">
                {users.map((user, index) => (
                  <div key={index} className="user-block">
                    <div className="user-info">
                      <p>
                        <strong>Email:</strong> {user.email}
                      </p>
                      <p>
                        <strong>First Name:</strong> {user.firstname}
                      </p>
                      <p>
                        <strong>Last Name:</strong> {user.lastname}
                      </p>
                      <p>
                        <strong>Gender:</strong> {user.gender}
                      </p>
                      <p>
                        <strong>User Type:</strong> {user.usertype}
                      </p>
                    </div>
                    <button
                      className="delete-user-button"
                      onClick={() => deleteUser(user.email)}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
              <div className="pagination-buttons">
                {prevPage && <button onClick={handlePrevPage}>Previous</button>}
                {nextPage && <button onClick={handleNextPage}>Next</button>}
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="upper-section">
        <div className="search-container">
          <h2>Search for Jobs</h2>
          <hr className="section-divider" />
          <p className="italic-description">
            Enter the ID or company name to find specific jobs.
          </p>
          <div className="button-group">
            <button
              onClick={() => setSearchType("id")}
              className={searchType === "id" ? "active" : ""}
            >
              Search by Job ID
            </button>
            <button
              onClick={() => setSearchType("company")}
              className={searchType === "company" ? "active" : ""}
            >
              Search by Company
            </button>
          </div>

          <input
            type="text"
            placeholder={
              searchType === "id" ? "Enter Job ID" : "Enter Company Name"
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <button onClick={fetchJobs}>Search</button>

          {error && <p className="error-message">{error}</p>}
        </div>

        <div className="scrape-container">
          <h2>Scrape for jobs</h2>
          <hr className="section-divider" />
          <p className="italic-description">
            Paste the job URL below to extract job details automatically.
          </p>
          <input type="text" id="jobUrlInput" placeholder="Enter Job URL" />
          <button onClick={scrapeJob}>Scrape Job</button>
          <button onClick={displayJob}>Add Job</button>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="close-modal"
              onClick={(e) => {
                e.stopPropagation();
                closeModal();
              }}
              aria-label="Close modal"
            >
              X
            </button>
            <div className="modal-content">
              <div className="modal-left">
                <h2>Add New Job</h2>
                <p>Please enter the details of the job you want to add.</p>
                <div className="form-group">
                  <label htmlFor="jobName">Job Name:</label>
                  <input
                    id="jobName"
                    type="text"
                    value={jobName}
                    onChange={(e) => setJobName(e.target.value)}
                    placeholder="Enter Job Name"
                  />
                  <label htmlFor="jobCompany">Job Company:</label>
                  <input
                    id="jobCompany"
                    type="text"
                    value={jobCompany}
                    onChange={(e) => setJobCompany(e.target.value)}
                    placeholder="Enter Job Company"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addJob();
                    }}
                    aria-label="Add new job entry"
                  >
                    Add Job
                  </button>
                </div>
              </div>
              <div className="modal-right">
                <iframe
                  srcDoc={iframeSrcDoc}
                  width="300"
                  height="400"
                  title="Content preview"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="job-list">
        {jobs.length > 0
          ? jobs.map(renderJobItem)
          : !error && <p>No jobs found. Try a different query.</p>}
      </div>
    </div>
  );
};

export default JobServices;
