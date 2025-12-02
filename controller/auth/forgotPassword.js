const { User } = require("../../models/auth");
const { otpHandler } = require("../../utils/otpHandler");
const jwt = require("jsonwebtoken");
const { OTP } = require("../../models/otp");
const bcrypt = require("bcrypt");const bcrypt = require("bcrypt");

async function handleResetPassMail(req, res, next) {
    /*
        find user with the given email
        if not found return with error
        if found generate an otp and send it to the email
        add rate limiting
    */

    const {email} = req.body;
    try{
      const user = await User.findOne({email});

      if(!user){
        return res.status(400).json({
            success: false,
            message: "No account associated with the given email"
        })
      }

      const now = new Date();
      const expiresInMs = 5 * 60 * 1000; // 5 minutes
      const fiveMinutesAgo = new Date(now.getTime() - expiresInMs);

      // Find the most recent OTP created in the last 5 minutes
      const recentOtp = await OTP.findOne({
        user: user._id,
        createdAt: { $gte: fiveMinutesAgo },
      }).sort({ createdAt: -1 });

      if (recentOtp) {
        const timeLapsed = now - recentOtp.createdAt;
        const secondsLeft = Math.ceil((expiresInMs - timeLapsed) / 1000);
        return res.status(400).json({
          success: false,
          message: `Try again in ${secondsLeft} seconds`,
        });
      }

      await otpHandler(email, user.name);

      
      return res.status(200).json({
        success:true,
        message:"Password reset mail sent successfully",
      })
    }
    catch(e){
        next(e);
    }
}


async function verifyOtp(req,res,next) {
  /*
  check if the otp is valid 
  mark the otp as used
  create a password reset token 
  return the token and success response
  */
  try{
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
              message: "Otp expired. Please try resetting the password again."
          });
      }

      const match = await bcrypt.compare(otp, otpResponse.hashedOtp);
      if (match) {
        otpResponse.isUsed = true;
        const payload = {email, isPassResetToken:true}
        const token = jwt.sign(payload,process.env.JWT_SECRET, {expiresIn:"5m"});
        return res.status(200).json({
          success:true,
          message:"Otp verified, enter a new password",
          token
        })
      }
    }catch(e){
      next(e);
    }
}

module.exports = {handleResetPassMail, verifyResetPassOtp:verifyOtp}