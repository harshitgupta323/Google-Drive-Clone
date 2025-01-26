const { request } = require("express");
const singleFile = require("../models/singlefile");

const fileShare = async (req, res, next) => {
  try {
    const file_details = req.body;
    console.log(req.body.fileName);
    if (file_details == null) {
      res.json({ err: "Error sharing document 1" });
    } else {
        console.log("in share file block");
      const file = new singleFile({
        fileName: req.body.fileName,
        filePath: req.body.filePath,
        fileType: req.body.fileType,
        fileVerifiedStatus: false,
        fileSize: fileSizeCoverter(req.body.fileSize, 2),
        fileUserid: req.body.fileUserid, //one who is uploading document
        fileIPaddress: process.env.IP_address
      });
      await file
        .save()
        .then((response) => {
          console.log("Document saved Sucessfully :)");
          res.json({
            status: "success",
            message: "Document saved Sucessfully",
          });
        })
        .catch(() => {
          console.log("In catch also, Document saved Falied :( ");
          res.json({
            status: "failed",
            message: "Document saved Failed",
          });
        });
    }
  } catch (err) {
    console.log("inside error");
    console.log(err);
  }
};

const fileSizeCoverter = (bytes, dec) => {
  if (bytes == 0) {
    return "0 Bytes";
  }
  const d = dec || 2;
  const size = ["Bytes", "KB", "MB", "GB"];
  const idx = Math.floor(Math.log(bytes) / Math.log(1000));
  return parseFloat((bytes / Math.pow(1000, idx)).toFixed(d)) + " " + size[idx];
};

module.exports = { fileShare };
