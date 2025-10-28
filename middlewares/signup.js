const {
  nameSchema,
  emailSchema,
  passwordSchema,
} = require("../validation/auth");

const { ZodError } = require("zod");


const validateSignUpInputs = (req, res, next) => {
  const { name, email, password } = req.body;

  const nameResult = nameSchema.safeParse(name);
  const emailResult = emailSchema.safeParse(email);
  const passwordResult = passwordSchema.safeParse(password);

  if (!nameResult.success) {
    return res.status(400).json({
      success: false,
      message: nameResult.error.errors[0].message,
    });
  }
  if (!emailResult.success) {
    return res.status(400).json({
      success: false,
      message: emailResult.error.errors[0].message,
    });
  }
  if (!passwordResult.success) {
    return res.status(400).json({
      success: false,
      message: passwordResult.error.errors[0].message,
    });
  }

  next();
};

module.exports = { validateSignUpInputs };
