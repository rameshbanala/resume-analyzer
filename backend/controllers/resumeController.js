const pool = require("../db");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const { analyzeResumeWithGemini } = require("../services/analysisService");

// Enhanced file validation for both PDF and DOCX
const validateFile = (file) => {
  if (!file) return { isValid: false, error: "No file uploaded" };

  const allowedTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  const allowedExtensions = [".pdf", ".docx"];

  if (!allowedTypes.includes(file.mimetype)) {
    return { isValid: false, error: "Only PDF and DOCX files are allowed" };
  }

  // Check file extension as additional validation
  const fileExtension = file.originalname
    .toLowerCase()
    .substring(file.originalname.lastIndexOf("."));
  if (!allowedExtensions.includes(fileExtension)) {
    return { isValid: false, error: "File must have .pdf or .docx extension" };
  }

  // Different size limits for different file types
  let maxSize;
  if (file.mimetype === "application/pdf") {
    maxSize = 10 * 1024 * 1024; // 10MB for PDF
  } else if (
    file.mimetype ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    maxSize = 5 * 1024 * 1024; // 5MB for DOCX
  }

  if (file.size > maxSize) {
    const maxSizeMB = maxSize / (1024 * 1024);
    return {
      isValid: false,
      error: `File size must be less than ${maxSizeMB}MB for ${fileExtension.toUpperCase()} files`,
    };
  }

  return { isValid: true };
};

// Enhanced text extraction function
const extractTextFromFile = async (file) => {
  const fileExtension = file.originalname
    .toLowerCase()
    .substring(file.originalname.lastIndexOf("."));

  try {
    let extractedText;

    if (fileExtension === ".pdf") {
      console.log("Extracting text from PDF...");
      const parsedData = await pdfParse(file.buffer);
      extractedText = parsedData.text;
    } else if (fileExtension === ".docx") {
      console.log("Extracting text from DOCX...");
      const result = await mammoth.extractRawText({ buffer: file.buffer });
      extractedText = result.value;

      // Log any warnings from mammoth
      if (result.messages.length > 0) {
        console.warn("DOCX extraction warnings:", result.messages);
      }
    } else {
      throw new Error("Unsupported file type");
    }

    if (!extractedText || extractedText.trim().length < 50) {
      throw new Error(
        `Insufficient text content in ${fileExtension.toUpperCase()}. Please ensure the document contains readable text.`
      );
    }

    return extractedText;
  } catch (error) {
    console.error(`Text extraction error for ${fileExtension}:`, error);
    throw new Error(
      `Failed to extract text from ${fileExtension.toUpperCase()}. ${
        error.message
      }`
    );
  }
};

exports.uploadResume = async (req, res) => {
  try {
    // Validate file
    const fileValidation = validateFile(req.file);
    if (!fileValidation.isValid) {
      return res.status(400).json({ error: fileValidation.error });
    }

    console.log(
      `Processing file: ${req.file.originalname} (${req.file.mimetype})`
    );

    // Extract text from file (PDF or DOCX)
    let resumeText;
    try {
      resumeText = await extractTextFromFile(req.file);
    } catch (extractionError) {
      return res.status(400).json({ error: extractionError.message });
    }

    // Analyze with Gemini
    console.log("Analyzing resume with AI...");
    const result = await analyzeResumeWithGemini(resumeText);

    if (!result) {
      return res.status(500).json({
        error: "AI analysis failed. Please try again later.",
      });
    }

    // Validate required fields
    if (!result.name && !result.email) {
      return res.status(400).json({
        error:
          "Unable to extract basic information from resume. Please ensure the resume contains clear name and contact details.",
      });
    }

    // Insert into database
    const insertQuery = `
      INSERT INTO resumes (
        file_name, name, email, phone, linkedin_url, portfolio_url,
        summary, work_experience, education, technical_skills,
        soft_skills, projects, certifications, resume_rating,
        improvement_areas, upskill_suggestions
      )
      VALUES (
        $1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10,
        $11, $12, $13, $14,
        $15, $16
      )
      RETURNING *;
    `;

    const values = [
      req.file.originalname,
      result.name || null,
      result.email || null,
      result.phone || null,
      result.linkedin_url || null,
      result.portfolio_url || null,
      result.summary || null,
      JSON.stringify(result.work_experience || []),
      JSON.stringify(result.education || []),
      JSON.stringify(result.technical_skills || []),
      JSON.stringify(result.soft_skills || []),
      JSON.stringify(result.projects || []),
      JSON.stringify(result.certifications || []),
      result.resume_rating || null,
      result.improvement_areas || null,
      JSON.stringify(result.upskill_suggestions || []),
    ];

    const dbResult = await pool.query(insertQuery, values);

    console.log(
      `Resume analyzed successfully for: ${result.name || "Unknown"}`
    );

    res.status(200).json({
      success: true,
      message: "Resume uploaded and analyzed successfully",
      resume: dbResult.rows[0],
    });
  } catch (err) {
    console.error("Upload Error:", err);

    if (err.message.includes("AI analysis")) {
      res.status(503).json({ error: "AI service temporarily unavailable" });
    } else if (err.code === "23505") {
      res.status(409).json({ error: "Resume already exists" });
    } else {
      res
        .status(500)
        .json({ error: "Internal server error during resume analysis" });
    }
  }
};

exports.getAllResumes = async (req, res) => {
  try {
    // Add pagination support
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const countQuery = "SELECT COUNT(*) FROM resumes";
    const countResult = await pool.query(countQuery);
    const totalCount = parseInt(countResult.rows[0].count);

    const dataQuery = `
      SELECT id, file_name, uploaded_at, name, email, resume_rating 
      FROM resumes 
      ORDER BY uploaded_at DESC 
      LIMIT $1 OFFSET $2
    `;

    const result = await pool.query(dataQuery, [limit, offset]);

    res.status(200).json({
      success: true,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        limit,
      },
      resumes: result.rows,
    });
  } catch (err) {
    console.error("Get all resumes error:", err);
    res.status(500).json({ error: "Failed to fetch resumes" });
  }
};

exports.getResumeById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ error: "Invalid resume ID" });
    }

    const result = await pool.query("SELECT * FROM resumes WHERE id = $1", [
      id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Resume not found" });
    }

    // Parse JSON fields back to objects
    const resume = result.rows[0];
    const parsedResume = {
      ...resume,
    };

    res.status(200).json({
      success: true,
      resume: parsedResume,
    });
  } catch (err) {
    console.error("Get resume by ID error:", err);
    res.status(500).json({ error: "Failed to fetch resume details" });
  }
};
