const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userModels = mongoose.Schema({
  isAdmin : {type: "boolean", require:"true", default: false},
  lastname: { type: "string", require: "true"},
  firstname: { type: "string", require: "true"},
  email: { type: "string", require: "true", unique: true },
  password: { type: "string", require: "true" },
});

userModels.plugin(uniqueValidator);
module.exports = mongoose.model("User", userModels);