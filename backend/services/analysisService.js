const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// Add retry logic for API calls
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

exports.analyzeResumeWithGemini = async (resumeText, retries = 3) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash-exp",
        generationConfig: {
          temperature: 0.1, // Lower temperature for more consistent results
          topK: 1,
          topP: 1,
          maxOutputTokens: 2048,
        },
      });

      const prompt = `
You are an expert technical recruiter and career coach. Analyze the following resume text and extract the information into a valid JSON object. 

IMPORTANT INSTRUCTIONS:
1. Return ONLY a valid JSON object, no additional text or formatting
2. If a field cannot be found, use null for strings or [] for arrays
3. Ensure all field names match exactly as specified
4. For resume_rating, provide a score from 1-10 based on completeness, formatting, and content quality
5. For improvement_areas, provide specific, actionable feedback
6. For upskill_suggestions, recommend relevant technical skills based on the role/industry

Resume Text:
"""
${resumeText}
"""

Required JSON Structure:
{
  "name": "string | null",
  "email": "string | null", 
  "phone": "string | null",
  "linkedin_url": "string | null",
  "portfolio_url": "string | null",
  "summary": "string | null",
  "work_experience": [{"role": "string", "company": "string", "duration": "string", "description": ["string"]}],
  "education": [{"degree": "string", "institution": "string", "graduation_year": "string"}],
  "technical_skills": ["string"],
  "soft_skills": ["string"],
  "projects": [{"name": "string", "description": "string", "technologies": ["string"]}],
  "certifications": [{"name": "string", "issuer": "string", "date": "string"}],
  "resume_rating": 1-10,
  "improvement_areas": "string",
  "upskill_suggestions": ["string"]
}`;

      console.log(`Attempting AI analysis (attempt ${attempt}/${retries})`);

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      if (!responseText) {
        throw new Error("Empty response from AI");
      }

      // Enhanced JSON extraction
      let jsonString;
      const jsonStart = responseText.indexOf("{");
      const jsonEnd = responseText.lastIndexOf("}");

      if (jsonStart === -1 || jsonEnd === -1) {
        throw new Error("No JSON object found in response");
      }

      jsonString = responseText.slice(jsonStart, jsonEnd + 1);

      // Parse and validate JSON
      const parsedResult = JSON.parse(jsonString);

      // Basic validation
      if (typeof parsedResult !== "object" || parsedResult === null) {
        throw new Error("Invalid JSON structure");
      }

      // Ensure arrays are actually arrays
      const arrayFields = [
        "work_experience",
        "education",
        "technical_skills",
        "soft_skills",
        "projects",
        "certifications",
        "upskill_suggestions",
      ];
      arrayFields.forEach((field) => {
        if (parsedResult[field] && !Array.isArray(parsedResult[field])) {
          parsedResult[field] = [];
        }
      });

      // Validate resume rating
      if (parsedResult.resume_rating) {
        const rating = parseInt(parsedResult.resume_rating);
        if (isNaN(rating) || rating < 1 || rating > 10) {
          parsedResult.resume_rating = 5; // Default rating
        } else {
          parsedResult.resume_rating = rating;
        }
      }

      console.log("AI analysis completed successfully");
      return parsedResult;
    } catch (error) {
      console.error(`AI analysis attempt ${attempt} failed:`, error.message);

      if (attempt === retries) {
        console.error("All AI analysis attempts failed");
        return null;
      }

      // Wait before retry (exponential backoff)
      await delay(1000 * attempt);
    }
  }

  return null;
};
