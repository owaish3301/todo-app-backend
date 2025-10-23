const { z } = require("zod");

const emailSchema = z.email("Invalid email format.");
const nameSchema = z.string().min(1, "Name can't be empty.");


const passwordRequirements =
  "(?=.*[a-zA-Z])" + // Must contain a letter
  "(?=.*[0-9])" + // Must contain a number
  "(?=.*[^a-zA-Z0-9])" + // Must contain a symbol
  ".*";

const passwordSchema = z
  .string({
    required_error: "Password is required.",
    invalid_type_error: "Password must be a string.",
  })
  .min(6, "Password must be at least 6 characters long.")
  .regex(
    new RegExp(passwordRequirements),
    "Password must contain at least one letter, one number, and one symbol (e.g., !, @, #)."
  );


module.exports = {emailSchema, nameSchema, passwordSchema};