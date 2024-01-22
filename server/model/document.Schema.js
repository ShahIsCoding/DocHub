const mongoose = require("mongoose");

const documentUsers = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
  },
  type: {
    type: String,
  },
  data: {
    type: String,
  },
  users: [
    {
      type: ObjectId,
      ref: "user",
    },
  ],
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("document", documentUsers);
