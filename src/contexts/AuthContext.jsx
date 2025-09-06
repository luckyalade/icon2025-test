import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail 
} from 'firebase/auth';
import { auth } from '../config/firebase';

// Admin email addresses
const ADMIN_EMAILS = [
  'luckyalade309@gmail.com',
  'paulinjeti@gmail.com'
];

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if user is admin
  const checkAdminStatus = (user) => {
    if (!user || !user.email) return false;
    return ADMIN_EMAILS.includes(user.email.toLowerCase());
  };

  // Sign in function
  const signIn = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Check if user is admin
      if (!checkAdminStatus(user)) {
        await signOut(auth);
        throw new Error('Access denied. You are not authorized to access the admin panel.');
      }
      
      return userCredential;
    } catch (error) {
      throw error;
    }
  };

  // Sign out function
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  // Reset password function
  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw error;
    }
  };

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsAdmin(checkAdminStatus(user));
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    isAdmin,
    signIn,
    logout,
    resetPassword,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};