const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { User }  = require("./../models/auth");
const { otpHandler } = require("../utils/otpHandler");

const saltRounds = 10;

const signupHandler = async (req,res) => {
    /*
        check if email already exists
        password hash with salt and crypto
        save stuff in db
        trigger an otp for the mail
        respond back
    */

    const { name, email, password } = req.body;
    const emailCheck = await User.findOne({ email: email });

    if (emailCheck) {
        if (emailCheck.verified === false) {
            // Update the existing unverified user with new name and password
            bcrypt.hash(password, saltRounds, async function (err, hash) {
                if (err) {
                    throw new Error("Error while hashing password");
                }


                emailCheck.name = name;
                emailCheck.passwordHash = hash;
                await emailCheck.save();

                otpHandler(to=email, name=name);

                return res.status(200).json({
                  success: true,
                  message: "Account created successfully",
                  verified: emailCheck.verified,
                });
            });
            return;
        } else {
            // existing verified user
            return res.status(400).json({
                success: false,
                message: "Email already exists"
            });
        }
    } else {
        bcrypt.hash(password, saltRounds, async function (err, hash) {
            if (err) {
                throw new Error("Error while hashing password");
            }
            
            const user = new User({ name, email, passwordHash: hash, verified: false });
            const response = await user.save();
            if (response) {
                otpHandler((to = email), (name = name));
                return res.status(200).json({
                    success: true,
                    message: "Account created successfully",
                    verified: response.verified
                });
            } else {
                throw new Error("An error occured while creating account")
            }
        });
    }
};

module.exports = {signUp : signupHandler};