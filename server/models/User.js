const mongoose = require('mongoose');

// Access the 'users' and 'projects' collections
const userSchema = new mongoose.Schema(
    {avatar: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
      min: 5,
    },
    refreshToken: {
      type: String,
      unique: true,
    },
    affiliate: {
      type: String,
      required: true,
    },
    contact: {
      type:String,
    },
    occupation: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["team", "client"],
      default: "team",
      required: true,
    },
    ongoing: [{
      _id: {type: mongoose.Schema.Types.ObjectId, ref: 'Project', require:true}
      }],
    privilege: {
      type: String,
      enum: ["user", "admin", "supAdmin"],
      default: "user",
      required: true,
    },

    registerDate: Date,
    lastSeen: Date,
    
  },
  { timestamps: true }
);


module.exports = userSchema;

/*

const dataUser =
{
    "userID": STRING, // ref dataTeam._ID OR dataClient._ID
    "encours": STRING, // dataProject presence
    "lastSeen": Date,
    "affiliate": STRING,
}

*/