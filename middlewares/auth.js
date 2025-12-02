const {
  nameSchema,
  emailSchema,
  passwordSchema,
} = require("../validation/auth");

function validateEmail(req,res,next){
  const {email} = req.body;
  const emailResult = emailSchema.safeParse(email);
  if(!emailResult.success){
    return res.status(400).json({
      success: false,
      message: emailResult.error.issues[0]?.message || "Invalid email address",
    });
  }
  next();
}

function validateEmailAndPassword(req,res,next){
  const { email, password } = req.body;

  const emailResult = emailSchema.safeParse(email);
  const passwordResult = passwordSchema.safeParse(password);

  if (!emailResult.success) {
    return res.status(400).json({
      success: false,
      message: emailResult.error.issues[0]?.message || "Invalid email address",
    });
  }
  if (!passwordResult.success) {
    return res.status(400).json({
      success: false,
      message: passwordResult.error.issues[0]?.message || "Invalid password",
    });
  }

  next();
}

function validateNameInput(req,res,next){
  const {name} = req.body;
  const nameResult = nameSchema.safeParse(name);
  if (!nameResult.success) {
    return res.status(400).json({
      success: false,
      message: nameResult.error.issues[0]?.message || "Invalid name input",
    });
  }
  next();
}

module.exports = { validateEmailAndPassword,validateEmail, validateNameInput};
