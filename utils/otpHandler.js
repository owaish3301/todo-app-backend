const crypto = require("crypto");
const bcrypt = require("bcrypt");
const { OTP } = require("./../models/otp");
const { SendEmail } = require("./mailService/sendEmails");
const { User } = require("../models/auth");

const otpGenerator = (length = 6) => {
  const max = 10 ** length;
  const n = crypto.randomInt(0, max);
  return String(n).padStart(length, "0");
};

const otpHandler = async (to, name) => {
  try {
    // Generate OTP
    const n = otpGenerator();
    if (!n) throw new Error("Error generating OTP");

    // Hash OTP
    const hash = await bcrypt.hash(n, 10);

    // Get user
    const userResponse = await User.findOne({ email: to });
    if (!userResponse) throw new Error("User not found");

    // Save OTP in DB (with expiry)
    const otp = new OTP({
      hashedOtp: hash,
      user: userResponse._id
    });

    const response = await otp.save();
    if (!response) throw new Error("Error saving OTP");

    // Send email
    const OtpSubject = "OTP Verification";
    const OtpText = `Hey ${name}! ${n} is your OTP for your Doable account. It is valid for the next 5 minutes. Please do not share it with anyone.\n\nRegards,\nDoable`;

    await SendEmail(to, OtpSubject, OtpText);

  } catch (err) {
    throw err; 
  }
};

module.exports = { otpHandler };
