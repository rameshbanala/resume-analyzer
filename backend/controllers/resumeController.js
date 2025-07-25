const pool = require("../db");
const pdfParse = require("pdf-parse");
const { analyzeResumeWithGemini } = require("../services/analysisService");

exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const pdfBuffer = req.file.buffer;
    const parsedData = await pdfParse(pdfBuffer);
    const resumeText = parsedData.text;

    const result = await analyzeResumeWithGemini(resumeText);
    if (!result || !result.name) throw new Error("Invalid AI response");

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
      result.name,
      result.email,
      result.phone,
      result.linkedin_url,
      result.portfolio_url,
      result.summary,
      JSON.stringify(result.work_experience),
      JSON.stringify(result.education),
      JSON.stringify(result.technical_skills),
      JSON.stringify(result.soft_skills),
      JSON.stringify(result.projects),
      JSON.stringify(result.certifications),
      result.resume_rating,
      result.improvement_areas,
      JSON.stringify(result.upskill_suggestions),
    ];

    const dbResult = await pool.query(insertQuery, values);
    res.status(200).json({
      message: "Resume uploaded successfully",
      resume: dbResult.rows[0],
    });
  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ error: "Resume analysis failed" });
  }
};

exports.getAllResumes = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, file_name, uploaded_at, name, email, resume_rating FROM resumes ORDER BY uploaded_at DESC"
    );
    res.status(200).json({
      resume_count: result.rowCount,
      resumes: result.rows,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch resumes" });
  }
};

exports.getResumeById = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM resumes WHERE id = $1", [
      req.params.id,
    ]);
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Resume not found" });
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch resume" });
  }
};
