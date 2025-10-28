const { otpSchema } = require("./../validation/otp");
const { emailSchema } = require("./../validation/auth");

const validateOtpInput = (req,res,next) => {
    const {otp, email} = req.body;
    try{
        const isValidOtp = otpSchema.safeParse(otp);
        const isValidEmail = emailSchema.safeParse(email);

        if(!isValidOtp.success){
            return res.status(400).json({
                success: false,
                message: isValidOtp.error.issues[0]?.message || "Invalid otp"
            })
        }
        if(!isValidEmail.success){
            return res.status(400).json({
                success: false,
                message: isValidEmail.error.issues[0]?.message || "Invalid email"
            })
        }

        next();
    }
    // TODO: extensive error handling review needed
    catch(e){
        // next(new Error("An internal server error occurred"));
        next(e)
    }
}


// TODO: Add attempt tracking per otp middleware

module.exports = { validateOtpInput };