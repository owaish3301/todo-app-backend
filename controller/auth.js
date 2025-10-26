const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User } = require("./../models/auth");
const { otpHandler } = require("../utils/otpHandler");
const { OTP } = require("../models/otp");

const saltRounds = 10;

const signupHandler = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.findOne({ email });

    // Case 1: user exists but not verified yet
    // TODO: fix race condition if two request comes at the same time they might pass the otp rate limits
    if (user && user.verified === false) {
      // Find latest OTP for this user
      const latestOtp = await OTP.findOne({ user: user._id, isUsed: false }).sort({ createdAt: -1 });
      if (latestOtp) {
        const now = Date.now();
        const otpCreated = latestOtp.createdAt.getTime();
        const expiresInMs = 5 * 60 * 1000; // 5 minutes
        const timeLapsed = now - otpCreated;
        if (timeLapsed < expiresInMs) {
          const secondsLeft = Math.ceil((expiresInMs - timeLapsed) / 1000);
          return res.status(400).json({
            success: false,
            message: `Try again in ${secondsLeft} seconds`
          });
        }
      }
      const hash = await bcrypt.hash(password, saltRounds);
      user.name = name;
      user.passwordHash = hash;
      await user.save();
      await otpHandler(email, name);
      return res.status(200).json({
        success: true,
        message: "Account created successfully",
        verified: user.verified,
      });
    }

    // Case 2: user exists and verified
    if (user) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    // Case 3: new user
    const hash = await bcrypt.hash(password, saltRounds);
    const newUser = new User({
      name,
      email,
      passwordHash: hash,
      verified: false,
    });
    const response = await newUser.save();
    await otpHandler(email, name);
    return res.status(200).json({
      success: true,
      message: "Please submit the OTP sent to your email to verify your account.",
      verified: response.verified,
    });
  } catch (err) {
    throw new Error("An internal server error occured")
  }
};

module.exports = { signUp: signupHandler };