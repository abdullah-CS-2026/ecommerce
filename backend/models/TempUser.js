const mongoose = require("mongoose");

const tempUserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    otpCode: {
      type: String,
      required: true,
    },

    otpExpiry: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Automatically delete TempUser after 15 minutes
tempUserSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 900 }
);

module.exports = mongoose.model("TempUser", tempUserSchema);