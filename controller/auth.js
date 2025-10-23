const jwt = require("jsonwebtoken");
const { User }  = require("./../models/auth");

const signupHandler = async (req,res) => {
    /*
        check if email already exists
        password hash with salt and crypto
        save stuff in db
        generate jwt token
        set cookie 
        respond back
    */

    const { name, email, password } = req.body;
    const emailCheck = await User.findOne({email:email});
    console.log(emailCheck)
};

module.exports = {signUp : signupHandler};