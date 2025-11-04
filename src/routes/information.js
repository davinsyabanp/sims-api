const express = require('express');
const router = express.Router();

const {
  getBanner,
  getServices
} = require('../controllers/informationController');

const authMiddleware = require('../middleware/auth');

router.get('/banner', getBanner);
router.get('/services', authMiddleware, getServices);

module.exports = router;

