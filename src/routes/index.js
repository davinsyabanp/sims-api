const express = require('express');
const router = express.Router();

// Import route modules
const membershipRoutes = require('./membership');
const informationRoutes = require('./information');
const transactionRoutes = require('./transaction');

// Membership routes (registration, login, profile)
router.use('/', membershipRoutes);

// Information routes (banner, services)
router.use('/', informationRoutes);

// Transaction routes (balance, topup, transaction, history)
router.use('/', transactionRoutes);

// API info endpoint
router.get('/', (req, res) => {
  res.status(200).json({
    status: 0,
    message: 'SIMS PPOB API',
    data: {
      version: '1.0.0',
      endpoints: {
        membership: {
          registration: 'POST /registration',
          login: 'POST /login',
          profile: 'GET /profile',
          updateProfile: 'PUT /profile/update',
          updateProfileImage: 'PUT /profile/image'
        },
        information: {
          banner: 'GET /banner',
          services: 'GET /services'
        },
        transaction: {
          balance: 'GET /balance',
          topup: 'POST /topup',
          transaction: 'POST /transaction',
          history: 'GET /transaction/history'
        }
      }
    }
  });
});

// Export router
module.exports = router;