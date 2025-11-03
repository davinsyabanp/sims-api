const express = require('express');
const router = express.Router();

// Import controllers
const {
  getBalance,
  topup,
  transaction,
  getTransactionHistory
} = require('../controllers/transactionController');

// Import middleware
const authMiddleware = require('../middleware/auth');
    
// GET /balance - Get user balance
router.get('/balance', authMiddleware, getBalance);

// POST /topup - Top up user balance
router.post('/topup', authMiddleware, topup);

// POST /transaction - Create payment transaction
router.post('/transaction', authMiddleware, transaction);

// GET /transaction/history - Get transaction history with pagination
router.get('/transaction/history', authMiddleware, getTransactionHistory);

// Export router
module.exports = router;

