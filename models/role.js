const mongoose = require("mongoose");

const roleModel = mongoose.Schema({
  name: {
    type: String,
    required: "{PATH} is required",
    unique: true
  },
  permission: {
    type: Number,
    default: 2
  }
});

module.exports = mongoose.model("Role", roleModel);
