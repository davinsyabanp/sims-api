const express = require('express');
const router = express.Router();

const {
  registration,
  login,
  getProfile,
  updateProfile,
  updateProfileImage
} = require('../controllers/membershipController');

const authMiddleware = require('../middleware/auth');
const { handleUpload } = require('../middleware/upload');

router.post('/registration', registration);
router.post('/login', login);
router.get('/profile', authMiddleware, getProfile);
router.put('/profile/update', authMiddleware, updateProfile);
router.put('/profile/image', authMiddleware, handleUpload, updateProfileImage);

module.exports = router;

