const mongoose = require("mongoose");

const teamSchema = mongoose.Schema({
  name: {
    type: String,
    required: "{PATH} is required"
  },
  codeName: {
    type: String,
    unique: true
  },
  avatar: {
    data: String,
    contentType: String
  },
  leader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Member"
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      unique: true
    }
  ]
});

module.exports = mongoose.model("Team", teamSchema);
