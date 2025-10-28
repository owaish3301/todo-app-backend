const { z } = require("zod");

// OTP should be a 6-digit number (string or number input)
const otpSchema = z.coerce
  .string({
    error: (e) =>
      e.input === undefined ? "OTP is required" : "Invalid OTP",
  })
  .regex(/^\d{6}$/, "OTP must be a 6 digit number");


module.exports = { otpSchema };