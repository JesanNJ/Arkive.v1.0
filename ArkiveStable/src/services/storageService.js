import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'ARKIVE_FILE_HISTORY';

/**
 * Get all stored files
 */
export const getStoredFiles = async () => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting stored files:', error);
    return [];
  }
};

/**
 * Save entire file list
 */
export const saveStoredFiles = async (files) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(files));
  } catch (error) {
    console.error('Error saving files:', error);
  }
};

/**
 * Add new file to history
 */
export const addFileToHistory = async (file) => {
  try {
    const existingFiles = await getStoredFiles();

    // 🔍 Check if file already exists (by uri or name)
    const existingIndex = existingFiles.findIndex(
      (f) => f.uri === file.uri
    );

    let updatedFiles = [];

    if (existingIndex !== -1) {
      // ✅ Update existing file
      existingFiles[existingIndex] = {
        ...existingFiles[existingIndex],
        ...file,
        timestamp: Date.now(),
      };

      // Move updated file to top
      updatedFiles = [
        existingFiles[existingIndex],
        ...existingFiles.filter((_, i) => i !== existingIndex),
      ];
    } else {
      // ✅ Add new file
      updatedFiles = [file, ...existingFiles];
    }

    await saveStoredFiles(updatedFiles);
  } catch (error) {
    console.error('Error adding file:', error);
  }
};

/**
 * Clear all history (debug only)
 */
export const clearHistory = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing history:', error);
  }
};