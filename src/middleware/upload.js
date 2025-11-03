const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { invalidParameterResponse } = require('../utils/response');

// Create uploads directory if it doesn't exist
const uploadsDir = 'uploads/';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Format: profile-{timestamp}-{random}.{ext}
    const timestamp = Date.now();
    const random = Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname).toLowerCase();
    const filename = `profile-${timestamp}-${random}${ext}`;
    cb(null, filename);
  }
});

// File filter - Accept only JPEG, JPG, PNG
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const mimetype = allowedTypes.test(file.mimetype);
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    // Return error with exact message from Swagger (status 102)
    cb(new Error('Format Image tidak sesuai'));
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { 
    fileSize: 1024 * 1024 // 1MB max file size
  }
});

/**
 * Middleware wrapper to handle multer errors with exact Swagger format
 * Field name: file (as per Swagger spec)
 */
const uploadMiddleware = upload.single('file');

/**
 * Wrapper function to handle upload errors with exact Swagger error format
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const handleUpload = (req, res, next) => {
  uploadMiddleware(req, res, (err) => {
    if (err) {
      // Handle multer errors
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          // File too large
          return invalidParameterResponse(
            res,
            400,
            'Format Image tidak sesuai'
          );
        }
        // Other multer errors
        return invalidParameterResponse(
          res,
          400,
          'Format Image tidak sesuai'
        );
      }
      
      // Handle file filter errors (format tidak sesuai)
      if (err.message === 'Format Image tidak sesuai') {
        return invalidParameterResponse(
          res,
          400,
          'Format Image tidak sesuai'
        );
      }
      
      // Handle other errors
      return invalidParameterResponse(
        res,
        400,
        'Format Image tidak sesuai'
      );
    }
    
    // Check if file was uploaded
    if (!req.file) {
      return invalidParameterResponse(
        res,
        400,
        'Format Image tidak sesuai'
      );
    }
    
    // Success - continue to next middleware/route handler
    next();
  });
};

// Export both the multer instance and the middleware wrapper
module.exports = {
  upload,
  uploadMiddleware,
  handleUpload
};

