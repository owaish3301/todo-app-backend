const express = require("express");
const { validateSignUpInputs } = require("../middlewares/auth");
const { signUp } = require("../controller/auth");


const Router = express.Router();

Router.post("/signup", validateSignUpInputs, signUp);



module.exports = {authRouter:Router};