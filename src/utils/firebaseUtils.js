import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  orderBy, 
  query,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import * as XLSX from 'xlsx';

// Collection name in Firestore
const SUBMISSIONS_COLLECTION = 'submissions';

/**
 * Save user submission to Firestore
 * @param {Object} data - The data to save (name and message)
 * @param {string} data.name - User's name
 * @param {string} data.message - User's message
 */
export const saveSubmissionToFirebase = async (data) => {
  try {
    const submissionData = {
      name: data.name.trim(),
      message: data.message.trim(),
      timestamp: serverTimestamp(),
      createdAt: new Date().toISOString()
    };

    const docRef = await addDoc(collection(db, SUBMISSIONS_COLLECTION), submissionData);
    
    return { 
      success: true, 
      message: 'Submission saved successfully!', 
      id: docRef.id 
    };
  } catch (error) {
    console.error('Error saving submission to Firebase:', error);
    return { 
      success: false, 
      message: 'Failed to save submission', 
      error: error.message 
    };
  }
};

/**
 * Get all submissions from Firestore
 * @returns {Promise<Array>} Array of submission objects
 */
export const getSubmissionsFromFirebase = async () => {
  try {
    const q = query(
      collection(db, SUBMISSIONS_COLLECTION), 
      orderBy('timestamp', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const submissions = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      submissions.push({
        id: doc.id,
        ...data,
        // Convert Firestore timestamp to readable date
        displayDate: data.timestamp ? data.timestamp.toDate().toLocaleString() : data.createdAt
      });
    });
    
    return { success: true, data: submissions };
  } catch (error) {
    console.error('Error fetching submissions from Firebase:', error);
    return { 
      success: false, 
      message: 'Failed to fetch submissions', 
      error: error.message,
      data: []
    };
  }
};

/**
 * Delete a submission from Firestore
 * @param {string} submissionId - The ID of the submission to delete
 */
export const deleteSubmissionFromFirebase = async (submissionId) => {
  try {
    await deleteDoc(doc(db, SUBMISSIONS_COLLECTION, submissionId));
    return { success: true, message: 'Submission deleted successfully!' };
  } catch (error) {
    console.error('Error deleting submission:', error);
    return { 
      success: false, 
      message: 'Failed to delete submission', 
      error: error.message 
    };
  }
};

/**
 * Export Firebase submissions to Excel
 * @param {Array} submissions - Array of submission objects
 * @param {string} filename - Filename for download
 */
export const exportFirebaseSubmissionsToExcel = (submissions, filename = 'submissions-export.xlsx') => {
  try {
    if (!submissions || submissions.length === 0) {
      return { success: false, message: 'No data to export' };
    }

    // Format data for Excel
    const formattedData = submissions.map(item => ({
      'Date & Time': item.displayDate || new Date(item.createdAt).toLocaleString(),
      'Name': item.name,
      'Message': item.message
    }));

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(formattedData);

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Submissions');

    // Download the file
    XLSX.writeFile(workbook, filename);

    return { success: true, message: 'Excel file downloaded successfully!' };
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    return { success: false, message: 'Failed to export to Excel', error: error.message };
  }
};

/**
 * Fallback save to localStorage (when Firebase is unavailable)
 * @param {Object} data - The data to save
 */
export const saveToLocalStorageFallback = (data) => {
  try {
    const existingData = JSON.parse(localStorage.getItem('userSubmissions') || '[]');
    const newSubmission = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      name: data.name,
      message: data.message,
      displayDate: new Date().toLocaleString()
    };
    
    existingData.push(newSubmission);
    localStorage.setItem('userSubmissions', JSON.stringify(existingData));
    
    return { success: true, data: existingData, message: 'Saved locally as backup' };
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return { success: false, error: error.message };
  }
};