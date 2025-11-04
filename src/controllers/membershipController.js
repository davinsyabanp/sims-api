const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');
const { successResponse, invalidParameterResponse, invalidCredentialsResponse } = require('../utils/response');
const { validateEmail, validatePassword } = require('../utils/helpers');

const registration = async (req, res) => {
  try {
    if (!req.body) {
      console.log('Registration: req.body is undefined');
      return invalidParameterResponse(
        res,
        400,
        'Paramter email tidak sesuai format'
      );
    }

    console.log('Registration request body:', JSON.stringify(req.body));

    const { email, password, first_name, last_name } = req.body;

    // Check if fields are missing or empty (handle empty strings and whitespace)
    if (!email || typeof email !== 'string' || email.trim() === '') {
      console.log('Registration: email is missing or empty');
      return invalidParameterResponse(
        res,
        400,
        'Paramter email tidak sesuai format'
      );
    }

    if (!password || typeof password !== 'string' || password.trim() === '') {
      console.log('Registration: password is missing or empty');
      return invalidParameterResponse(
        res,
        400,
        'Password minimal 8 karakter'
      );
    }

    if (!first_name || typeof first_name !== 'string' || first_name.trim() === '') {
      console.log('Registration: first_name is missing or empty');
      return invalidParameterResponse(
        res,
        400,
        'Paramter email tidak sesuai format'
      );
    }

    if (!last_name || typeof last_name !== 'string' || last_name.trim() === '') {
      console.log('Registration: last_name is missing or empty');
      return invalidParameterResponse(
        res,
        400,
        'Paramter email tidak sesuai format'
      );
    }

    // Trim whitespace from inputs
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const trimmedFirstName = first_name.trim();
    const trimmedLastName = last_name.trim();

    // Validate email format
    if (!validateEmail(trimmedEmail)) {
      console.log('Registration: email format is invalid:', trimmedEmail);
      return invalidParameterResponse(
        res,
        400,
        'Paramter email tidak sesuai format'
      );
    }

    // Validate password length (min 8 characters)
    if (!validatePassword(trimmedPassword)) {
      console.log('Registration: password length is invalid');
      return invalidParameterResponse(
        res,
        400,
        'Password minimal 8 karakter'
      );
    }

    const [existingUsers] = await pool.query(
      'SELECT id FROM users WHERE email = ?',
      [trimmedEmail]
    );

    if (existingUsers.length > 0) {
      console.log('Registration: email already exists:', trimmedEmail);
      return invalidParameterResponse(
        res,
        400,
        'Paramter email tidak sesuai format'
      );
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(trimmedPassword, saltRounds);

    await pool.query(
      'INSERT INTO users (email, first_name, last_name, password) VALUES (?, ?, ?, ?)',
      [trimmedEmail, trimmedFirstName, trimmedLastName, hashedPassword]
    );

    console.log('Registration: user created successfully:', trimmedEmail);

    return successResponse(
      res,
      200,
      'Registrasi berhasil silahkan login',
      null
    );

  } catch (error) {
    console.error('Registration error:', error);
    
    if (error.code === 'ER_DUP_ENTRY') {
      return invalidParameterResponse(
        res,
        400,
        'Paramter email tidak sesuai format'
      );
    }

    return invalidParameterResponse(
      res,
      400,
      'Paramter email tidak sesuai format'
    );
  }
};

const login = async (req, res) => {
  try {
    if (!req.body) {
      return invalidParameterResponse(
        res,
        400,
        'Paramter email tidak sesuai format'
      );
    }

    const { email, password } = req.body;

    if (!email || !password) {
      return invalidParameterResponse(
        res,
        400,
        'Paramter email tidak sesuai format'
      );
    }

    if (!validateEmail(email)) {
      return invalidParameterResponse(
        res,
        400,
        'Paramter email tidak sesuai format'
      );
    }

    if (!validatePassword(password)) {
      return invalidParameterResponse(
        res,
        400,
        'Paramter email tidak sesuai format'
      );
    }

    const [users] = await pool.query(
      'SELECT id, email, password FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return invalidCredentialsResponse(
        res,
        401,
        'Username atau password salah'
      );
    }

    const user = users[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return invalidCredentialsResponse(
        res,
        401,
        'Username atau password salah'
      );
    }

    const token = jwt.sign(
      { email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '12h' }
    );

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

const getProfile = async (req, res) => {
  try {
    const userEmail = req.user.email;

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

const updateProfile = async (req, res) => {
  try {
    if (!req.body) {
      return invalidParameterResponse(
        res,
        400,
        'Paramter email tidak sesuai format'
      );
    }

    const userEmail = req.user.email;
    const { first_name, last_name } = req.body;

    if (!first_name || !last_name) {
      return invalidParameterResponse(
        res,
        400,
        'Paramter email tidak sesuai format'
      );
    }

    await pool.query(
      'UPDATE users SET first_name = ?, last_name = ? WHERE email = ?',
      [first_name, last_name, userEmail]
    );

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

const updateProfileImage = async (req, res) => {
  try {
    const userEmail = req.user.email;

    if (!req.file) {
      return invalidParameterResponse(
        res,
        400,
        'Format Image tidak sesuai'
      );
    }

    const filename = req.file.filename;
    const appUrl = process.env.APP_URL || 'http://localhost:3000';
    const imageUrl = `${appUrl}/uploads/${filename}`;

    await pool.query(
      'UPDATE users SET profile_image = ? WHERE email = ?',
      [imageUrl, userEmail]
    );

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

module.exports = {
  registration,
  login,
  getProfile,
  updateProfile,
  updateProfileImage
};