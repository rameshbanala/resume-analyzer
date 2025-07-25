const express = require("express");
const app = express();
const pool = require("./db");

require("dotenv").config();

// Routes
const resumeRoutes = require("./routes/resumeRoutes");

const cors = require("cors");
app.use(cors());

app.use(express.json());

// Add file size limit for security
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Using routes
app.use("/api/resumes", resumeRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Resume Parser Backend API",
    version: "1.0.0",
    endpoints: {
      upload: "POST /api/resumes/upload",
      getAllResumes: "GET /api/resumes",
      getResumeById: "GET /api/resumes/:id",
    },
  });
});

// Improved database connection with retry logic
const connectWithRetry = () => {
  pool.query("SELECT NOW()", (err, result) => {
    if (err) {
      console.error("Failed to connect to PostgreSQL:", err);
      console.log("Retrying in 5 seconds...");
      setTimeout(connectWithRetry, 5000);
    } else {
      console.log("PostgreSQL connected at:", result.rows[0].now);
      const PORT = process.env.PORT || 5000; // Add fallback
      app.listen(PORT, () => {
        console.log(`Server listening at http://localhost:${PORT}`);
      });
    }
  });
};

connectWithRetry();

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  pool.end(() => {
    process.exit(0);
  });
});
