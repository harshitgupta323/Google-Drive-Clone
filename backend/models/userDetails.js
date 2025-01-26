const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

//email handler
const nodemailer = require("nodemailer");

//unique string
const { v4: uuidv4 } = require("uuid");

require("dotenv").config();

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    validate: {
      validator: async function (email) {
        const user = await this.constructor.findOne({ email });
        if (user) {
          if (this.id === user.id) {
            return true;
          }
          return false;
        }
        return true;
      },
      message: (props) => "EMail Already in Use",
    },
    unique: true,
  },
  password: { type: String, required: true },
  jwttoken: { type: String },
});

userSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    bcrypt.hash(this.password, 8, (err, hash) => {
      if (err) return next(err);
      this.password = hash;
      next();
    });
  }
});

module.exports = mongoose.model("Users", userSchema);
