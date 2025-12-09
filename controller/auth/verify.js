const { User } = require("../../models/auth");

async function verify(req,res,next){
    const {email} = req.decoded;

    const user = await User.findOne({email});
    if(!user){
        return res
        .status(400)
        .clearCookie("token")
        .json({
            success: false,
            message: "Account not found"
        })
    }
    return res
    .status(200)
    .json({
        success: true,
        message: "Verified"
    })
}
module.exports = {verify}