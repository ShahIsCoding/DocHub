const mongoose = require("mongoose");
const { USER } = require("../constants");
const { v4: uuidv4 } = require("uuid");
const userSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => USER + ":" + uuidv4(),
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
    },
    documents: [{ type: String, ref: "Document" }],
  },
  {
    _id: false, // Disable the _id field
    versionKey: false, // Disable the __v field
  }
);

module.exports = mongoose.model("User", userSchema);
