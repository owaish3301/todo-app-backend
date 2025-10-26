const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User } = require("./../models/auth");
const { otpHandler } = require("../utils/otpHandler");

const saltRounds = 10;

const signupHandler = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const emailCheck = await User.findOne({ email });

    // TODO: If otp is not expired yet send back the response with saying to try again in X seconds
    // Case 1: user exists but not verified yet
    if (emailCheck && emailCheck.verified === false) {
      const hash = await bcrypt.hash(password, saltRounds);

      emailCheck.name = name;
      emailCheck.passwordHash = hash;
      await emailCheck.save();

      otpHandler(email, name);

      return res.status(200).json({
        success: true,
        message: "Account created successfully",
        verified: emailCheck.verified,
      });
    }

    // Case 2: user exists and verified
    if (emailCheck) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    // Case 3: new user
    const hash = await bcrypt.hash(password, saltRounds);

    const user = new User({
      name,
      email,
      passwordHash: hash,
      verified: false,
    });

    const response = await user.save();

    otpHandler(email, name);

    return res.status(200).json({
      success: true,
      message: "Account created successfully",
      verified: response.verified,
    });
  } catch (err) {
    throw new Error("An internal server error occured")
  }
};

module.exports = { signUp: signupHandler };