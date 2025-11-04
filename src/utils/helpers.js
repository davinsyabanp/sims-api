const generateInvoiceNumber = () => {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  const timestamp = now.getTime();
  
  return `INV${day}${month}${year}-${timestamp}`;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return false;
  }
  return EMAIL_REGEX.test(email);
};

const validatePassword = (password) => {
  if (!password || typeof password !== 'string') {
    return false;
  }
  return password.length >= 8;
};

const validateAmount = (amount) => {
  if (amount === null || amount === undefined || amount === '') {
    return false;
  }
  const numAmount = Number(amount);
  return !isNaN(numAmount) && numAmount > 0;
};

const formatDateToISO = (date) => {
  if (!(date instanceof Date)) {
    return null;
  }
  return date.toISOString();
};

const sanitizeString = (str) => {
  if (!str || typeof str !== 'string') {
    return '';
  }
  return str.trim();
};

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

const getCurrentTimestamp = () => {
  return new Date().toISOString();
};

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

