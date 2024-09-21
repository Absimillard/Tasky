const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  type: {
    type: String,
  },
  object: {
    type: String,
    enum: ["users", "projects", "system"],
  },
  content: {
    relatedId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserNotif',
      required: true,
    },
    message:{
      type: String,
      required: true,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  read: {
    status: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date, // You can use Date type for storing timestamps
    },
  },
  dismissed: {
    type: Boolean,
    default: false,
  },
});
notificationSchema.pre('save', function(next) {
  if (this.read.status && !this.read.readAt) {
    this.read.readAt = new Date();
  }
  next();
});


module.exports = notificationSchema;
