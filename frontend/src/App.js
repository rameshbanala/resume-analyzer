import React, { useState } from "react";
import { FileText, History, Upload, BarChart3, Menu, X } from "lucide-react";
import ResumeUploader from "./components/ResumeUploader";
import PastResumesTable from "./components/PastResumesTable";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState("upload");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const tabs = [
    {
      id: "upload",
      label: "Resume Analysis",
      icon: Upload,
      description: "Upload and analyze your resume",
    },
    {
      id: "history",
      label: "Historical Viewer",
      icon: History,
      description: "View previously analyzed resumes",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Enhanced Mobile-Responsive Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="p-1.5 sm:p-2 bg-primary-500 rounded-lg">
                <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                  Resume Analyzer
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">
                  AI-Powered Resume Analysis
                </p>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center space-x-2">
              <div className="hidden sm:flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-primary-500" />
                <span className="text-sm font-medium text-gray-700">
                  DeepKlarity
                </span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="sm:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Enhanced Mobile-Responsive Tab Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          {/* Desktop Tab Navigation */}
          <div className="hidden sm:flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === tab.id
                      ? "border-primary-500 text-primary-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Mobile Tab Navigation */}
          <div className="sm:hidden">
            <div className="flex space-x-1 p-1 bg-gray-100 rounded-lg m-3">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex-1 flex items-center justify-center space-x-2 py-3 px-3 rounded-md font-medium text-sm transition-colors duration-200 ${
                      activeTab === tab.id
                        ? "bg-white text-primary-600 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden xs:inline">
                      {tab.label.split(" ")[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Enhanced Mobile-Responsive Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="animate-fade-in">
          {activeTab === "upload" && <ResumeUploader />}
          {activeTab === "history" && <PastResumesTable />}
        </div>
      </main>

      {/* Enhanced Mobile-Responsive Footer */}
      <footer className="bg-white border-t border-gray-200 mt-8 sm:mt-16">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6">
          <div className="text-center text-xs sm:text-sm text-gray-500">
            <p>
              © 2025 DeepKlarity Resume Analyzer. Powered by Google Gemini AI.
            </p>
            <p className="mt-1">
              Supported: PDF, DOCX | Max: 10MB (PDF), 5MB (DOCX)
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
