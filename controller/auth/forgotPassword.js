const { User } = require("../../models/auth");
const { otpHandler } = require("../../utils/otpHandler");
const jwt = require("jsonwebtoken");

async function handleResetPassMail(req, res, next) {
    /*
        find user with the given email
        if not found return with error
        if found generate an otp and send it to the email, also generate a token
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


module.exports = {handleResetPassMail}