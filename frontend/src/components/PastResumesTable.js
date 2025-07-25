/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import {
  Eye,
  Calendar,
  User,
  Star,
  FileText,
  Loader2,
  AlertCircle,
  Search,
} from "lucide-react";
import axios from "axios";
import ResumeModal from "./ResumeModal";

const PastResumesTable = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedResume, setSelectedResume] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  useEffect(() => {
    fetchResumes();
  }, [currentPage]);

  const fetchResumes = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/resumes?page=${currentPage}&limit=10`
      );
      setResumes(response.data.resumes || []);
      setTotalPages(response.data.pagination?.totalPages || 1);
      setError(null);
    } catch (err) {
      setError("Failed to fetch resumes. Please try again.");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (resumeId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/resumes/${resumeId}`
      );
      setSelectedResume(response.data.resume);
    } catch (err) {
      setError("Failed to fetch resume details.");
      console.error("Details fetch error:", err);
    }
  };

  const filteredResumes = resumes.filter(
    (resume) =>
      resume.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resume.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resume.file_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDateMobile = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "2-digit",
    });
  };

  const getRatingBadge = (rating) => {
    if (!rating)
      return <span className="text-gray-400 text-xs sm:text-sm">N/A</span>;

    const color = rating >= 8 ? "success" : rating >= 6 ? "warning" : "error";
    const colorClasses = {
      success: "bg-success-100 text-success-800",
      warning: "bg-warning-100 text-warning-800",
      error: "bg-error-100 text-error-800",
    };

    return (
      <span
        className={`inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClasses[color]}`}
      >
        <Star className="w-3 h-3 mr-1" />
        {rating}/10
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="animate-spin h-8 w-8 text-primary-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading resumes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-error-50 border border-error-200 rounded-md p-4">
        <div className="flex">
          <AlertCircle className="h-5 w-5 text-error-500 flex-shrink-0" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-error-800">Error</h3>
            <p className="mt-1 text-sm text-error-700">{error}</p>
            <button
              onClick={fetchResumes}
              className="mt-2 text-sm text-error-800 underline hover:text-error-900"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
          Resume History
        </h2>
        <p className="text-base sm:text-lg text-gray-600">
          View and analyze all previously uploaded resumes. Tap on any resume to
          see detailed analysis.
        </p>
      </div>

      {/* Enhanced Mobile-Responsive Search Bar */}
      <div className="mb-4 sm:mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, or filename..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      </div>

      {/* Enhanced Mobile-Responsive Resumes Display */}
      {filteredResumes.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-lg">
          <FileText className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mb-4" />
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
            No Resumes Found
          </h3>
          <p className="text-gray-600 text-sm sm:text-base px-4">
            {searchTerm
              ? "No resumes match your search criteria."
              : "Upload your first resume to get started."}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-white shadow-lg rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Resume Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact Info
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rating
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Upload Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredResumes.map((resume) => (
                    <tr
                      key={resume.id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FileText className="h-8 w-8 text-primary-500 mr-3" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {resume.file_name}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {resume.id}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="flex items-center text-sm text-gray-900">
                            <User className="h-4 w-4 mr-2 text-gray-400" />
                            {resume.name || "Not provided"}
                          </div>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <span className="w-4 h-4 mr-2"></span>
                            {resume.email || "Not provided"}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        {getRatingBadge(resume.resume_rating)}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                          {formatDate(resume.uploaded_at)}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleViewDetails(resume.id)}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {filteredResumes.map((resume) => (
              <div
                key={resume.id}
                className="bg-white rounded-xl shadow-lg p-4 border border-gray-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start space-x-3 flex-1 min-w-0">
                    <FileText className="h-6 w-6 text-primary-500 mt-1 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {resume.file_name}
                      </h3>
                      <p className="text-xs text-gray-500">ID: {resume.id}</p>
                    </div>
                  </div>
                  <div className="flex-shrink-0 ml-2">
                    {getRatingBadge(resume.resume_rating)}
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <span className="text-sm text-gray-900 truncate">
                      {resume.name || "Not provided"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-4 h-4 flex-shrink-0"></span>
                    <span className="text-sm text-gray-600 truncate">
                      {resume.email || "Not provided"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <span className="text-sm text-gray-600">
                      {formatDateMobile(resume.uploaded_at)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleViewDetails(resume.id)}
                  className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </button>
              </div>
            ))}
          </div>

          {/* Enhanced Mobile-Responsive Pagination */}
          {totalPages > 1 && (
            <div className="bg-white px-4 py-4 sm:px-6 mt-4 sm:mt-6 rounded-xl shadow-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <p className="text-xs sm:text-sm text-gray-700">
                    Page <span className="font-medium">{currentPage}</span> of{" "}
                    <span className="font-medium">{totalPages}</span>
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-3 py-2 sm:px-4 border border-gray-300 text-xs sm:text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-3 py-2 sm:px-4 border border-gray-300 text-xs sm:text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Resume Details Modal */}
      {selectedResume && (
        <ResumeModal
          resume={selectedResume}
          onClose={() => setSelectedResume(null)}
        />
      )}
    </div>
  );
};

export default PastResumesTable;
