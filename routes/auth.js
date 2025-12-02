const express = require("express");
const { validateEmailAndPassword, validateNameInput, validateEmail } = require("../middlewares/auth");
const { signUp } = require("../controller/auth/signup");
const { signInController } = require("../controller/auth/sigin");
const { validateOtpInput } = require("../middlewares/otp");
const {  otpController } = require("../controller/auth/otp");
const { handleResetPassMail, verifyResetPassOtp } = require("../controller/auth/forgotPassword");


const Router = express.Router();

Router.post("/signup", validateEmailAndPassword, validateNameInput, signUp);
Router.post("/verifyOtp", validateOtpInput, otpController);
Router.post("/signin", validateEmailAndPassword, signInController);
Router.post("/forgotPassword", validateEmail, handleResetPassMail);
Router.post("/verifyResetPassword", validateEmail, verifyResetPassOtp);

module.exports = {authRouter:Router};