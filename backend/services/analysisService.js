const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

exports.analyzeResumeWithGemini = async (resumeText) => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
  You are an expert technical recruiter and career coach. Analyze the following resume text and extract the information into a valid JSON object. The JSON object must conform to the following structure, and all fields must be populated. Do not include any text or markdown formatting before or after the JSON object.

  Resume Text:
  """
  ${resumeText}
  """

  JSON Structure:
  {
    "name": "string | null",
    "email": "string | null",
    "phone": "string | null",
    "linkedin_url": "string | null",
    "portfolio_url": "string | null",
    "summary": "string | null",
    "work_experience": [{ "role": "string", "company": "string", "duration": "string", "description": ["string"] }],
    "education": [{ "degree": "string", "institution": "string", "graduation_year": "string" }],
    "technical_skills": ["string"],
    "soft_skills": ["string"],
    "resume_rating": "number (1-10)",
    "improvement_areas": "string",
    "upskill_suggestions": ["string"]
  }
`;

  const result = await model.generateContent(prompt);
  const response = result.response.text();

  try {
    const responseText = result.response.text();

    // Extract pure JSON using first `{` and last `}`
    const jsonStart = responseText.indexOf("{");
    const jsonEnd = responseText.lastIndexOf("}");
    const jsonString = responseText.slice(jsonStart, jsonEnd + 1);

    return JSON.parse(jsonString);
  } catch (err) {
    console.error("LLM JSON parse error:", err);
    return null;
  }
};
