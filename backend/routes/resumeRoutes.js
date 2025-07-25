const express = require("express");
const router = express.Router();
const multer = require("multer");
const resumeController = require("../controllers/resumeController");

// Memory storage for handling file upload (PDF)
const upload = multer({ storage: multer.memoryStorage() });

// Routes
router.post(
  "/upload",
  (req, res, next) => {
    upload.single("resume")(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        return res
          .status(400)
          .json({ error: "File upload failed. Field name might be missing." });
      } else if (err) {
        return res
          .status(500)
          .json({ error: "Server error during file upload." });
      }
      next();
    });
  },
  resumeController.uploadResume
);
router.get("/", resumeController.getAllResumes);
router.get("/:id", resumeController.getResumeById);

module.exports = router;
