const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  id: {
    type: String,
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
});

module.exports = mongoose.model("user", userSchema);
