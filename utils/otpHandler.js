const crypto = require('crypto');
const bcrypt = require('bcrypt');

const OTP = require("./../models/otp");
const { SendEmail } = require("./mailService/sendEmails");

const otpGenerator = (length = 6) => {
    const max = 10 ** length;
    const n = crypto.randomInt(0,max);
    return String(n).padStart(length, "0");
}


const otpHandler = (to, name) => {
    /*
        generate otp
        hash otp
        save hashed otp to db with automatic expiry in 5 min
        send email
    */
    const n = otpGenerator();
    if(!n) throw new Error("An error occured while generating OTP");

    bcrypt.hash(n, 10, async (err, hash)=>{
        if(err) throw new Error("An error occured while hashing the OTP");
        const otp = new OTP({hashedOtp : hash});
        const response = await otp.save();

        if(response){
            // send mail
            const OtpSubject = "OTP Verification";
            const OtpText = `Hey ${name}! ${n} is OTP for your Doable account. It is valid for next 5 minutes only. Please donot share it with anyone.\n\nRegards,\nDoable`;

            try{
                SendEmail(to,OtpSubject, OtpText);
            }
            catch(e){
                throw new Error("An error occured while sending e-mail for otp verfication")
            }
        }
        else{
            throw new Error("An error occured while generating OTP")
        }
    })

};


module.exports = { otpHandler }