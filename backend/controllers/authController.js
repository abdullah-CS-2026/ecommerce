const User = require('../models/User');
const TempUser = require("../models/TempUser")
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");
const sendEmail = require('../utils/sendEmail');

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
console.log("STEP 1");
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please fill all fields.",
      });
    }

    // Check if account already exists
    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });
    console.log("STEP 2");

    if (existingUser) {
      return res.status(400).json({
        message: "Email is already registered.",
      });
    }

    // Check temporary signup
    let tempUser = await TempUser.findOne({
      email: email.toLowerCase(),
    });

    console.log("STEP 3");
    // Generate OTP
    const otpCode = generateOTP();

    const otpExpiry = new Date(
      Date.now() + 10 * 60 * 1000
    );

    console.log(
      `\n🔐 OTP for ${email}: ${otpCode}\n`
    );

    // Hash password BEFORE storing
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(
      password,
      salt
    );
console.log("STEP 4");
    if (tempUser) {
      tempUser.name = name; 
      tempUser.password = hashedPassword;
      tempUser.otpCode = otpCode;
      tempUser.otpExpiry = otpExpiry;

      await tempUser.save();
    } else {
      tempUser = await TempUser.create({
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        otpCode,
        otpExpiry,
      });
    }
    await tempUser.save()

    const message = `Your ElectroMart verification code is: ${otpCode}

This OTP is valid for 10 minutes.`;

 console.log("📧 About to send email...");
console.log("STEP 6");
await sendEmail({
  email: tempUser.email,
  subject: "ElectroMart Email Verification",
  message,
});

console.log("STEP 7");
console.log("✅ sendEmail() finished");

return res.status(200).json({
  success: true,
  email: tempUser.email,
  message: "OTP has been sent successfully.",
});


  } catch (error) {
    console.error("REGISTER ERROR");
    console.error(error);

    return res.status(500).json({
        message: error.message,
        error
    });
}
};

exports.verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Find temporary user
    const tempUser = await TempUser.findOne({
      email: email.toLowerCase(),
    });

    if (!tempUser) {
      return res.status(404).json({
        message:
          "Registration session expired. Please register again.",
      });
    }

    // Check OTP
    if (tempUser.otpCode !== otp.toString()) {
      return res.status(400).json({
        message: "Invalid OTP.",
      });
    }

    // Check expiry
    if (tempUser.otpExpiry < new Date()) {
      await TempUser.deleteOne({
        _id: tempUser._id,
      });

      return res.status(400).json({
        message:
          "OTP expired. Please register again.",
      });
    }

    // Safety check
    const existingUser = await User.findOne({
      email: tempUser.email,
    });

    if (existingUser) {
      await TempUser.deleteOne({
        _id: tempUser._id,
      });

      return res.status(400).json({
        message: "User already exists.",
      });
    }

    // Create verified user
    const user = await User.create({
      name: tempUser.name,
      email: tempUser.email,
      password: tempUser.password,
      role: "user",
    });

    // Delete temporary user
    await TempUser.deleteOne({
      _id: tempUser._id,
    });

    // Generate JWT
    const token = generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Email verified successfully.",
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Verification failed.",
    });
  }
};

exports.resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    // Find temporary user
    const tempUser = await TempUser.findOne({
      email: email.toLowerCase(),
    });

    if (!tempUser) {
      return res.status(404).json({
        message: "Registration session expired. Please register again.",
      });
    }

    // Generate new OTP
    const otpCode = generateOTP();

    tempUser.otpCode = otpCode;
    tempUser.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    await tempUser.save();

    console.log(`\n🔐 New OTP for ${tempUser.email}: ${otpCode}\n`);

    const message = `Your new ElectroMart verification code is: ${otpCode}

This OTP is valid for 10 minutes.`;

    await sendEmail({
      email: tempUser.email,
      subject: "ElectroMart Email Verification",
      message,
    });

    return res.status(200).json({
      message: "A new OTP has been sent successfully.",
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to resend OTP.",
    });
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
