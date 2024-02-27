const mongoose = require("mongoose");
const { DOCUMENT } = require("../constants");
const Schema = mongoose.Schema;
const { v4: uuidv4 } = require("uuid");
const documentUsers = new Schema(
  {
    _id: {
      type: String,
      default: () => DOCUMENT + ":" + uuidv4(),
      unique: true,
    },
    name: {
      type: String,
      default: "Untitled Document",
    },
    type: {
      type: String,
    },
    data: {
      type: Array,
    },
    users: [
      {
        type: String,
        ref: "User",
      },
    ],
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: false, // Disable the _id field
    versionKey: false, // Disable the __v field
  }
);

module.exports = mongoose.model("Document", documentUsers);
