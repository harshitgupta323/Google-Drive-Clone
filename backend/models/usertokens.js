const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userTokensSchema = new mongoose.Schema({
  email: String,
  accesstoken: String,
  refreshtoken: String,
});

module.exports = mongoose.model("UserTokens", userTokensSchema);
