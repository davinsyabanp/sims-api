const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');
const { successResponse, invalidParameterResponse, invalidCredentialsResponse } = require('../utils/response');
const { validateEmail, validatePassword } = require('../utils/helpers');

/**
 * POST /registration
 * Register a new user
 * 
 * Request Body: { email, password, first_name, last_name }
 * Response: { status: 0, message: "Registrasi berhasil silahkan login", data: null }
 */
const registration = async (req, res) => {
  try {
    const { email, password, first_name, last_name } = req.body;

    // Validate required fields
    if (!email || !password || !first_name || !last_name) {
      return invalidParameterResponse(
        res,
        400,
        'Paramter email tidak sesuai format'
      );
    }

    // Validate email format
    if (!validateEmail(email)) {
      return invalidParameterResponse(
        res,
        400,
        'Paramter email tidak sesuai format'
      );
    }

    // Validate password length (min 8 characters)
    if (!validatePassword(password)) {
      return invalidParameterResponse(
        res,
        400,
        'Password minimal 8 karakter'
      );
    }

    // Check if email already exists using raw SQL with prepared statement
    const [existingUsers] = await pool.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return invalidParameterResponse(
        res,
        400,
        'Paramter email tidak sesuai format'
      );
    }

    // Hash password with bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert user to database using raw SQL with prepared statement
    // Trigger will auto-create balance record
    await pool.query(
      'INSERT INTO users (email, first_name, last_name, password) VALUES (?, ?, ?, ?)',
      [email, first_name, last_name, hashedPassword]
    );

    // Return exact Swagger response
    return successResponse(
      res,
      200,
      'Registrasi berhasil silahkan login',
      null
    );

  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle duplicate email error
    if (error.code === 'ER_DUP_ENTRY') {
      return invalidParameterResponse(
        res,
        400,
        'Paramter email tidak sesuai format'
      );
    }

    // Handle other errors
    return invalidParameterResponse(
      res,
      400,
      'Paramter email tidak sesuai format'
    );
  }
};

/**
 * POST /login
 * User login and get JWT token
 * 
 * Request Body: { email, password }
 * Response: { status: 0, message: "Login Sukses", data: { token: "..." } }
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return invalidParameterResponse(
        res,
        400,
        'Paramter email tidak sesuai format'
      );
    }

    // Validate email format
    if (!validateEmail(email)) {
      return invalidParameterResponse(
        res,
        400,
        'Paramter email tidak sesuai format'
      );
    }

    // Validate password length (min 8 characters)
    if (!validatePassword(password)) {
      return invalidParameterResponse(
        res,
        400,
        'Paramter email tidak sesuai format'
      );
    }

    // Get user by email using raw SQL with prepared statement
    const [users] = await pool.query(
      'SELECT id, email, password FROM users WHERE email = ?',
      [email]
    );

    // Check if user exists
    if (users.length === 0) {
      return invalidCredentialsResponse(
        res,
        401,
        'Username atau password salah'
      );
    }

    const user = users[0];

    // Compare password with bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return invalidCredentialsResponse(
        res,
        401,
        'Username atau password salah'
      );
    }

    // Generate JWT token with email in payload, 12h expiry
    const token = jwt.sign(
      { email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '12h' }
    );

    // Return exact Swagger response with token
    return successResponse(
      res,
      200,
      'Login Sukses',
      { token: token }
    );

  } catch (error) {
    console.error('Login error:', error);
    return invalidCredentialsResponse(
      res,
      401,
      'Username atau password salah'
    );
  }
};

/**
 * GET /profile
 * Get user profile
 * 
 * Headers: Authorization: Bearer {token}
 * Response: { status: 0, message: "Sukses", data: { email, first_name, last_name, profile_image } }
 */
const getProfile = async (req, res) => {
  try {
    // Get user email from req.user (from auth middleware)
    const userEmail = req.user.email;

    // Query user data by email using raw SQL with prepared statement
    const [users] = await pool.query(
      'SELECT email, first_name, last_name, profile_image FROM users WHERE email = ?',
      [userEmail]
    );

    if (users.length === 0) {
      return invalidParameterResponse(
        res,
        400,
        'User not found'
      );
    }

    const user = users[0];

    // Return user profile (exclude password) with exact Swagger format
    return successResponse(
      res,
      200,
      'Sukses',
      {
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        profile_image: user.profile_image
      }
    );

  } catch (error) {
    console.error('Get profile error:', error);
    return invalidParameterResponse(
      res,
      400,
      'Error getting profile'
    );
  }
};

/**
 * PUT /profile/update
 * Update user profile (first_name and last_name only)
 * 
 * Headers: Authorization: Bearer {token}
 * Request Body: { first_name, last_name }
 * Response: { status: 0, message: "Update Pofile berhasil", data: { email, first_name, last_name, profile_image } }
 */
const updateProfile = async (req, res) => {
  try {
    // Get user email from req.user
    const userEmail = req.user.email;
    const { first_name, last_name } = req.body;

    // Validate required fields
    if (!first_name || !last_name) {
      return invalidParameterResponse(
        res,
        400,
        'Paramter email tidak sesuai format'
      );
    }

    // Update first_name and last_name only using raw SQL with prepared statement
    await pool.query(
      'UPDATE users SET first_name = ?, last_name = ? WHERE email = ?',
      [first_name, last_name, userEmail]
    );

    // Get updated user data
    const [users] = await pool.query(
      'SELECT email, first_name, last_name, profile_image FROM users WHERE email = ?',
      [userEmail]
    );

    if (users.length === 0) {
      return invalidParameterResponse(
        res,
        400,
        'User not found'
      );
    }

    const user = users[0];

    // Return updated profile with exact Swagger format
    // Note: Swagger message has typo "Update Pofile berhasil" (not "Profile")
    return successResponse(
      res,
      200,
      'Update Pofile berhasil',
      {
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        profile_image: user.profile_image
      }
    );

  } catch (error) {
    console.error('Update profile error:', error);
    return invalidParameterResponse(
      res,
      400,
      'Error updating profile'
    );
  }
};

/**
 * PUT /profile/image
 * Update user profile image
 * 
 * Headers: Authorization: Bearer {token}
 * Request: multipart/form-data with field name "file"
 * Response: { status: 0, message: "Update Profile Image berhasil", data: { email, first_name, last_name, profile_image } }
 */
const updateProfileImage = async (req, res) => {
  try {
    // Get user email from req.user
    const userEmail = req.user.email;

    // Get uploaded file from req.file (multer)
    if (!req.file) {
      return invalidParameterResponse(
        res,
        400,
        'Format Image tidak sesuai'
      );
    }

    const filename = req.file.filename;

    // Build full image URL: APP_URL + /uploads/ + filename
    const appUrl = process.env.APP_URL || 'http://localhost:3000';
    const imageUrl = `${appUrl}/uploads/${filename}`;

    // Update profile_image in database using raw SQL with prepared statement
    await pool.query(
      'UPDATE users SET profile_image = ? WHERE email = ?',
      [imageUrl, userEmail]
    );

    // Get updated user data
    const [users] = await pool.query(
      'SELECT email, first_name, last_name, profile_image FROM users WHERE email = ?',
      [userEmail]
    );

    if (users.length === 0) {
      return invalidParameterResponse(
        res,
        400,
        'User not found'
      );
    }

    const user = users[0];

    // Return updated profile with exact Swagger format
    return successResponse(
      res,
      200,
      'Update Profile Image berhasil',
      {
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        profile_image: user.profile_image
      }
    );

  } catch (error) {
    console.error('Update profile image error:', error);
    return invalidParameterResponse(
      res,
      400,
      'Format Image tidak sesuai'
    );
  }
};

// Export all controller functions
module.exports = {
  registration,
  login,
  getProfile,
  updateProfile,
  updateProfileImage
};