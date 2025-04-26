// src/setupProxy.js
const { createProxyMiddleware } = require("http-proxy-middleware");
const dotenv = require("dotenv");

// Load environment variables from the .env file
dotenv.config();

module.exports = function (app) {
  app.use(
    "/userapi", // Proxy path for the first API, previously 'api1'
    createProxyMiddleware({
      target: process.env.REACT_APP_USER_SERVICE_API_URL, // URL for Cloud
      // target: "http://localhost:8080", // URL for local
      changeOrigin: true,
      pathRewrite: { "^/userapi": "" }, // Optionally remove the '/userapi' prefix when forwarding to the target
    })
  );

  app.use(
    "/verifyapi", // Proxy path for the second API, previously 'api2'
    createProxyMiddleware({
      target: process.env.REACT_APP_VERIFY_SERVICE_API_URL, // URL for Cloud
      // target: "http://localhost:8081",
      changeOrigin: true,
      pathRewrite: { "^/verifyapi": "" }, // Optionally remove the '/verifyapi' prefix when forwarding to the target
    })
  );

  app.use(
    "/verifylocalapi", // Proxy path for the local verification API
    createProxyMiddleware({
      target: "http://localhost:8080", // Local backend server
      changeOrigin: true,
      pathRewrite: { "^/verifylocalapi": "" }, // Optionally remove the '/verifylocalapi' prefix
    })
  );

  app.use(
    "/scrape",
    createProxyMiddleware({
      target: process.env.REACT_APP_SCRAPER_SERVICE_API_URL,
      changeOrigin: true,
      pathRewrite: { "^/scrape": "" },
    })
  );
};
