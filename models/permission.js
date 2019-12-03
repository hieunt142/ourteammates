const mongoose = require("mongoose");

const permissionModel = mongoose.Schema({
  name: {
    type: String,
    required: "{PATH} is required",
    unique: true
  },
  bit: {
    type: Number,
    required: "{PATH} is required",
    unique: true
  }
});

module.exports = mongoose.model("Permission", permissionModel);
