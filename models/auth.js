const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  verfied : {
    type: Boolean,
    default: false,
  }
});

const User = mongoose.model("users", UserSchema);

module.exports = { User };