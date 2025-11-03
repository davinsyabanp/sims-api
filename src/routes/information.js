const express = require('express');
const router = express.Router();

// Import controllers
const {
  getBanner,
  getServices
} = require('../controllers/informationController');

// Import middleware
const authMiddleware = require('../middleware/auth');

// GET /banner - Get all banners
router.get('/banner', getBanner);

// GET /services - Get all services
router.get('/services', authMiddleware, getServices);

// Export router
module.exports = router;

