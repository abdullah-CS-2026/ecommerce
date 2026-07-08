const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes — verifies JWT from cookies and attaches full user to req.user
exports.protect = async (req, res, next) => {
  console.log("Cookies:", req.cookies);

  let token;

  if (req.cookies && req.cookies.token) {
    try {
      token = req.cookies.token;

      console.log("Token Found");

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      console.log("Decoded:", decoded);

      req.user = await User.findById(decoded.id).select("-password");

      console.log("User:", req.user);

      if (!req.user) {
        return res.status(401).json({
          message: "User not found"
        });
      }

      next();
    } catch (err) {
      console.log(err);
      return res.status(401).json({
        message: err.message
      });
    }
  } else {
    console.log("No Cookie Received");
    return res.status(401).json({
      message: "No Token"
    });
  }
};

// Admin only — must come after protect
exports.adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Admins only' });
  }
};
