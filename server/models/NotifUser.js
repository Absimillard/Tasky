const mongoose = require('mongoose');
const notificationSchema = require("./Notification");
const notifUserSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  privilege: {
    type: String,
    enum: ["user", "admin", "supAdmin"],
    required: true,
  },
  notifPref:{
    projectAll: {
      type: Boolean
    },
    userAll: {
      type: Boolean
    },
  },
  notifications:[notificationSchema]
});


module.exports = notifUserSchema;