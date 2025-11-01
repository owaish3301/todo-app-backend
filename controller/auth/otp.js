const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const { User } = require("../../models/auth");
const { OTP } = require("../../models/otp");

const otpController = async (req, res, next) => {
    const session = await User.startSession();
    
    try {
        /*
        get the hashed otp and email
        find the otp associated with that email
        verify the otp and mark as used
        update the user collection mark as verified
        create a payload
        sign the jwt
        set the cookie
        return the response
        */
        const now = new Date();
        const expiresInMs = 5 * 60 * 1000; // 5 minutes
        const fiveMinutesAgo = new Date(now.getTime() - expiresInMs);

        const { email, otp } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found with this email"
            });
        }

        const otpResponse = await OTP.findOne({
            user: user._id,
            createdAt: { $gte: fiveMinutesAgo },
            isUsed: false
        }).sort({ createdAt: -1 });

        if (!otpResponse) {
            return res.status(400).json({
                success: false,
                message: "Please generate an otp for your email first by signing up"
            });
        }

        const match = await bcrypt.compare(otp, otpResponse.hashedOtp);
        if (match) {
            await session.startTransaction();

            try {
                otpResponse.isUsed = true;
                user.verified = true;

                await otpResponse.save({ session });
                await user.save({ session });

                await session.commitTransaction();

                const payload = {
                    name: user.name,
                    email: user.email
                }
                const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });

                return res
                    .cookie("token", token, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === "production",
                        sameSite: "strict",
                        maxAge: 24 * 60 * 60 * 1000
                    })
                    .status(200)
                    .json({
                        success: true,
                        message: "Account created",
                        user: payload
                    });
            } catch (transactionError) {
                // Rollback transaction on error
                await session.abortTransaction();
                throw transactionError;
            }
        } else {
            return res.status(400).json({
                success: false,
                message: "OTP didn't match! Please recheck your email and try again"
            });
        }
        // TODO: needs extensive checking for error handling
    } catch (err) {
        // next(new Error("An internal server error occurred"));
        next(err)
    } finally {
        // End the session
        await session.endSession();
    }
}

module.exports = {otpController}