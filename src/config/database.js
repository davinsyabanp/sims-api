const mysql = require('mysql2/promise');
require('dotenv').config();

// Database connection pool configuration
const poolConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'sims_ppob_db',
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
};

// Create connection pool
const pool = mysql.createPool(poolConfig);

// Test database connection on startup
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully');
    console.log(`📊 Connected to database: ${poolConfig.database}`);
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error('Error:', error.message);
    console.error('Configuration:', {
      host: poolConfig.host,
      port: poolConfig.port,
      user: poolConfig.user,
      database: poolConfig.database
    });
    return false;
  }
}

// Test connection on startup
testConnection().catch((error) => {
  console.error('Failed to test database connection:', error);
});

// Handle pool errors
pool.on('connection', (connection) => {
  console.log(`🔗 New MySQL connection established (ID: ${connection.threadId})`);
});

pool.on('error', (error) => {
  console.error('❌ MySQL Pool Error:', error);
  if (error.code === 'PROTOCOL_CONNECTION_LOST') {
    console.error('Database connection was closed.');
  }
  if (error.code === 'ER_CON_COUNT_ERROR') {
    console.error('Database has too many connections.');
  }
  if (error.code === 'ECONNREFUSED') {
    console.error('Database connection was refused.');
  }
});

// Export pool for use in controllers
module.exports = pool;