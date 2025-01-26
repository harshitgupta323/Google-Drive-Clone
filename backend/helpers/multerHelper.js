"use strict";
const { builtinModules } = require("module");
const multer = require("multer");
const path = require("path");

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"+req.body.email);
    console.log("its me"+req.body.email);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname
    );
    // console.log(email);
  },
});



var upload = multer({ storage: storage});
module.exports = { upload };
