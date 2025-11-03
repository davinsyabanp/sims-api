const { invalidParameterResponse } = require('../utils/response');
const { validateEmail, validatePassword, validateAmount } = require('../utils/helpers');

/**
 * Validate Email Format
 * @param {string} email - Email to validate
 * @returns {Object|null} Error object or null if valid
 */
const validateEmailFormat = (email) => {
  if (!validateEmail(email)) {
    return {
      status: 102,
      message: 'Paramter email tidak sesuai format'
    };
  }
  return null;
};

/**
 * Validate Password Length (min 8 characters)
 * @param {string} password - Password to validate
 * @returns {Object|null} Error object or null if valid
 */
const validatePasswordLength = (password) => {
  if (!validatePassword(password)) {
    return {
      status: 102,
      message: 'Password minimal 8 karakter'
    };
  }
  return null;
};

/**
 * Validate Required Fields
 * @param {Object} req - Express request object
 * @param {Array<string>} fields - Array of required field names
 * @returns {Object|null} Error object or null if valid
 */
const validateRequiredFields = (req, fields) => {
  const body = req.body || {};
  const missingFields = [];
  
  for (const field of fields) {
    if (body[field] === undefined || body[field] === null || body[field] === '') {
      missingFields.push(field);
    }
  }
  
  if (missingFields.length > 0) {
    // Return error for first missing field
    // You can customize this based on Swagger spec
    return {
      status: 102,
      message: `Paramter ${missingFields[0]} tidak sesuai format`
    };
  }
  
  return null;
};

/**
 * Validate Amount (must be number and > 0)
 * @param {number|string} amount - Amount to validate
 * @returns {Object|null} Error object or null if valid
 */
const validateAmountValue = (amount) => {
  if (!validateAmount(amount)) {
    return {
      status: 102,
      message: 'Paramter amount hanya boleh angka dan tidak boleh lebih kecil dari 0'
    };
  }
  return null;
};

/**
 * Email Validation Middleware
 * Validates email format in request body
 */
const validateEmailMiddleware = (req, res, next) => {
  const { email } = req.body || {};
  
  if (email === undefined || email === null || email === '') {
    return invalidParameterResponse(
      res,
      400,
      'Paramter email tidak sesuai format'
    );
  }
  
  const error = validateEmailFormat(email);
  if (error) {
    return invalidParameterResponse(res, 400, error.message);
  }
  
  next();
};

/**
 * Password Validation Middleware
 * Validates password length (min 8 characters)
 */
const validatePasswordMiddleware = (req, res, next) => {
  const { password } = req.body || {};
  
  if (password === undefined || password === null || password === '') {
    return invalidParameterResponse(
      res,
      400,
      'Password minimal 8 karakter'
    );
  }
  
  const error = validatePasswordLength(password);
  if (error) {
    return invalidParameterResponse(res, 400, error.message);
  }
  
  next();
};

/**
 * Required Fields Validation Middleware
 * Validates that all required fields are present
 * @param {Array<string>} fields - Array of required field names
 */
const validateRequiredFieldsMiddleware = (fields) => {
  return (req, res, next) => {
    const error = validateRequiredFields(req, fields);
    if (error) {
      return invalidParameterResponse(res, 400, error.message);
    }
    next();
  };
};

/**
 * Amount Validation Middleware
 * Validates amount must be number and > 0
 */
const validateAmountMiddleware = (req, res, next) => {
  const { top_up_amount } = req.body || {};
  
  if (top_up_amount === undefined || top_up_amount === null || top_up_amount === '') {
    return invalidParameterResponse(
      res,
      400,
      'Paramter amount hanya boleh angka dan tidak boleh lebih kecil dari 0'
    );
  }
  
  const error = validateAmountValue(top_up_amount);
  if (error) {
    return invalidParameterResponse(res, 400, error.message);
  }
  
  next();
};

/**
 * Registration Validation Middleware
 * Validates email and password for registration
 */
const validateRegistration = (req, res, next) => {
  const { email, password, first_name, last_name } = req.body || {};
  
  // Check required fields
  const requiredFields = ['email', 'password', 'first_name', 'last_name'];
  const missingFields = requiredFields.filter(field => {
    const value = req.body[field];
    return value === undefined || value === null || value === '';
  });
  
  if (missingFields.length > 0) {
    return invalidParameterResponse(
      res,
      400,
      `Paramter ${missingFields[0]} tidak sesuai format`
    );
  }
  
  // Validate email format
  const emailError = validateEmailFormat(email);
  if (emailError) {
    return invalidParameterResponse(res, 400, emailError.message);
  }
  
  // Validate password length
  const passwordError = validatePasswordLength(password);
  if (passwordError) {
    return invalidParameterResponse(res, 400, passwordError.message);
  }
  
  next();
};

/**
 * Login Validation Middleware
 * Validates email and password for login
 */
const validateLogin = (req, res, next) => {
  const { email, password } = req.body || {};
  
  // Check required fields
  if (email === undefined || email === null || email === '') {
    return invalidParameterResponse(
      res,
      400,
      'Paramter email tidak sesuai format'
    );
  }
  
  if (password === undefined || password === null || password === '') {
    return invalidParameterResponse(
      res,
      400,
      'Paramter email tidak sesuai format'
    );
  }
  
  // Validate email format
  const emailError = validateEmailFormat(email);
  if (emailError) {
    return invalidParameterResponse(res, 400, emailError.message);
  }
  
  next();
};

/**
 * Top Up Validation Middleware
 * Validates top_up_amount for top up transaction
 */
const validateTopUp = (req, res, next) => {
  const { top_up_amount } = req.body || {};
  
  if (top_up_amount === undefined || top_up_amount === null || top_up_amount === '') {
    return invalidParameterResponse(
      res,
      400,
      'Paramter amount hanya boleh angka dan tidak boleh lebih kecil dari 0'
    );
  }
  
  const error = validateAmountValue(top_up_amount);
  if (error) {
    return invalidParameterResponse(res, 400, error.message);
  }
  
  next();
};

/**
 * Transaction Validation Middleware
 * Validates service_code for transaction
 */
const validateTransaction = (req, res, next) => {
  const { service_code } = req.body || {};
  
  if (service_code === undefined || service_code === null || service_code === '') {
    return invalidParameterResponse(
      res,
      400,
      'Service ataus Layanan tidak ditemukan'
    );
  }
  
  next();
};

// Export all validation functions and middlewares
module.exports = {
  // Validation functions
  validateEmailFormat,
  validatePasswordLength,
  validateRequiredFields,
  validateAmountValue,
  
  // Individual validation middlewares
  validateEmailMiddleware,
  validatePasswordMiddleware,
  validateRequiredFieldsMiddleware,
  validateAmountMiddleware,
  
  // Combined validation middlewares
  validateRegistration,
  validateLogin,
  validateTopUp,
  validateTransaction
};

