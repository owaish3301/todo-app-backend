const jwt = require("jsonwebtoken");

const verifyToken = (req,res,next) => {
    /*
    get the token from the cookie
    check if the token is verified
    if yes next
    else unauthorised
    */
    const token = req.cookies.token;
    
    if(!token){
        return res.status(400).json({
            success: false,
            message: "Try logging in again"
        })
    };

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.decoded = decoded;
        next();
        
    }catch(e){
        return res.status(400).clearCookie("token", {
          httpOnly: true,
          secure: false,
          sameSite: "lax"
        });
    }
}

module.exports={verifyToken};