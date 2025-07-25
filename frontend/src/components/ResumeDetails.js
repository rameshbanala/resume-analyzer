import React from "react";
import {
  User,
  Mail,
  Phone,
  Linkedin,
  Globe,
  Briefcase,
  GraduationCap,
  Code,
  Users,
  FolderOpen,
  Award,
  Star,
  TrendingUp,
  Target,
} from "lucide-react";

const ResumeDetails = ({ resume }) => {
  if (!resume) return null;

  const parseField = (field) => {
    if (typeof field === "string") {
      try {
        return JSON.parse(field);
      } catch {
        return field;
      }
    }
    return field || [];
  };

  const workExperience = parseField(resume.work_experience);
  const education = parseField(resume.education);
  const technicalSkills = parseField(resume.technical_skills);
  const softSkills = parseField(resume.soft_skills);
  const projects = parseField(resume.projects);
  const certifications = parseField(resume.certifications);
  const upskillSuggestions = parseField(resume.upskill_suggestions);

  const getRatingColor = (rating) => {
    if (rating >= 8) return "text-success-600 bg-success-100";
    if (rating >= 6) return "text-warning-600 bg-warning-100";
    return "text-error-600 bg-error-100";
  };

  const getRatingText = (rating) => {
    if (rating >= 8) return "Excellent";
    if (rating >= 6) return "Good";
    if (rating >= 4) return "Average";
    return "Needs Improvement";
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Enhanced Mobile-Responsive Personal Information & Rating */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Personal Info */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-4 sm:p-6">
          <div className="flex items-center space-x-3 mb-4 sm:mb-6">
            <User className="h-5 w-5 sm:h-6 sm:w-6 text-primary-500" />
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">
              Personal Information
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <User className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium text-gray-900 break-words">
                    {resume.name || "Not provided"}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-900 break-all">
                    {resume.email || "Not provided"}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium text-gray-900">
                    {resume.phone || "Not provided"}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Linkedin className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-500">LinkedIn</p>
                  <p className="font-medium text-gray-900">
                    {resume.linkedin_url ? (
                      <a
                        href={resume.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700 break-all"
                      >
                        View Profile
                      </a>
                    ) : (
                      "Not provided"
                    )}
                  </p>
                </div>
              </div>

              {resume.portfolio_url && (
                <div className="flex items-start space-x-3">
                  <Globe className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-500">Portfolio</p>
                    <a
                      href={resume.portfolio_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-primary-600 hover:text-primary-700 break-all"
                    >
                      View Portfolio
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Resume Rating */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
          <div className="flex items-center space-x-3 mb-4 sm:mb-6">
            <Star className="h-5 w-5 sm:h-6 sm:w-6 text-primary-500" />
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">
              Resume Score
            </h3>
          </div>

          <div className="text-center">
            <div
              className={`inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full text-xl sm:text-2xl font-bold ${getRatingColor(
                resume.resume_rating
              )}`}
            >
              {resume.resume_rating || "N/A"}
            </div>
            <p className="mt-3 text-base sm:text-lg font-medium text-gray-900">
              {getRatingText(resume.resume_rating)}
            </p>
            <p className="text-sm text-gray-500">Out of 10</p>
          </div>
        </div>
      </div>

      {/* Enhanced Mobile-Responsive Summary */}
      {resume.summary && (
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Target className="h-5 w-5 sm:h-6 sm:w-6 text-primary-500" />
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">
              Professional Summary
            </h3>
          </div>
          <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
            {resume.summary}
          </p>
        </div>
      )}

      {/* Enhanced Mobile-Responsive Work Experience */}
      {workExperience.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
          <div className="flex items-center space-x-3 mb-4 sm:mb-6">
            <Briefcase className="h-5 w-5 sm:h-6 sm:w-6 text-primary-500" />
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">
              Work Experience
            </h3>
          </div>

          <div className="space-y-4 sm:space-y-6">
            {workExperience.map((job, index) => (
              <div
                key={index}
                className="border-l-4 border-primary-200 pl-4 sm:pl-6 relative"
              >
                <div className="absolute -left-2 top-0 w-4 h-4 bg-primary-500 rounded-full"></div>
                <div className="mb-2 sm:mb-3">
                  <h4 className="text-base sm:text-lg font-semibold text-gray-900 break-words">
                    {job.role}
                  </h4>
                  <p className="text-primary-600 font-medium text-sm sm:text-base break-words">
                    {job.company}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    {job.duration}
                  </p>
                </div>
                {job.description && Array.isArray(job.description) && (
                  <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm sm:text-base">
                    {job.description.map((desc, i) => (
                      <li key={i} className="break-words">
                        {desc}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Enhanced Mobile-Responsive Education */}
      {education.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
          <div className="flex items-center space-x-3 mb-4 sm:mb-6">
            <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6 text-primary-500" />
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">
              Education
            </h3>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {education.map((edu, index) => (
              <div
                key={index}
                className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gray-50 rounded-lg"
              >
                <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6 text-primary-500 mt-1 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold text-gray-900 text-sm sm:text-base break-words">
                    {edu.degree}
                  </h4>
                  <p className="text-primary-600 text-sm sm:text-base break-words">
                    {edu.institution}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    {edu.graduation_year}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Enhanced Mobile-Responsive Skills Section */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        {/* Technical Skills */}
        {technicalSkills.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
            <div className="flex items-center space-x-3 mb-4 sm:mb-6">
              <Code className="h-5 w-5 sm:h-6 sm:w-6 text-primary-500" />
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                Technical Skills
              </h3>
            </div>

            <div className="flex flex-wrap gap-2">
              {technicalSkills.map((skill, index) => (
                <span
                  key={index}
                  className="px-2 sm:px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs sm:text-sm font-medium break-all"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Soft Skills */}
        {softSkills.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
            <div className="flex items-center space-x-3 mb-4 sm:mb-6">
              <Users className="h-5 w-5 sm:h-6 sm:w-6 text-primary-500" />
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                Soft Skills
              </h3>
            </div>

            <div className="flex flex-wrap gap-2">
              {softSkills.map((skill, index) => (
                <span
                  key={index}
                  className="px-2 sm:px-3 py-1 bg-success-100 text-success-700 rounded-full text-xs sm:text-sm font-medium break-all"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Mobile-Responsive Projects */}
      {projects.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
          <div className="flex items-center space-x-3 mb-4 sm:mb-6">
            <FolderOpen className="h-5 w-5 sm:h-6 sm:w-6 text-primary-500" />
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">
              Projects
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {projects.map((project, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-3 sm:p-4"
              >
                <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base break-words">
                  {project.name}
                </h4>
                <p className="text-gray-700 text-xs sm:text-sm mb-3 break-words">
                  {project.description}
                </p>
                {project.technologies &&
                  Array.isArray(project.technologies) && (
                    <div className="flex flex-wrap gap-1">
                      {project.technologies.map((tech, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs break-all"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Enhanced Mobile-Responsive Certifications */}
      {certifications.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
          <div className="flex items-center space-x-3 mb-4 sm:mb-6">
            <Award className="h-5 w-5 sm:h-6 sm:w-6 text-primary-500" />
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">
              Certifications
            </h3>
          </div>

          <div className="space-y-3">
            {certifications.map((cert, index) => (
              <div
                key={index}
                className="flex items-start space-x-3 sm:space-x-4 p-3 bg-gray-50 rounded-lg"
              >
                <Award className="h-4 w-4 sm:h-5 sm:w-5 text-warning-500 mt-1 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <h4 className="font-medium text-gray-900 text-sm sm:text-base break-words">
                    {cert.name}
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-600 break-words">
                    {cert.issuer} • {cert.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Enhanced Mobile-Responsive AI Feedback Section */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        {/* Improvement Areas */}
        {resume.improvement_areas && (
          <div className="bg-gradient-to-br from-warning-50 to-orange-50 rounded-xl shadow-lg p-4 sm:p-6 border border-warning-200">
            <div className="flex items-center space-x-3 mb-4 sm:mb-6">
              <Target className="h-5 w-5 sm:h-6 sm:w-6 text-warning-600" />
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                Areas for Improvement
              </h3>
            </div>
            <p className="text-gray-700 leading-relaxed text-sm sm:text-base break-words">
              {resume.improvement_areas}
            </p>
          </div>
        )}

        {/* Upskill Suggestions */}
        {upskillSuggestions.length > 0 && (
          <div className="bg-gradient-to-br from-success-50 to-emerald-50 rounded-xl shadow-lg p-4 sm:p-6 border border-success-200">
            <div className="flex items-center space-x-3 mb-4 sm:mb-6">
              <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-success-600" />
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                Upskill Suggestions
              </h3>
            </div>

            <div className="space-y-2">
              {upskillSuggestions.map((suggestion, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-success-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700 text-sm sm:text-base break-words">
                    {suggestion}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeDetails;
