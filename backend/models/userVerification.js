const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userVerificationSchema = new mongoose.Schema({
  userId: String,
  uniqueString: String,
  createdAt: Date,
  expiresAt: Date,
});

module.exports = mongoose.model("UserVerification", userVerificationSchema);
