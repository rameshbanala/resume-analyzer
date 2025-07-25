const express = require("express");
const router = express.Router();
const multer = require("multer");
const resumeController = require("../controllers/resumeController");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB overall limit (PDF max)
    files: 1,
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF and DOCX files are allowed"), false);
    }
  },
});

// Enhanced upload middleware with specific error messages
const uploadMiddleware = (req, res, next) => {
  upload.single("resume")(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          error:
            "File size too large. Maximum size is 10MB for PDF and 5MB for DOCX files.",
        });
      }
      if (err.code === "LIMIT_FILE_COUNT") {
        return res
          .status(400)
          .json({ error: "Too many files. Only one file allowed." });
      }
      return res
        .status(400)
        .json({ error: "File upload failed: " + err.message });
    } else if (err) {
      if (err.message === "Only PDF and DOCX files are allowed") {
        return res.status(400).json({
          error:
            "Invalid file type. Only PDF (.pdf) and Word (.docx) files are allowed.",
        });
      }
      return res
        .status(500)
        .json({ error: "Server error during file upload." });
    }
    next();
  });
};

// Routes
router.post("/upload", uploadMiddleware, resumeController.uploadResume);
router.get("/", resumeController.getAllResumes);
router.get("/:id", resumeController.getResumeById);

module.exports = router;
