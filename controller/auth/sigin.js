const { User } = require("../../models/auth");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { otpHandler } = require("../../utils/otpHandler");

const signInController = async (req,res,next) => {
    /*
    extract email and plain pass from body
    fetch the original hashed pass from Users collection
    use bcrypt to match the passes
    create a payload
    sign the jwt
    set the cookie
    respond with 200
    */
   try{
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    /*
    users may not be verified by otp
    hence check user.verified
    case 1:
        verified user -> let them signin
        unverified user -> let them signin normally 
        and generate an otp
        but send back the verified is false flag
             for the frontend to be able to detect it and handle on client side
    */

    const match = await bcrypt.compare(password, user.passwordHash);
    if(!match){
        return res.status(400).json({
            success: false,
            message: "Wrong password"
        })
    }
    if (!user.verified) {
      await otpHandler(email, user.name);
    }
    const payload = {
        name: user.name,
        email,
        verified: user.verified,
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });

    return res
        .cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000
        })
        .status(200)
        .json({
            success: true,
            message: "Login Successful",
            user: payload
    });

   } catch(e){
    next(e)
   }
}

module.exports = { signInController };