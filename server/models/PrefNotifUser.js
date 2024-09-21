  const mongoose = require('mongoose');
  const projectChannelSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true,
      },
      projectName: {
        type: String,
        required: true
      },
      title: { type: Boolean, default: true },
      participants: { type: Boolean, default: true },
      guests: { type: Boolean, default: true },
      deadline: { type: Boolean, default: true },
      brief: { type: Boolean, default: true },
      attached: { type: Boolean, default: true },
      submits: { type: Boolean, default: true },
      callbacks: { type: Boolean, default: true },
  });
  
  const PrefNotifUserSchema = new mongoose.Schema({
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
    generalChannels: {
        users: { type: Boolean, default: true },
        projects: { type: Boolean, default: true },
        systemNotifications: { type: Boolean, default: true },
      },
    projectChannels: {
        type: Map,
        of: projectChannelSchema,
        default: {},
    },
  });
  
  
  module.exports = PrefNotifUserSchema;  