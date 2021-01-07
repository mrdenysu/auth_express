const { Schema, model } = require("mongoose");

const User = new Schema({
  phone: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  roles: [{ type: String, ref: "Role" }],
});

module.exports = model("User", User);
