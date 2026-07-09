const transporter = require("../config/mail");

const sendEmail = async ({ email, subject, message }) => {
  console.log("📧 Sending email...");
  console.log("To:", email);

  try {
    const info = await transporter.sendMail({
      from: `"ElectroMart" <${process.env.EMAIL_USER}>`,
      to: email,
      subject,
      text: message,
      html: `
        <h2>ElectroMart</h2>
        <p>${message}</p>
      `,
    });

    console.log("✅ Email sent successfully");
    console.log(info);

    return info;
  } catch (err) {
    console.error("❌ EMAIL ERROR");
    console.error(err);

    throw err;
  }
};

module.exports = sendEmail;