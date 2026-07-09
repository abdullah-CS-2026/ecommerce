const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },

  connectionTimeout: 60000,
  greetingTimeout: 60000,
  socketTimeout: 60000,
});

transporter.verify((err, success) => {
  if (err) {
    console.error("❌ Mail Error:", err);
  } else {
    console.log("✅ Gmail Connected");
  }
});

module.exports = transporter;