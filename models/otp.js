const mongoose = require("mongoose");

const otpSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    hashedOtp: {
        type: String,
        required: true
    },
    isUsed: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300 // 5 minutes
    }
}, { timestamps: true })

// TODO: Add attempt tracker for rate limiting

const OTP = mongoose.model("OTP", otpSchema);

module.exports = { OTP };