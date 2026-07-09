const axios = require("axios");

const sendEmail = async ({ email, subject, message }) => {
  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "ElectroDigital",
          email: process.env.EMAIL_FROM,
        },
        to: [
          {
            email,
          },
        ],
        subject,
        htmlContent: `
          <h2>ElectroMart</h2>
          <p>${message}</p>
        `,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Email Sent");
    console.log(response.data);

    return response.data;
  } catch (err) {
    console.error("❌ Brevo API Error");

    if (err.response) {
      console.error(err.response.data);
    } else {
      console.error(err.message);
    }

    throw err;
  }
};

module.exports = sendEmail;