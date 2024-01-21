const mongoose = require("mongoose");
const userAuthSchema = new mongoose.Schema({
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
});

module.exports = mongoose.model("userAuth", userAuthSchema);
