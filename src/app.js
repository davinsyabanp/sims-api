require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const fs = require('fs');

// Import routes
const routes = require('./routes/index');

// Initialize Express app
const app = express();

// Security middleware - Helmet helps secure Express apps by setting HTTP headers
app.use(helmet());

// CORS middleware - Enable Cross-Origin Resource Sharing
app.use(cors());

// Body parser middleware - Parse JSON request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve static files from uploads directory
// Access files at: http://localhost:3000/uploads/filename.jpg
app.use('/uploads', express.static(uploadsDir));

// API routes
app.use('/', routes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 0,
    message: 'Server is running',
    data: {
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    }
  });
});

// Handle 404 - Route not found
app.use((req, res) => {
  res.status(404).json({
    status: 102,
    message: 'Route not found',
    data: null
  });
});

// Global error handler middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);

  // Multer errors (file upload)
  if (err instanceof require('multer').MulterError) {
    return res.status(400).json({
      status: 102,
      message: 'Format Image tidak sesuai',
      data: null
    });
  }

  // JWT errors (handled by auth middleware, but catch here as fallback)
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({
      status: 108,
      message: 'Token tidak tidak valid atau kadaluwarsa',
      data: null
    });
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      status: 102,
      message: err.message || 'Invalid input',
      data: null
    });
  }

  // Database errors
  if (err.code && err.code.startsWith('ER_')) {
    console.error('Database error:', err);
    return res.status(500).json({
      status: 102,
      message: 'Database error occurred',
      data: null
    });
  }

  // Default error handler
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({
    status: 102,
    message: message,
    data: null
  });
});

// Get port from environment variable or use default
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Start server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log('='.repeat(60));
    console.log('🚀 SIMS PPOB API Server Started');
    console.log('='.repeat(60));
    console.log(`📍 Server running on port: ${PORT}`);
    console.log(`🌍 Environment: ${NODE_ENV}`);
    console.log(`⏰ Started at: ${new Date().toISOString()}`);
    console.log(`📁 Uploads directory: ${uploadsDir}`);
    console.log('='.repeat(60));
  });
}

// Export app for testing
module.exports = app;