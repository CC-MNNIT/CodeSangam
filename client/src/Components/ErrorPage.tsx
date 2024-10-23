import React from "react";

const ErrorPage = () => {
  return (
    <div style={{ position: "relative", height: "100vh", overflow: "hidden" }}>
      {/* Error content in front of Starfield */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          textAlign: "center",
          color: "#fff",
          paddingTop: "20vh",
        }}
      >
        <h1
          style={{ fontSize: "4rem", marginBottom: "1rem" }}
          className="card block cursor-pointer py-2 pl-3 pr-4 text-gray-900 rounded md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500"
        >
          404
        </h1>
        <p
          style={{ fontSize: "2rem", marginBottom: "4rem" }}
          className="card block cursor-pointer py-2 pl-3 pr-4 text-gray-900 rounded md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500"
        >
          The page you are looking for has been lost in space.
        </p>
        <a
          href="/"
          style={{
            color: "#fff",
            fontSize: "1.5rem",
            textDecoration: "none",
            padding: "0.75rem 2rem",
            border: "2px solid #fff",
            borderRadius: "8px",
            transition: "background 0.3s, color 0.3s",
          }}
          onMouseEnter={(e) => {
            const target = e.target as HTMLAnchorElement;
            target.style.backgroundColor = "#fff";
            target.style.color = "#000";
          }}
          onMouseLeave={(e) => {
            const target = e.target as HTMLAnchorElement;
            target.style.backgroundColor = "transparent";
            target.style.color = "#fff";
          }}
        >
          Go Back Home
        </a>
      </div>
    </div>
  );
};

export default ErrorPage;
