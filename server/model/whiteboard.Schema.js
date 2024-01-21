const mongoose = require("mongoose");

const ObjectId = mongoose.Schema;
const whiteboardSchema = new mongoose.Schema({
  id: {
    type: String,
  },
  users: [
    {
      type: ObjectId,
      ref: "users",
    },
  ],
  elements: { type: String },
});

module.exports = mongoose.model("whiteboard", whiteboardSchema);
