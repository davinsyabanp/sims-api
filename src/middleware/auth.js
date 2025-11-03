const jwt = require('jsonwebtoken');
const { unauthorizedResponse } = require('../utils/response');

/**
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} Error response if token is invalid/expired
 */
const authMiddleware = (req, res, next) => {
  try {
    // Get Authorization header
    const authHeader = req.headers.authorization;
    
    // Check if Authorization header exists and starts with "Bearer "
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return unauthorizedResponse(
        res,
        401,
        'Token tidak tidak valid atau kadaluwarsa'
      );
    }
    
    // Extract token from "Bearer {token}"
    const token = authHeader.replace('Bearer ', '').trim();
    
    // Verify token with JWT_SECRET
    // JWT payload must contain email (as per Swagger spec)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if email exists in decoded payload
    if (!decoded.email) {
      return unauthorizedResponse(
        res,
        401,
        'Token tidak tidak valid atau kadaluwarsa'
      );
    }
    
    // Attach user email to req.user for use in controllers
    req.user = decoded; // Contains email from payload
    
    // Continue to next middleware/route handler
    next();
    
  } catch (error) {
    // Handle all JWT errors (expired, invalid, malformed, etc.)
    // Return exact error format from Swagger (status 108)
    return unauthorizedResponse(
      res,
      401,
      'Token tidak tidak valid atau kadaluwarsa'
    );
  }
};

// Export middleware
module.exports = authMiddleware;