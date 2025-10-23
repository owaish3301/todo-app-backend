const {
  nameSchema,
  emailSchema,
  passwordSchema,
} = require("../validation/auth");

const { ZodError } = require("zod");



const validateSignUpInputs = (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    nameSchema.parse(name);
    emailSchema.parse(email);
    passwordSchema.parse(password);

    next();
  } catch (e) {
    if (e instanceof ZodError) {
      const firstErrorMessage = e._zod.def[0].message;
      return res.status(400).json({
        success: false,
        message: firstErrorMessage,
      });
    }

    // TODO: save error log
    // TODO: raise error from here and let the global catch handle it
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred during validation.",
    });
  }
};

module.exports = { validateSignUpInputs };
