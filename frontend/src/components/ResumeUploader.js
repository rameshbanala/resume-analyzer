import React, { useState, useRef } from "react";
import {
  Upload,
  FileText,
  AlertCircle,
  CheckCircle,
  Loader2,
  X,
} from "lucide-react";
import axios from "axios";
import ResumeDetails from "./ResumeDetails";

const ResumeUploader = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const API_BASE_URL = process.env.REACT_APP_API_URL;

  const handleFileSelect = (selectedFile) => {
    setError(null);
    setResult(null);

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(selectedFile.type)) {
      setError("Please select a PDF or DOCX file only.");
      return;
    }

    const maxSize =
      selectedFile.type === "application/pdf"
        ? 10 * 1024 * 1024
        : 5 * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      const maxSizeMB = maxSize / (1024 * 1024);
      const fileType = selectedFile.type === "application/pdf" ? "PDF" : "DOCX";
      setError(
        `File size too large. Maximum size for ${fileType} files is ${maxSizeMB}MB.`
      );
      return;
    }

    setFile(selectedFile);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const uploadResume = async () => {
    if (!file) return;

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/resumes/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 60000,
        }
      );

      setResult(response.data.resume);
      setFile(null);
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Upload failed. Please try again.";
      setError(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const clearResult = () => {
    setResult(null);
  };

  if (result) {
    return (
      <div className="animate-slide-up">
        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-success-500" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Analysis Complete
            </h2>
          </div>
          <button
            onClick={clearResult}
            className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
          >
            <Upload className="h-4 w-4 mr-2" />
            Analyze Another Resume
          </button>
        </div>
        <ResumeDetails resume={result} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-6 sm:mb-8 px-2">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
          Upload Your Resume
        </h2>
        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Get instant AI-powered feedback on your resume. Our system extracts
          key information and provides personalized suggestions for improvement.
        </p>
      </div>

      {/* Enhanced Mobile-Responsive Upload Area */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6">
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 sm:p-8 text-center transition-colors duration-200 min-h-[200px] sm:min-h-[240px] flex flex-col justify-center ${
            dragActive
              ? "border-primary-500 bg-primary-50"
              : file
              ? "border-success-500 bg-success-50"
              : "border-gray-300 hover:border-primary-400 hover:bg-gray-50"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx"
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />

          {!file ? (
            <div className="space-y-4">
              <Upload className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
              <div className="space-y-2">
                <h3 className="text-base sm:text-lg font-medium text-gray-900">
                  Drop your resume here, or tap to browse
                </h3>
                <p className="text-sm text-gray-500 px-2">
                  Supports PDF and DOCX files up to 10MB (PDF) or 5MB (DOCX)
                </p>
              </div>
              <button
                type="button"
                className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 border border-primary-300 rounded-md shadow-sm text-sm font-medium text-primary-700 bg-primary-50 hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
              >
                Choose File
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <FileText className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-success-500" />
              <h3 className="text-base sm:text-lg font-medium text-gray-900">
                File Selected
              </h3>
              <div className="bg-white rounded-lg p-4 mx-auto max-w-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-primary-500 flex-shrink-0" />
                    <div className="text-left min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={clearFile}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200 flex-shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Mobile-Responsive Upload Button */}
        {file && (
          <div className="mt-4 sm:mt-6 text-center">
            <button
              onClick={uploadResume}
              disabled={uploading}
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 min-h-[48px]"
            >
              {uploading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                  Analyzing Resume...
                </>
              ) : (
                <>
                  <Upload className="-ml-1 mr-3 h-5 w-5" />
                  Analyze Resume
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Enhanced Mobile-Responsive Error Message */}
      {error && (
        <div className="bg-error-50 border border-error-200 rounded-md p-4 mb-4 sm:mb-6 animate-slide-up">
          <div className="flex flex-col sm:flex-row">
            <AlertCircle className="h-5 w-5 text-error-500 mt-0.5 flex-shrink-0" />
            <div className="ml-0 sm:ml-3 mt-2 sm:mt-0">
              <h3 className="text-sm font-medium text-error-800">
                Upload Error
              </h3>
              <p className="mt-1 text-sm text-error-700 break-words">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Mobile-Responsive Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-medium text-blue-900 mb-3">
          How it works:
        </h3>
        <ol className="list-decimal list-inside space-y-2 text-sm sm:text-base text-blue-800">
          <li>Upload your resume in PDF or DOCX format</li>
          <li>Our AI extracts key information and analyzes your resume</li>
          <li>Get instant feedback with improvement suggestions</li>
          <li>View personalized skill recommendations for career growth</li>
        </ol>
      </div>
    </div>
  );
};

export default ResumeUploader;
