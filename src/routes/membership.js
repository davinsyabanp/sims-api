const express = require('express');
const router = express.Router();

// Import controllers
const {
  registration,
  login,
  getProfile,
  updateProfile,
  updateProfileImage
} = require('../controllers/membershipController');

// Import middleware
const authMiddleware = require('../middleware/auth');
const { handleUpload } = require('../middleware/upload');

// POST /registration - Register a new user
router.post('/registration', registration);

// POST /login - User login and get JWT token
router.post('/login', login);

// GET /profile - Get user profile
router.get('/profile', authMiddleware, getProfile);

// PUT /profile/update - Update user profile (first_name and last_name)
router.put('/profile/update', authMiddleware, updateProfile);

// PUT /profile/image - Update user profile image
// Uses auth middleware + upload middleware (handleUpload handles multer.single('file'))
router.put('/profile/image', authMiddleware, handleUpload, updateProfileImage);

// Export router
module.exports = router;

