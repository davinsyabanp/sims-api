const pool = require('../config/database');
const { successResponse, invalidParameterResponse } = require('../utils/response');
const { generateInvoiceNumber, validateAmount } = require('../utils/helpers');

const getBalance = async (req, res) => {
  try {
    const userEmail = req.user.email;

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

const topup = async (req, res) => {
  let connection;
  
  try {
    if (!req.body) {
      return invalidParameterResponse(
        res,
        400,
        'Paramter amount hanya boleh angka dan tidak boleh lebih kecil dari 0'
      );
    }

    const userEmail = req.user.email;
    const { top_up_amount } = req.body;

    if (!validateAmount(top_up_amount)) {
      return invalidParameterResponse(
        res,
        400,
        'Paramter amount hanya boleh angka dan tidak boleh lebih kecil dari 0'
      );
    }

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

    connection = await pool.getConnection();
    await connection.beginTransaction();

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

    await connection.query(
      'UPDATE balances SET balance = balance + ? WHERE user_id = ?',
      [top_up_amount, userId]
    );

    const invoiceNumber = generateInvoiceNumber();

    await connection.query(
      'INSERT INTO transactions (user_id, invoice_number, transaction_type, total_amount, description, created_on) VALUES (?, ?, ?, ?, ?, NOW())',
      [userId, invoiceNumber, 'TOPUP', top_up_amount, 'Top Up balance']
    );

    await connection.commit();
    connection.release();

    return successResponse(
      res,
      200,
      'Top Up Balance berhasil',
      { balance: newBalance }
    );

  } catch (error) {
    console.error('Topup error:', error);
    
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

const transaction = async (req, res) => {
  let connection;
  
  try {
    const userEmail = req.user.email;
    
    if (!req.body) {
      return invalidParameterResponse(
        res,
        400,
        'Service ataus Layanan tidak ditemukan'
      );
    }
    
    const { service_code } = req.body || {};

    if (!service_code) {
      return invalidParameterResponse(
        res,
        400,
        'Service ataus Layanan tidak ditemukan'
      );
    }

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

    connection = await pool.getConnection();
    await connection.beginTransaction();

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

    const [serviceRows] = await connection.query(
      'SELECT service_code, service_name, service_tariff FROM services WHERE service_code = ?',
      [service_code]
    );

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

    if (currentBalance < serviceTariff) {
      await connection.rollback();
      connection.release();
      return invalidParameterResponse(
        res,
        400,
        'Service ataus Layanan tidak ditemukan'
      );
    }

    await connection.query(
      'UPDATE balances SET balance = balance - ? WHERE user_id = ?',
      [serviceTariff, userId]
    );

    const invoiceNumber = generateInvoiceNumber();

    await connection.query(
      'INSERT INTO transactions (user_id, invoice_number, transaction_type, service_code, total_amount, description, created_on) VALUES (?, ?, ?, ?, ?, ?, NOW())',
      [userId, invoiceNumber, 'PAYMENT', service.service_code, serviceTariff, service.service_name]
    );

    const [transactionRows] = await connection.query(
      'SELECT created_on FROM transactions WHERE invoice_number = ?',
      [invoiceNumber]
    );

    await connection.commit();
    connection.release();

    const createdOn = transactionRows[0].created_on;
    const createdOnISO = createdOn instanceof Date 
      ? createdOn.toISOString() 
      : new Date(createdOn).toISOString();

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

const getTransactionHistory = async (req, res) => {
  try {
    const userEmail = req.user.email;

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

    const offset = parseInt(req.query.offset) || 0;
    const limit = req.query.limit ? parseInt(req.query.limit) : null;

    let query;
    let params;

    if (limit !== null && limit !== undefined) {
      query = 'SELECT invoice_number, transaction_type, description, total_amount, created_on FROM transactions WHERE user_id = ? ORDER BY created_on DESC LIMIT ? OFFSET ?';
      params = [userId, limit, offset];
    } else {
      query = 'SELECT invoice_number, transaction_type, description, total_amount, created_on FROM transactions WHERE user_id = ? ORDER BY created_on DESC';
      params = [userId];
    }

    const [transactions] = await pool.query(query, params);

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

module.exports = {
  getBalance,
  topup,
  transaction,
  getTransactionHistory
};