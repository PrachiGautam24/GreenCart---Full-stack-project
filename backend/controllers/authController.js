import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { sanitizeEmail, sanitizeUsername, sanitizeString } from '../utils/sanitize.js';

/**
 * Generate JWT token
 * @param {string} userId - User ID to encode in token
 * @returns {string} JWT token
 */
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '24h'
  });
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req, res) => {
  try {
    let { username, email, password, role, city } = req.body;

    // Validate required fields
    if (!username || !email || !password || !city) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Please provide all required fields: username, email, password, city',
          code: 'MISSING_FIELDS'
        }
      });
    }

    // Sanitize inputs
    try {
      username = sanitizeUsername(username);
      email = sanitizeEmail(email);
      city = sanitizeString(city);
    } catch (sanitizeError) {
      return res.status(400).json({
        success: false,
        error: {
          message: sanitizeError.message,
          code: 'INVALID_INPUT'
        }
      });
    }

    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Password must be at least 6 characters long',
          code: 'WEAK_PASSWORD'
        }
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      const field = existingUser.email === email ? 'email' : 'username';
      return res.status(400).json({
        success: false,
        error: {
          message: `User with this ${field} already exists`,
          code: 'USER_EXISTS'
        }
      });
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password,
      role: role || 'buyer',
      city
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          city: user.city,
          profileImage: user.profileImage
        }
      }
    });
  } catch (error) {
    console.error('Register error:', error);

    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: {
          message: messages.join(', '),
          code: 'VALIDATION_ERROR'
        }
      });
    }

    res.status(500).json({
      success: false,
      error: {
        message: 'Error registering user',
        code: 'REGISTRATION_ERROR'
      }
    });
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res) => {
  try {
    let { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Please provide email and password',
          code: 'MISSING_CREDENTIALS'
        }
      });
    }

    // Sanitize email input
    try {
      email = sanitizeEmail(email);
    } catch (sanitizeError) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Invalid email format',
          code: 'INVALID_INPUT'
        }
      });
    }

    // Find user and include password field
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Invalid credentials',
          code: 'INVALID_CREDENTIALS'
        }
      });
    }

    // Check password
    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Invalid credentials',
          code: 'INVALID_CREDENTIALS'
        }
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          city: user.city,
          profileImage: user.profileImage
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Error logging in',
        code: 'LOGIN_ERROR'
      }
    });
  }
};

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'User not found',
          code: 'USER_NOT_FOUND'
        }
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          city: user.city,
          profileImage: user.profileImage,
          createdAt: user.createdAt
        }
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Error fetching profile',
        code: 'PROFILE_ERROR'
      }
    });
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
export const updateProfile = async (req, res) => {
  try {
    let { username, email, city, profileImage } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'User not found',
          code: 'USER_NOT_FOUND'
        }
      });
    }

    // Sanitize inputs
    try {
      if (username) username = sanitizeUsername(username);
      if (email) email = sanitizeEmail(email);
      if (city) city = sanitizeString(city);
      if (profileImage) profileImage = sanitizeString(profileImage);
    } catch (sanitizeError) {
      return res.status(400).json({
        success: false,
        error: {
          message: sanitizeError.message,
          code: 'INVALID_INPUT'
        }
      });
    }

    // Check if username or email is being changed to an existing one
    if (username && username !== user.username) {
      const existingUsername = await User.findOne({ username });
      if (existingUsername) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Username already taken',
            code: 'USERNAME_EXISTS'
          }
        });
      }
      user.username = username;
    }

    if (email && email !== user.email) {
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Email already in use',
            code: 'EMAIL_EXISTS'
          }
        });
      }
      user.email = email;
    }

    // Update other fields
    if (city) user.city = city;
    if (profileImage !== undefined) user.profileImage = profileImage;

    await user.save();

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          city: user.city,
          profileImage: user.profileImage
        }
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);

    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: {
          message: messages.join(', '),
          code: 'VALIDATION_ERROR'
        }
      });
    }

    res.status(500).json({
      success: false,
      error: {
        message: 'Error updating profile',
        code: 'UPDATE_ERROR'
      }
    });
  }
};

/**
 * @desc    Upgrade user to seller
 * @route   POST /api/auth/become-seller
 * @access  Private
 */
export const becomeSeller = async (req, res) => {
  try {
    const {
      businessName,
      businessDescription,
      businessAddress,
      phoneNumber,
      taxId,
      bankAccountNumber,
      bankName
    } = req.body;

    // Validate required fields
    if (!businessName || !businessDescription || !businessAddress || !phoneNumber || !taxId || !bankAccountNumber || !bankName) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required business information'
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user is already a seller
    if (user.role === 'seller' || user.role === 'admin') {
      return res.status(400).json({
        success: false,
        message: 'User already has seller access'
      });
    }

    // Sanitize inputs
    const sanitizedData = {
      businessName: sanitizeString(businessName),
      businessDescription: sanitizeString(businessDescription),
      businessAddress: sanitizeString(businessAddress),
      phoneNumber: sanitizeString(phoneNumber),
      taxId: sanitizeString(taxId),
      bankAccountNumber: sanitizeString(bankAccountNumber),
      bankName: sanitizeString(bankName)
    };

    // Update user role and add seller information
    user.role = 'seller';
    user.sellerInfo = sanitizedData;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Successfully upgraded to seller account',
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          city: user.city,
          profileImage: user.profileImage,
          sellerInfo: user.sellerInfo
        }
      }
    });
  } catch (error) {
    console.error('Become seller error:', error);
    res.status(500).json({
      success: false,
      message: 'Error upgrading to seller account'
    });
  }
};
