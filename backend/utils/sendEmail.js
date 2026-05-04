const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Try port 587 (STARTTLS) first, then fallback to port 465 (SSL)
  const configs = [
    {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: 587,
      secure: false, // STARTTLS
      requireTLS: true,
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
      tls: { rejectUnauthorized: false },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
    },
    {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: 465,
      secure: true, // SSL
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
      tls: { rejectUnauthorized: false },
      connectionTimeout: 10000,
    },
  ];

  const message = {
    from: `${process.env.FROM_NAME || 'ElectroMart'} <${process.env.FROM_EMAIL || process.env.SMTP_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html || `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #2563eb;">ElectroMart Email Verification</h2>
        <p style="color: #555;">${options.message}</p>
        <p style="color: #888; font-size: 12px;">If you did not request this, please ignore this email.</p>
      </div>
    `,
  };

  // Check if credentials are configured
  if (!process.env.SMTP_EMAIL || process.env.SMTP_EMAIL === 'your.email@gmail.com') {
    console.warn('\n⚠️  SMTP credentials not configured in .env — printing OTP to console for development.');
    console.log(`\n--- OTP for ${options.email}: ${options.message.match(/\d{6}/)?.[0] || 'see message below'} ---`);
    console.log(`Full Message: ${options.message}\n`);
    return;
  }

  // Try each config in order
  for (let i = 0; i < configs.length; i++) {
    const config = configs[i];
    const transporter = nodemailer.createTransport(config);
    try {
      console.log(`📨 Attempting to send email via port ${config.port}...`);
      const info = await transporter.sendMail(message);
      console.log(`✅ Email sent to ${options.email} | ID: ${info.messageId}`);
      return; // Success — stop trying
    } catch (err) {
      console.error(`❌ Port ${config.port} failed: ${err.message}`);
      if (i < configs.length - 1) {
        console.log(`🔄 Retrying with port ${configs[i + 1].port}...`);
      }
    }
  }

  // All configs failed — fallback for development
  console.log('\n=== ALL SMTP PORTS BLOCKED (ISP restriction) ===');
  console.log('--- DEVELOPMENT FALLBACK: OTP PRINTED TO CONSOLE ---');
  console.log(`To: ${options.email}`);
  console.log(`Subject: ${options.subject}`);
  console.log(`Message:\n${options.message}`);
  console.log('-----------------------------------------------------\n');
};

module.exports = sendEmail;
