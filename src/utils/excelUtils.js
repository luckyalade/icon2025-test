import * as XLSX from 'xlsx';

/**
 * Save user submission data to Excel file
 * @param {Object} data - The data to save (name and message)
 * @param {string} data.name - User's name
 * @param {string} data.message - User's message
 * @param {string} filename - Optional filename (defaults to 'user-submissions.xlsx')
 */
export const saveToExcel = async (data, filename = 'user-submissions.xlsx') => {
  try {
    // Create a new row with timestamp
    const newRow = {
      'Date & Time': new Date().toLocaleString(),
      'Name': data.name,
      'Message': data.message
    };

    let workbook;
    let worksheet;
    let existingData = [];

    try {
      // Try to read existing file
      const response = await fetch(`/${filename}`);
      if (response.ok) {
        const arrayBuffer = await response.arrayBuffer();
        workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        worksheet = workbook.Sheets[sheetName];
        existingData = XLSX.utils.sheet_to_json(worksheet);
      }
    } catch (error) {
      // File doesn't exist, create new one
      console.log('Creating new Excel file...');
    }

    // Add new row to existing data
    existingData.push(newRow);

    // Create new workbook and worksheet
    workbook = XLSX.utils.book_new();
    worksheet = XLSX.utils.json_to_sheet(existingData);

    // Add the worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Submissions');

    // Write the file
    XLSX.writeFile(workbook, filename);

    return { success: true, message: 'Data saved successfully!' };
  } catch (error) {
    console.error('Error saving to Excel:', error);
    return { success: false, message: 'Failed to save data', error };
  }
};

/**
 * Download Excel file with all submissions
 * @param {Array} data - Array of submission objects
 * @param {string} filename - Filename for download
 */
export const downloadExcel = (data, filename = 'user-submissions.xlsx') => {
  try {
    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Submissions');

    // Download the file
    XLSX.writeFile(workbook, filename);

    return { success: true, message: 'File downloaded successfully!' };
  } catch (error) {
    console.error('Error downloading Excel file:', error);
    return { success: false, message: 'Failed to download file', error };
  }
};

/**
 * Save data to localStorage as backup
 * @param {Object} data - The data to save
 */
export const saveToLocalStorage = (data) => {
  try {
    const existingData = JSON.parse(localStorage.getItem('userSubmissions') || '[]');
    const newSubmission = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      name: data.name,
      message: data.message
    };
    
    existingData.push(newSubmission);
    localStorage.setItem('userSubmissions', JSON.stringify(existingData));
    
    return { success: true, data: existingData };
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return { success: false, error };
  }
};

/**
 * Get all submissions from localStorage
 */
export const getSubmissionsFromLocalStorage = () => {
  try {
    return JSON.parse(localStorage.getItem('userSubmissions') || '[]');
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return [];
  }
};

/**
 * Export all localStorage data to Excel
 */
export const exportLocalStorageToExcel = () => {
  const data = getSubmissionsFromLocalStorage();
  if (data.length === 0) {
    return { success: false, message: 'No data to export' };
  }

  // Format data for Excel
  const formattedData = data.map(item => ({
    'Date & Time': new Date(item.timestamp).toLocaleString(),
    'Name': item.name,
    'Message': item.message
  }));

  return downloadExcel(formattedData, 'user-submissions-export.xlsx');
};