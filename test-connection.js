const pool = require('./src/config/database');
require('dotenv').config();

/**
 * Test database connection
 */
async function testConnection() {
  let connection;
  
  try {
    console.log('='.repeat(60));
    console.log('🔌 Testing MySQL Database Connection');
    console.log('='.repeat(60));
    console.log('');
    
    // Display connection configuration
    console.log('📋 Connection Configuration:');
    console.log(`   Host: ${process.env.DB_HOST || 'localhost'}`);
    console.log(`   Port: ${process.env.DB_PORT || 3306}`);
    console.log(`   User: ${process.env.DB_USER || 'root'}`);
    console.log(`   Database: ${process.env.DB_NAME || 'sims_ppob_db'}`);
    console.log('');
    
    // Test connection
    console.log('🔄 Attempting to connect...');
    connection = await pool.getConnection();
    
    console.log('✅ Connection successful!');
    console.log(`   Thread ID: ${connection.threadId}`);
    console.log('');
    
    // Get database version
    const [versionRows] = await connection.query('SELECT VERSION() as version');
    console.log('📊 MySQL Version:', versionRows[0].version);
    console.log('');
    
    // List all tables
    console.log('📋 Listing all tables:');
    console.log('-'.repeat(60));
    
    const [tables] = await connection.query(
      `SELECT TABLE_NAME 
       FROM information_schema.TABLES 
       WHERE TABLE_SCHEMA = ? 
       ORDER BY TABLE_NAME`,
      [process.env.DB_NAME || 'sims_ppob_db']
    );
    
    if (tables.length === 0) {
      console.log('   ⚠️  No tables found in database');
    } else {
      console.log(`   Found ${tables.length} table(s):`);
      tables.forEach((table, index) => {
        console.log(`   ${index + 1}. ${table.TABLE_NAME}`);
      });
    }
    console.log('');
    
    // Count records in each table
    if (tables.length > 0) {
      console.log('📊 Record counts per table:');
      console.log('-'.repeat(60));
      
      for (const table of tables) {
        try {
          const [countRows] = await connection.query(
            `SELECT COUNT(*) as count FROM ??`,
            [table.TABLE_NAME]
          );
          const count = countRows[0].count;
          console.log(`   ${table.TABLE_NAME.padEnd(20)} : ${count} record(s)`);
        } catch (error) {
          console.log(`   ${table.TABLE_NAME.padEnd(20)} : Error - ${error.message}`);
        }
      }
      console.log('');
    }
    
    // Get table information
    if (tables.length > 0) {
      console.log('📋 Table details:');
      console.log('-'.repeat(60));
      
      for (const table of tables) {
        try {
          const [columns] = await connection.query(
            `SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_KEY 
             FROM information_schema.COLUMNS 
             WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?
             ORDER BY ORDINAL_POSITION`,
            [process.env.DB_NAME || 'sims_ppob_db', table.TABLE_NAME]
          );
          
          if (columns.length > 0) {
            console.log(`\n   Table: ${table.TABLE_NAME}`);
            console.log(`   Columns (${columns.length}):`);
            columns.forEach(col => {
              const nullable = col.IS_NULLABLE === 'YES' ? 'NULL' : 'NOT NULL';
              const key = col.COLUMN_KEY ? `[${col.COLUMN_KEY}]` : '';
              console.log(`     - ${col.COLUMN_NAME.padEnd(20)} ${col.DATA_TYPE.padEnd(15)} ${nullable.padEnd(10)} ${key}`);
            });
          }
        } catch (error) {
          console.log(`   Error getting details for ${table.TABLE_NAME}: ${error.message}`);
        }
      }
      console.log('');
    }
    
    // Release connection
    connection.release();
    
    console.log('='.repeat(60));
    console.log('✅ Test completed successfully!');
    console.log('='.repeat(60));
    
    // Close pool
    await pool.end();
    process.exit(0);
    
  } catch (error) {
    console.log('='.repeat(60));
    console.log('❌ Connection failed!');
    console.log('='.repeat(60));
    console.log('');
    console.log('Error Details:');
    console.log(`   Code: ${error.code || 'N/A'}`);
    console.log(`   Message: ${error.message}`);
    console.log('');
    
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('💡 Suggestion: Check your database username and password in .env file');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.log('💡 Suggestion: Database does not exist. Run the schema.sql file first');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('💡 Suggestion: MySQL server is not running or wrong host/port');
    } else if (error.code === 'ETIMEDOUT') {
      console.log('💡 Suggestion: Connection timeout. Check your network and MySQL server status');
    }
    
    console.log('');
    console.log('='.repeat(60));
    
    if (connection) {
      connection.release();
    }
    
    await pool.end();
    process.exit(1);
  }
}

// Run the test
testConnection();

