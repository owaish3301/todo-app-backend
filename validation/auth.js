const { z } = require("zod");

const emailSchema = z.email({
  error: (e) =>
    e.input === undefined ? "Email is required" : "Invalid email address",
});
const nameSchema = z.string({error:(e)=>e.input===undefined ? "Name is required": "Invalid name input"}).min(1, "Name can't be empty.");


const passwordRequirements =
  "(?=.*[a-zA-Z])" + // Must contain a letter
  "(?=.*[0-9])" + // Must contain a number
  "(?=.*[^a-zA-Z0-9])" + // Must contain a symbol
  ".*";

const passwordSchema = z.coerce
  .string({
    error: (e) =>
      e.input === undefined ? "Password is required" : "Invalid password",
  })
  .min(6, "Password must be at least 6 characters long.")
  .regex(
    new RegExp(passwordRequirements),
    "Password must contain at least one letter, one number, and one symbol (e.g., !, @, #)."
  );


module.exports = {emailSchema, nameSchema, passwordSchema};