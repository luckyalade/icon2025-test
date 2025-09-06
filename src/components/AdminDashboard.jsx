import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  getSubmissionsFromFirebase, 
  deleteSubmissionFromFirebase, 
  exportFirebaseSubmissionsToExcel 
} from '../utils/firebaseUtils';
import { motion } from 'framer-motion';

const AdminDashboard = ({ isOpen, onClose }) => {
  const { currentUser, logout } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, submissionId: null, submissionName: '' });

  // Load submissions when dashboard opens
  useEffect(() => {
    if (isOpen) {
      loadSubmissions();
    }
  }, [isOpen]);

  const loadSubmissions = async () => {
    setLoading(true);
    setError('');
    
    try {
      const result = await getSubmissionsFromFirebase();
      if (result.success) {
        setSubmissions(result.data);
      } else {
        setError(result.message || 'Failed to load submissions');
      }
    } catch (error) {
      setError('Error loading submissions: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (submissionId, submissionName) => {
    setDeleteModal({
      isOpen: true,
      submissionId,
      submissionName
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, submissionId: null, submissionName: '' });
  };

  const confirmDelete = async () => {
    const { submissionId } = deleteModal;
    
    setDeleteLoading(submissionId);
    closeDeleteModal();
    
    try {
      const result = await deleteSubmissionFromFirebase(submissionId);
      if (result.success) {
        setSubmissions(prev => prev.filter(sub => sub.id !== submissionId));
        setStatusMessage('Submission deleted successfully');
        setTimeout(() => setStatusMessage(''), 3000);
      } else {
        setError(result.message || 'Failed to delete submission');
        setTimeout(() => setError(''), 3000);
      }
    } catch (error) {
      setError('Error deleting submission: ' + error.message);
      setTimeout(() => setError(''), 3000);
    } finally {
      setDeleteLoading('');
    }
  };

  const handleExport = () => {
    const result = exportFirebaseSubmissionsToExcel(submissions, 'admin-submissions-export.xlsx');
    if (result.success) {
      setStatusMessage('Excel file downloaded successfully!');
    } else {
      setError(result.message || 'Failed to export data');
    }
    setTimeout(() => {
      setStatusMessage('');
      setError('');
    }, 3000);
  };

  const handleLogout = async () => {
    try {
      await logout();
      onClose();
    } catch (error) {
      setError('Failed to logout: ' + error.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
      <motion.div
        className="text-start bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="bg-[#0061a5] text-white px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Admin <span className='hidden md:inline'> Dashboard</span></h1>
            <p className="text-xs md:text-sm opacity-90"><span className='hidden md:inline'>Welcome,</span> {currentUser?.email}</p>
          </div>
          
          {/* Mobile Layout */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={loadSubmissions}
              className="bg-white/20 hover:bg-white/30 p-2 rounded transition-colors"
              title="Refresh"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            <button
              onClick={handleLogout}
              className="bg-white/20 hover:bg-white/30 p-2 rounded transition-colors"
              title="Logout"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" role="img" aria-labelledby="logoutOutlineTitle" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <title id="logoutOutlineTitle">Logout</title>
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <path d="M16 17l5-5-5-5"/>
                <path d="M21 12H9"/>
              </svg>

            </button>
            <button
              onClick={onClose}
              className="text-white bg-white/20 hover:bg-white/30 rounded px-2 py-1 transition-colors"
              title="Close"
            >
              ✕
            </button>
          </div>
          
          {/* Desktop Layout */}
          <div className="hidden md:flex flex-row items-center gap-3">
            <button
              onClick={loadSubmissions}
              className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded text-sm transition-colors"
            >
              Refresh
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm transition-colors"
            >
              Logout
            </button>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded px-2 py-1 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Stats and Controls */}
        <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
          <div className="flex items-center gap-4 md:gap-4">
            <div className="text-center ">
              <div className="text-xl font-bold text-[#0061a5]">{submissions.length}</div>
              <div className="text-sm text-gray-600">Total Submissions</div>
            </div>
            <div className="text-center mr-10 md:mr-0">
              <div className="text-xl font-bold text-green-600">
                {submissions.filter(s => new Date(s.createdAt) > new Date(Date.now() - 24*60*60*1000)).length}
              </div>
              <div className="text-sm text-gray-600">Last 24 Hours</div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={handleExport}
              disabled={submissions.length === 0}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded text-sm transition-colors"
            >
              Export to Excel
            </button>
          </div>
        </div>

        {/* Status Messages */}
        {statusMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 mx-6 mt-4 rounded">
            {statusMessage}
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mx-6 mt-4 rounded">
            {error}
          </div>
        )}

        {/* Content */}
        <div className="px-6 pt-6 pb-16 md:pb-6  overflow-y-auto max-h-[60vh]">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0061a5] mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading submissions...</p>
            </div>
          ) : submissions.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Submissions Yet</h3>
              <p className="text-gray-500">Submissions will appear here when users send messages through the contact form.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {submissions.map((submission) => (
                <motion.div
                  key={submission.id}
                  className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg text-[#0061a5]">{submission.name}</h3>
                      <p className="text-sm text-gray-500">{submission.displayDate}</p>
                    </div>
                    <button
                      onClick={() => openDeleteModal(submission.id, submission.name)}
                      disabled={deleteLoading === submission.id}
                      className="bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      {deleteLoading === submission.id ? '⏳' : 'Delete'}
                    </button>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded border">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {submission.message}
                    </p>
                  </div>
                  
                  <div className="mt-3 flex justify-between items-center text-xs text-gray-500">
                    <span>ID: {submission.id}</span>
                    <span className='hidden md:inline'>Submitted via: Contact Form</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
      
      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[60]">
          <motion.div
            className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-6 ">
              <div className="flex items-center mb-4">
                <div className="bg-red-100 rounded-full p-3 mr-4">
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Confirm Deletion</h3>
                  <p className="text-sm text-gray-500">This action cannot be undone</p>
                </div>
              </div>
              
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete the submission from <strong>{deleteModal.submissionName}</strong>?
              </p>
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={closeDeleteModal}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;