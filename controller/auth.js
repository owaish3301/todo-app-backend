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
    if (user && user.verified === false) {
      // Atomic check for recent OTPs to prevent race conditions
      const now = new Date();
      const expiresInMs = 5 * 60 * 1000; // 5 minutes
      const fiveMinutesAgo = new Date(now.getTime() - expiresInMs);
      
      // Find the most recent OTP created in the last 5 minutes
      const recentOtp = await OTP.findOne({
        user: user._id,
        createdAt: { $gte: fiveMinutesAgo }
      }).sort({ createdAt: -1 });

      if (recentOtp) {
        const timeLapsed = now - recentOtp.createdAt;
        const secondsLeft = Math.ceil((expiresInMs - timeLapsed) / 1000);
        return res.status(400).json({
          success: false,
          message: `Try again in ${secondsLeft} seconds`
        });
      }
      const hash = await bcrypt.hash(password, saltRounds);
      user.name = name;
      user.passwordHash = hash;
      await user.save();
      await otpHandler(email, name);
      return res.status(200).json({
        success: true,
        message:
          "Please submit the OTP sent to your email to verify your account.",
        verified: user.verified,
      });
    }

    // Case 2: user exists and verified
    if (user) {
      return res.status(400).json({
        success: false,
        message: "Account already exists",
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
      message: "Please submit the OTP sent to your email to verify your account",
      verified: response.verified,
    });
  } catch (err) {
    throw new Error("An internal server error occured")
  }
};

module.exports = { signUp: signupHandler };