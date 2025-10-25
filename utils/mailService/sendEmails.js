require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASS, 
  },
});

const SendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: `"Doable" <${process.env.GMAIL_USER}>`,
    to,
    subject,
    text,
  };

  await transporter.sendMail(mailOptions);
}

module.exports = { SendEmail };