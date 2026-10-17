// Development only (Create React App loads this file for `npm start`).
//
// In production nginx sends every /api/... request to the Go backend (see
// nginx/codesangam.cc-club.in.conf). The dev server has no such rule, so
// without this the Dashboard link (/api/auth) fell through to the React 404
// page. Run the Go server locally (PORT=8082 by default) alongside `npm start`.
const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: process.env.DEV_API_TARGET || "http://127.0.0.1:8082",
      changeOrigin: false,
      xfwd: true,
    })
  );
};
