const mongoose = require('mongoose');

const projectMessagingSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
  messages: [{
    type: new mongoose.Schema({
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assuming you have a User model
        required: true,
      },
      content: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    }, { _id: false })  // Disable _id generation for embedded schema
  }],
});

module.exports = mongoose.model('ProjectNotification', projectMessagingSchema);
