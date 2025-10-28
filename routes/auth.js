const express = require("express");
const { validateSignUpInputs } = require("../middlewares/signup");
const { signUp } = require("../controller/signup");
const { validateOtpInput } = require("../middlewares/otp");
const {  otpController } = require("../controller/otp");


const Router = express.Router();

Router.post("/signup", validateSignUpInputs, signUp);
Router.post("/verifyOtp", validateOtpInput, otpController);


module.exports = {authRouter:Router};