const { Timestamp } = require("mongodb");
const mongoose = require("mongoose");
const singlefile = require("./singlefile");

const healthcareProfessionalsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  email: { type: String, required: true },
  documents: {
    type: Array,
    required: true,
  },
  type:{ type: String },
  contact:{type : Number}
});

module.exports = mongoose.model(
  "healthcareProfessionals",
  healthcareProfessionalsSchema
);
