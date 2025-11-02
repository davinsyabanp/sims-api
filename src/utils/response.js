/**
 * Success Response (Status 0)
 * @param {Object} res - Express response object
 * @param {number} httpStatus - HTTP status code (default: 200)
 * @param {string} message - Success message
 * @param {*} data - Response data (can be object, array, or null)
 * @returns {Object} JSON response
 */
const successResponse = (res, httpStatus = 200, message, data = null) => {
  return res.status(httpStatus).json({
    status: 0,
    message: message,
    data: data
  });
};

/**
 * Error Response - Status 102 (Invalid Parameter/Format)
 * @param {Object} res - Express response object
 * @param {number} httpStatus - HTTP status code (default: 400)
 * @param {string} message - Error message
 * @returns {Object} JSON response
 */
const invalidParameterResponse = (res, httpStatus = 400, message) => {
  return res.status(httpStatus).json({
    status: 102,
    message: message,
    data: null
  });
};

/**
 * Error Response - Status 103 (Invalid Credentials)
 * @param {Object} res - Express response object
 * @param {number} httpStatus - HTTP status code (default: 401)
 * @param {string} message - Error message
 * @returns {Object} JSON response
 */
const invalidCredentialsResponse = (res, httpStatus = 401, message) => {
  return res.status(httpStatus).json({
    status: 103,
    message: message,
    data: null
  });
};

/**
 * Error Response - Status 108 (Unauthorized/Token Invalid or Expired)
 * @param {Object} res - Express response object
 * @param {number} httpStatus - HTTP status code (default: 401)
 * @param {string} message - Error message
 * @returns {Object} JSON response
 */
const unauthorizedResponse = (res, httpStatus = 401, message) => {
  return res.status(httpStatus).json({
    status: 108,
    message: message,
    data: null
  });
};

/**
 * Generic Error Response
 * @param {Object} res - Express response object
 * @param {number} httpStatus - HTTP status code
 * @param {number} statusCode - API status code (102, 103, or 108)
 * @param {string} message - Error message
 * @returns {Object} JSON response
 */
const errorResponse = (res, httpStatus, statusCode, message) => {
  return res.status(httpStatus).json({
    status: statusCode,
    message: message,
    data: null
  });
};

// Export all response functions
module.exports = {
  successResponse,
  invalidParameterResponse,
  invalidCredentialsResponse,
  unauthorizedResponse,
  errorResponse
};

