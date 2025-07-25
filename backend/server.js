const express = require("express");
const app = express();
const pool = require("./db");

require("dotenv").config();

//routes
const resumeRoutes = require("./routes/resumeRoutes");

const cors = require("cors");
app.use(cors());

app.use(express.json());

//using routes
app.use("/api/resumes", resumeRoutes);

app.get("/", (req, res) => {
  res.status(200).send("Hello this resume parsing backend");
});

pool.query("SELECT NOW()", (err, result) => {
  if (err) {
    console.error("Failed to connect to PostgreSQL:", err);
    process.exit(1); // Exit the process on DB failure
  } else {
    console.log("PostgreSQL connected at:", result.rows[0].now);
    app.listen(process.env.PORT, () => {
      console.log("Server listening at http://localhost:" + process.env.PORT);
    });
  }
});
