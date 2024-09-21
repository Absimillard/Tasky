const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
});

module.exports = contentSchema;