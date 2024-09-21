const mongoose = require("mongoose");
const ProjectSchema = new mongoose.Schema(
  { title: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId, ref: 'User', require:true, 
    },
    createdAt: {
      type: Date,
      default: Date.now,
      unique: true,
    },
    participants: [{
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        joinDate: { type: Date, default: Date.now },
        name: String,
        avatar: String,
        affiliate: String,
        occupation: String,
        role: String,
        notifConfig:[],
    }],
    guests: [{
      name: String,
      email: String,
      joinDate: { type: Date, default: Date.now },
      notifConfig:[],
    }],
    passed: [{
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      joinDate: { type: Date, default: Date.now },
      leaveDate: { type: Date, default: Date.now },
      name: String,
      avatar: String,
      affiliate: String,
      occupation: String,
      role: String,
  }],
    deadline: Date,
    brief: {
      attached: [{
        filePath: String, 
        fileName: String
      }],
      content: String,
    },
    submits: [{
      userID: {type: mongoose.Schema.Types.ObjectId, ref:'participants', require:true},
      attached: [{
        filePath: String, 
        fileName: String
      }],
      content: String,
      update: Date,
      callback: [{
            userID: {type: mongoose.Schema.Types.ObjectId, ref:'participants', require:true},
            attached: [{
              filePath: String, 
              fileName: String
            }],
            content: String,
            majDate: Date,
      }],
    }],
    close: Boolean,
    closeDate: Date, 
  },{ timestamps: true }
);

module.exports = ProjectSchema;

