let mongoose = require("mongoose");

let user = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  connected: {
    type: Boolean,
    default: false,
  },
});
let userModel = new mongoose.model("User", user);
module.exports = { userModel };
