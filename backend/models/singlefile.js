const { Timestamp } = require("mongodb");
const mongoose = require("mongoose");

const singlefileSchema = new mongoose.Schema(
  {
    fileName: { type: String, required: true },
    filePath: { type: String, required: true },
    fileType: { type: String, required: true },
    fileSize: { type: String, required: true },
    fileUserid: { type: String, required: true },
    fileVerifiedStatus: { type: Boolean, required: true },
    fileVerfifying_HO_name: { type: String },
    fileVerfifying_HO_id: { type: String },
    fileIPaddress:{type: String},
    
  },
  { timestamps: true }
);

module.exports = mongoose.model("singleDocuments", singlefileSchema);
