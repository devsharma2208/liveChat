let mongoose = require("mongoose");

let notification = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  read: {
    type: Boolean,
    default: false,
  },
});
let notificationModel = new mongoose.model("Notification", notification);

module.exports = { notificationModel };
