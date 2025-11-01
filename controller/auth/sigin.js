const { User } = require("../../models/auth");

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
    const user = await User.findOne({email});

    /*
    users may not be verified by otp
    hence check user.verified
    case 1:
        verified user -> let them signin
        unverified user -> let them signin normally 
        but send back the verified is false flag
             for the frontend to be able to detect it and handle on client side
    */
   } catch(e){
    next(e)
   }
}