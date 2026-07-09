const User = require('../models/User');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

// Generate JWT for authenticated sessions
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', {
    expiresIn: '30d',
  });
};

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please add all fields' });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const otpCode = generateOTP();
    // Set expiry to 10 minutes from now
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); 

    // Log OTP for development/testing
    console.log(`\n🔐 OTP Generated for ${email}: ${otpCode}\n`);

    user = await User.create({
      name,
      email,
      password,
      otpCode,
      otpExpiry,
      isEmailVerified: false
    });

    try {
      // Send OTP Email
      const message = `Your ElectroMart verification code is: ${otpCode}. It is valid for 10 minutes.\n\nIf you did not request this, please ignore this email.`;
      
      await sendEmail({
        email: user.email,
        subject: 'ElectroMart - Email Verification OTP',
        message
      });

      res.status(201).json({
        message: 'Registration successful. An OTP has been sent to your email to verify your account.',
        email: user.email
      });

    } catch (err) {
    console.error("EMAIL ERROR");
    console.error(err);

    return res.status(500).json({
        message: err.message
    });
}

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ message: 'Email is already verified' });
    }

    if (user.otpCode !== otp.toString()) {
      return res.status(400).json({ message: 'Invalid OTP code' });
    }

    if (user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }

    // Success
    user.isEmailVerified = true;
    user.otpCode = undefined;
    user.otpExpiry = undefined;
    await user.save();

    const token = generateToken(user._id);
    
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    res.json({
      message: 'Email successfully verified',
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ message: 'Email is already verified' });
    }

    // Generate new OTP
    const otpCode = generateOTP();
    user.otpCode = otpCode;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    
    // Log OTP for development/testing
    console.log(`\n🔐 OTP Resent for ${user.email}: ${otpCode}\n`);
    
    await user.save();

    const message = `Your new ElectroMart verification code is: ${otpCode}. It is valid for 10 minutes.`;
      
    await sendEmail({
      email: user.email,
      subject: 'ElectroMart - New Email Verification OTP',
      message
    });

    res.json({ message: 'A new OTP has been sent to your email.' });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id);
      
      // Set HTTP-only cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
      });

      // No OTP check — log in directly after verifying credentials
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.logout = async (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
