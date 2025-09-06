import React, { useState, useEffect } from 'react';
import { getSubmissionsFromLocalStorage, exportLocalStorageToExcel } from '../utils/excelUtils';

const DataViewer = ({ isOpen, onClose }) => {
  const [submissions, setSubmissions] = useState([]);
  const [exportStatus, setExportStatus] = useState('');

  useEffect(() => {
    if (isOpen) {
      const data = getSubmissionsFromLocalStorage();
      setSubmissions(data);
    }
  }, [isOpen]);

  const handleExport = () => {
    const result = exportLocalStorageToExcel();
    if (result.success) {
      setExportStatus('Excel file downloaded successfully!');
    } else {
      setExportStatus(result.message || 'Failed to export data');
    }
    setTimeout(() => setExportStatus(''), 3000);
  };

  const clearData = () => {
    if (window.confirm('Are you sure you want to clear all saved data?')) {
      localStorage.removeItem('userSubmissions');
      setSubmissions([]);
      setExportStatus('Data cleared successfully');
      setTimeout(() => setExportStatus(''), 3000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 px-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center bg-[#0061a5] text-white px-4 py-3">
          <h2 className="text-lg font-semibold">Saved Submissions ({submissions.length})</h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded px-2 py-1 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Controls */}
        <div className="bg-gray-50 px-4 py-3 border-b flex gap-3">
          <button
            onClick={handleExport}
            disabled={submissions.length === 0}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded text-sm transition-colors"
          >
            Export to Excel
          </button>
          <button
            onClick={clearData}
            disabled={submissions.length === 0}
            className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-4 py-2 rounded text-sm transition-colors"
          >
            Clear All Data
          </button>
          {exportStatus && (
            <div className={`px-3 py-2 rounded text-sm ${
              exportStatus.includes('success') 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              {exportStatus}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[50vh]">
          {submissions.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <p className="text-lg">No submissions yet</p>
              <p className="text-sm mt-2">Submissions will appear here when users send messages through the contact form.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {submissions.map((submission, index) => (
                <div key={submission.id || index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-[#0061a5]">{submission.name}</h3>
                    <span className="text-xs text-gray-500">
                      {new Date(submission.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-700 bg-white p-3 rounded border text-sm leading-relaxed">
                    {submission.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataViewer;