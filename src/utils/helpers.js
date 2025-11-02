/**
 * Helper Utilities
 * Common helper functions for the SIMS PPOB API
 */

/**
 * Generate Invoice Number
 * Format: INV{DDMMYYYY}-{TIMESTAMP}
 * @returns {string} Invoice number
 */
const generateInvoiceNumber = () => {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  const timestamp = now.getTime();
  
  return `INV${day}${month}${year}-${timestamp}`;
};

/**
 * Email Validation Regex
 * Pattern: valid email format
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validate Email Format
 * @param {string} email - Email address to validate
 * @returns {boolean} True if email is valid, false otherwise
 */
const validateEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return false;
  }
  return EMAIL_REGEX.test(email);
};

/**
 * Validate Password
 * Check if password meets minimum requirements (8 characters)
 * @param {string} password - Password to validate
 * @returns {boolean} True if password is valid, false otherwise
 */
const validatePassword = (password) => {
  if (!password || typeof password !== 'string') {
    return false;
  }
  return password.length >= 8;
};

/**
 * Validate Amount
 * Check if amount is a valid number and greater than 0
 * @param {number|string} amount - Amount to validate
 * @returns {boolean} True if amount is valid, false otherwise
 */
const validateAmount = (amount) => {
  if (amount === null || amount === undefined || amount === '') {
    return false;
  }
  const numAmount = Number(amount);
  return !isNaN(numAmount) && numAmount > 0;
};

/**
 * Format Date to ISO String
 * @param {Date} date - Date object to format
 * @returns {string} ISO formatted date string
 */
const formatDateToISO = (date) => {
  if (!(date instanceof Date)) {
    return null;
  }
  return date.toISOString();
};

/**
 * Sanitize Input String
 * Remove leading/trailing whitespace
 * @param {string} str - String to sanitize
 * @returns {string} Sanitized string
 */
const sanitizeString = (str) => {
  if (!str || typeof str !== 'string') {
    return '';
  }
  return str.trim();
};

/**
 * Check if value is empty
 * @param {*} value - Value to check
 * @returns {boolean} True if value is empty, false otherwise
 */
const isEmpty = (value) => {
  if (value === null || value === undefined) {
    return true;
  }
  if (typeof value === 'string') {
    return value.trim().length === 0;
  }
  if (Array.isArray(value)) {
    return value.length === 0;
  }
  if (typeof value === 'object') {
    return Object.keys(value).length === 0;
  }
  return false;
};

/**
 * Get current timestamp
 * @returns {string} ISO formatted current timestamp
 */
const getCurrentTimestamp = () => {
  return new Date().toISOString();
};

// Export all helper functions
module.exports = {
  generateInvoiceNumber,
  EMAIL_REGEX,
  validateEmail,
  validatePassword,
  validateAmount,
  formatDateToISO,
  sanitizeString,
  isEmpty,
  getCurrentTimestamp
};

