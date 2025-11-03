const pool = require('../config/database');
const { successResponse, invalidParameterResponse } = require('../utils/response');
const { generateInvoiceNumber, validateAmount } = require('../utils/helpers');

/**
 * GET /balance
 * Get user balance
 * 
 * Private Endpoint (Requires Auth)
 * Response: { status: 0, message: "Get Balance Berhasil", data: { balance } }
 */
const getBalance = async (req, res) => {
  try {
    // Get user email from req.user
    const userEmail = req.user.email;

    // Query user_id from users table using raw SQL with prepared statement
    const [users] = await pool.query(
      'SELECT id FROM users WHERE email = ?',
      [userEmail]
    );

    if (users.length === 0) {
      return invalidParameterResponse(
        res,
        400,
        'User not found'
      );
    }

    const userId = users[0].id;

    // Query balance from balances table using raw SQL with prepared statement
    const [balances] = await pool.query(
      'SELECT balance FROM balances WHERE user_id = ?',
      [userId]
    );

    if (balances.length === 0) {
      return invalidParameterResponse(
        res,
        400,
        'Balance not found'
      );
    }

    const balance = Number(balances[0].balance);

    // Return exact Swagger format with balance field
    return successResponse(
      res,
      200,
      'Get Balance Berhasil',
      { balance: balance }
    );

  } catch (error) {
    console.error('Get balance error:', error);
    return invalidParameterResponse(
      res,
      400,
      'Error getting balance'
    );
  }
};

/**
 * POST /topup
 * Top up user balance
 * 
 * Private Endpoint (Requires Auth)
 * Request Body: { top_up_amount }
 * Response: { status: 0, message: "Top Up Balance berhasil", data: { balance } }
 */
const topup = async (req, res) => {
  let connection;
  
  try {
    // Get user email from req.user
    const userEmail = req.user.email;
    const { top_up_amount } = req.body;

    // Validate top_up_amount (must be number and > 0)
    if (!validateAmount(top_up_amount)) {
      return invalidParameterResponse(
        res,
        400,
        'Paramter amount hanya boleh angka dan tidak boleh lebih kecil dari 0'
      );
    }

    // Query user_id from users table
    const [users] = await pool.query(
      'SELECT id FROM users WHERE email = ?',
      [userEmail]
    );

    if (users.length === 0) {
      return invalidParameterResponse(
        res,
        400,
        'User not found'
      );
    }

    const userId = users[0].id;

    // Use database transaction with getConnection()
    connection = await pool.getConnection();
    await connection.beginTransaction();

    // Get current balance (lock row for update)
    const [balanceRows] = await connection.query(
      'SELECT balance FROM balances WHERE user_id = ? FOR UPDATE',
      [userId]
    );

    if (balanceRows.length === 0) {
      await connection.rollback();
      connection.release();
      return invalidParameterResponse(
        res,
        400,
        'Balance not found'
      );
    }

    const currentBalance = Number(balanceRows[0].balance);
    const newBalance = currentBalance + Number(top_up_amount);

    // Update balance: balance = balance + top_up_amount
    await connection.query(
      'UPDATE balances SET balance = balance + ? WHERE user_id = ?',
      [top_up_amount, userId]
    );

    // Generate unique invoice_number
    const invoiceNumber = generateInvoiceNumber();

    // Insert transaction record (type='TOPUP', description='Top Up balance')
    await connection.query(
      'INSERT INTO transactions (user_id, invoice_number, transaction_type, total_amount, description, created_on) VALUES (?, ?, ?, ?, ?, NOW())',
      [userId, invoiceNumber, 'TOPUP', top_up_amount, 'Top Up balance']
    );

    // Commit transaction
    await connection.commit();
    connection.release();

    // Return updated balance with exact Swagger format
    return successResponse(
      res,
      200,
      'Top Up Balance berhasil',
      { balance: newBalance }
    );

  } catch (error) {
    console.error('Topup error:', error);
    
    // Rollback transaction if connection exists
    if (connection) {
      await connection.rollback();
      connection.release();
    }

    return invalidParameterResponse(
      res,
      400,
      'Paramter amount hanya boleh angka dan tidak boleh lebih kecil dari 0'
    );
  }
};

/**
 * POST /transaction
 * Create payment transaction
 * 
 * Private Endpoint (Requires Auth)
 * Request Body: { service_code }
 * Response: { status: 0, message: "Transaksi berhasil", data: { invoice_number, service_code, service_name, transaction_type, total_amount, created_on } }
 */
const transaction = async (req, res) => {
  let connection;
  
  try {
    // Get user email from req.user
    const userEmail = req.user.email;
    const { service_code } = req.body;

    // Validate service_code
    if (!service_code) {
      return invalidParameterResponse(
        res,
        400,
        'Service ataus Layanan tidak ditemukan'
      );
    }

    // Query user_id from users table
    const [users] = await pool.query(
      'SELECT id FROM users WHERE email = ?',
      [userEmail]
    );

    if (users.length === 0) {
      return invalidParameterResponse(
        res,
        400,
        'User not found'
      );
    }

    const userId = users[0].id;

    // Use database transaction with getConnection()
    connection = await pool.getConnection();
    await connection.beginTransaction();

    // SELECT balance FOR UPDATE (lock row)
    const [balanceRows] = await connection.query(
      'SELECT balance FROM balances WHERE user_id = ? FOR UPDATE',
      [userId]
    );

    if (balanceRows.length === 0) {
      await connection.rollback();
      connection.release();
      return invalidParameterResponse(
        res,
        400,
        'Balance not found'
      );
    }

    const currentBalance = Number(balanceRows[0].balance);

    // Query service by service_code
    const [serviceRows] = await connection.query(
      'SELECT service_code, service_name, service_tariff FROM services WHERE service_code = ?',
      [service_code]
    );

    // Check if service exists (error 102 if not found)
    if (serviceRows.length === 0) {
      await connection.rollback();
      connection.release();
      return invalidParameterResponse(
        res,
        400,
        'Service ataus Layanan tidak ditemukan'
      );
    }

    const service = serviceRows[0];
    const serviceTariff = Number(service.service_tariff);

    // Check if balance >= service_tariff (error if insufficient)
    if (currentBalance < serviceTariff) {
      await connection.rollback();
      connection.release();
      return invalidParameterResponse(
        res,
        400,
        'Service ataus Layanan tidak ditemukan'
      );
    }

    // Update balance: balance = balance - service_tariff
    await connection.query(
      'UPDATE balances SET balance = balance - ? WHERE user_id = ?',
      [serviceTariff, userId]
    );

    // Generate unique invoice_number
    const invoiceNumber = generateInvoiceNumber();

    // Insert transaction record (type='PAYMENT', service_code, description=service_name)
    await connection.query(
      'INSERT INTO transactions (user_id, invoice_number, transaction_type, service_code, total_amount, description, created_on) VALUES (?, ?, ?, ?, ?, ?, NOW())',
      [userId, invoiceNumber, 'PAYMENT', service.service_code, serviceTariff, service.service_name]
    );

    // Get created_on timestamp
    const [transactionRows] = await connection.query(
      'SELECT created_on FROM transactions WHERE invoice_number = ?',
      [invoiceNumber]
    );

    // Commit transaction
    await connection.commit();
    connection.release();

    // Format created_on to ISO string
    const createdOn = transactionRows[0].created_on;
    const createdOnISO = createdOn instanceof Date 
      ? createdOn.toISOString() 
      : new Date(createdOn).toISOString();

    // Return transaction details with exact Swagger format
    return successResponse(
      res,
      200,
      'Transaksi berhasil',
      {
        invoice_number: invoiceNumber,
        service_code: service.service_code,
        service_name: service.service_name,
        transaction_type: 'PAYMENT',
        total_amount: serviceTariff,
        created_on: createdOnISO
      }
    );

  } catch (error) {
    console.error('Transaction error:', error);

    // Rollback transaction if connection exists
    if (connection) {
      await connection.rollback();
      connection.release();
    }

    return invalidParameterResponse(
      res,
      400,
      'Service ataus Layanan tidak ditemukan'
    );
  }
};

/**
 * GET /transaction/history
 * Get transaction history with pagination
 * 
 * Private Endpoint (Requires Auth)
 * Query Params: offset (optional, default 0), limit (optional, return all if not provided)
 * Response: { status: 0, message: "Get History Berhasil", data: { offset, limit, records: [...] } }
 */
const getTransactionHistory = async (req, res) => {
  try {
    // Get user email from req.user
    const userEmail = req.user.email;

    // Query user_id from users table
    const [users] = await pool.query(
      'SELECT id FROM users WHERE email = ?',
      [userEmail]
    );

    if (users.length === 0) {
      return invalidParameterResponse(
        res,
        400,
        'User not found'
      );
    }

    const userId = users[0].id;

    // Parse offset and limit from query params (offset default 0, limit optional)
    const offset = parseInt(req.query.offset) || 0;
    const limit = req.query.limit ? parseInt(req.query.limit) : null;

    // Query transactions using raw SQL with ORDER BY created_on DESC
    let query;
    let params;

    if (limit !== null && limit !== undefined) {
      // If limit provided: use LIMIT and OFFSET
      query = 'SELECT invoice_number, transaction_type, description, total_amount, created_on FROM transactions WHERE user_id = ? ORDER BY created_on DESC LIMIT ? OFFSET ?';
      params = [userId, limit, offset];
    } else {
      // If limit not provided: return all records
      query = 'SELECT invoice_number, transaction_type, description, total_amount, created_on FROM transactions WHERE user_id = ? ORDER BY created_on DESC';
      params = [userId];
    }

    const [transactions] = await pool.query(query, params);

    // Format transactions with exact Swagger format
    // Record fields: invoice_number, transaction_type, description, total_amount, created_on
    const records = transactions.map(transaction => {
      const createdOn = transaction.created_on;
      const createdOnISO = createdOn instanceof Date 
        ? createdOn.toISOString() 
        : new Date(createdOn).toISOString();

      return {
        invoice_number: transaction.invoice_number,
        transaction_type: transaction.transaction_type,
        description: transaction.description,
        total_amount: Number(transaction.total_amount),
        created_on: createdOnISO
      };
    });

    // Return exact Swagger format with offset, limit, and records array
    return successResponse(
      res,
      200,
      'Get History Berhasil',
      {
        offset: offset,
        limit: limit !== null ? limit : records.length,
        records: records
      }
    );

  } catch (error) {
    console.error('Get transaction history error:', error);
    return invalidParameterResponse(
      res,
      400,
      'Error getting transaction history'
    );
  }
};

// Export all controller functions
module.exports = {
  getBalance,
  topup,
  transaction,
  getTransactionHistory
};