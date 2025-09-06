import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

const AdminLogin = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetMessage, setResetMessage] = useState('');

  const { signIn, resetPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await signIn(email, password);
      onClose(); // Close login modal on success
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    setError('');
    setResetMessage('');

    try {
      await resetPassword(email);
      setResetMessage('Password reset email sent! Check your inbox.');
      setShowForgotPassword(false);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 px-4">
      <motion.div
        className="bg-gray-200 rounded-lg shadow-xl max-w-md w-full p-6"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#0061a5]">
            {showForgotPassword ? 'Reset Password' : 'Admin Login'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl bg-white hover:bg-[#9cd7e8] py-1 px-2 rounded-sm"
          >
            ✕
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Reset Message */}
        {resetMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {resetMessage}
          </div>
        )}

        {/* Login Form */}
        {!showForgotPassword ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0061a5] focus:border-transparent"
                placeholder="admin@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0061a5] focus:border-transparent"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0061a5] hover:bg-[#004c84] disabled:bg-gray-400 text-white py-2 px-4 rounded-md font-medium transition-colors duration-200"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-[#0061a5] hover:underline"
              >
                Forgot your password?
              </button>
            </div>
          </form>
        ) : (
          /* Forgot Password Form */
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div>
              <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="reset-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0061a5] focus:border-transparent"
                placeholder="admin@example.com"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0061a5] hover:bg-[#004c84] disabled:bg-gray-400 text-white py-2 px-4 rounded-md font-medium transition-colors duration-200"
            >
              {loading ? 'Sending...' : 'Send Reset Email'}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setShowForgotPassword(false);
                  setError('');
                  setResetMessage('');
                }}
                className="text-sm text-[#0061a5] hover:underline"
              >
                Back to Login
              </button>
            </div>
          </form>
        )}

        {/* Info */}
        <div className="mt-6 p-3 bg-gray-50 rounded-md">
          <p className="text-xs text-gray-600 text-center">
            Only authorized administrators can access this panel.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;