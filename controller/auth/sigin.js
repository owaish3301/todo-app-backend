const signInController = (req,res,next) => {
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
    
   } catch(e){
    next(e)
   }
}