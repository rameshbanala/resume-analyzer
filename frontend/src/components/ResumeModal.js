import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import ResumeDetails from './ResumeDetails';

const ResumeModal = ({ resume, onClose }) => {
  useEffect(() => {
    // Prevent body scroll when modal is open, but allow modal content to scroll
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  if (!resume) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Background overlay */}
      <div 
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal panel with proper mobile scrolling */}
      <div className="relative bg-white w-full h-full sm:rounded-lg sm:max-w-6xl sm:w-full sm:max-h-[90vh] sm:h-auto shadow-xl transform transition-all flex flex-col max-h-screen">
        {/* Header - Fixed at top */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 bg-white flex-shrink-0">
          <div className="min-w-0 flex-1 mr-4">
            <h2 className="text-lg sm:text-2xl font-bold text-gray-900 truncate">Resume Analysis</h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 truncate">{resume.file_name}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-md text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 p-2 flex-shrink-0"
            style={{ 
              minHeight: '44px', 
              minWidth: '44px',
              WebkitTapHighlightColor: 'transparent'
            }}
          >
            <X className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>

        {/* Content - Scrollable area with mobile optimizations */}
        <div 
          className="flex-1 overflow-y-auto overflow-x-hidden"
          style={{
            WebkitOverflowScrolling: 'touch', // Enable momentum scrolling on iOS
            overscrollBehavior: 'contain' // Prevent scroll chaining
          }}
        >
          <div className="p-4 sm:p-6 pb-8">
            <ResumeDetails resume={resume} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeModal;
