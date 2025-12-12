const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, studentId, password } = req.body;

    // Check if user exists with email
    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      return res.status(400).json({ 
        success: false, 
        message: 'User already exists with this email' 
      });
    }

    // Check if user exists with student ID
    const existingUserByStudentId = await User.findOne({ studentId });
    if (existingUserByStudentId) {
      return res.status(400).json({ 
        success: false, 
        message: 'User already exists with this student ID' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = new User({
      name,
      email,
      studentId,
      password: hashedPassword
    });

    await user.save();

    // Generate token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      studentId: user.studentId,
      role: user.role,
      token
    };

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: userResponse
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Login (can login with either email or student ID)
router.post('/login', async (req, res) => {
  try {
    const { login, password } = req.body; // login can be email or studentId

    if (!login || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide login credentials and password' 
      });
    }

    // Find user by email or student ID
    const user = await User.findOne({
      $or: [
        { email: login },
        { studentId: login }
      ]
    });

    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid login credentials or password' 
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid login credentials or password' 
      });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      studentId: user.studentId,
      role: user.role,
      currentBorrow: user.currentBorrow,
      token
    };

    res.json({
      success: true,
      message: 'Login successful',
      data: userResponse
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Get profile
router.get('/profile', async (req, res) => {
  try {
    // This route should be protected by auth middleware
    const user = await User.findById(req.userId)
      .select('-password')
      .populate('currentBorrow');

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

module.exports = router;