const transporter = require("../config/mail");

const sendEmail = async ({ email, subject, message }) => {
  console.log("========== EMAIL START ==========");
  console.log("EMAIL_USER:", process.env.EMAIL_USER);
  console.log("EMAIL_FROM:", process.env.EMAIL_FROM);
  console.log("EMAIL_PASS exists:", !!process.env.EMAIL_PASS);

  console.log("Sending to:", email);

  const info = await transporter.sendMail({
    from: `"ElectroMart" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject,
    text: message,
  });

  console.log("EMAIL SENT");
  console.log(info);

  return info;
};

module.exports = sendEmail;