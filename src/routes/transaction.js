const express = require('express');
const router = express.Router();

const {
  getBalance,
  topup,
  transaction,
  getTransactionHistory
} = require('../controllers/transactionController');

const authMiddleware = require('../middleware/auth');

router.get('/balance', authMiddleware, getBalance);
router.post('/topup', authMiddleware, topup);
router.post('/transaction', authMiddleware, transaction);
router.get('/transaction/history', authMiddleware, getTransactionHistory);

module.exports = router;

