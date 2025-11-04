const jwt = require('jsonwebtoken');
const { unauthorizedResponse } = require('../utils/response');

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return unauthorizedResponse(
        res,
        401,
        'Token tidak tidak valid atau kadaluwarsa'
      );
    }
    
    const token = authHeader.replace('Bearer ', '').trim();
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (!decoded.email) {
      return unauthorizedResponse(
        res,
        401,
        'Token tidak tidak valid atau kadaluwarsa'
      );
    }
    
    req.user = decoded;
    next();
    
  } catch (error) {
    return unauthorizedResponse(
      res,
      401,
      'Token tidak tidak valid atau kadaluwarsa'
    );
  }
};

module.exports = authMiddleware;