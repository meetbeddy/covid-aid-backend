const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  admin: { type: Boolean, default: false },
  password: { type: String, required: true },
});

module.exports = mongoose.model("User", userSchema);
