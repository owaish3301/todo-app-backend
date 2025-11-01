const {
  nameSchema,
  emailSchema,
  passwordSchema,
} = require("../validation/auth");


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
}

// const validateSignUpInputs = (req, res, next) => {
//   const { name, email, password } = req.body;

//   const nameResult = nameSchema.safeParse(name);
//   const emailResult = emailSchema.safeParse(email);
//   const passwordResult = passwordSchema.safeParse(password);

//   if (!nameResult.success) {
//     return res.status(400).json({
//       success: false,
//       message: nameResult.error.issues[0]?.message || "Invalid name input",
//     });
//   }
//   if (!emailResult.success) {
//     return res.status(400).json({
//       success: false,
//       message: emailResult.error.issues[0]?.message || "Invalid email address",
//     });
//   }
//   if (!passwordResult.success) {
//     return res.status(400).json({
//       success: false,
//       message: passwordResult.error.issues[0]?.message || "Invalid password",
//     });
//   }

//   next();
// };

module.exports = { validateEmailAndPassword, validateNameInput};
