// utils/imageUtil.js

/**
 * Convert a single file buffer to base64 data URL
 * @param {Object} file - Multer file object
 * @returns {string} - Base64 image string
 */
const convertToBase64 = (file) => {
    if (!file || !file.buffer || !file.mimetype) return null;
    return `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
  };
  





  /**
   * Convert multiple file buffers to base64 data URLs
   * @param {Array} files - Array of Multer file objects
   * @returns {Array<string>} - Array of base64 image strings
   */
  const convertMultipleToBase64 = (files) => {
    if (!Array.isArray(files)) return [];
    return files.map((file) => convertToBase64(file));
  };
  
export {
    convertToBase64,
    convertMultipleToBase64,
  };
  