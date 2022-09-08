const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userModels = mongoose.Schema({
  isAdmin : {type: "boolean", required:"true", default: false},
  lastname: { type: "string", required: "true"},
  firstname: { type: "string", required: "true"},
  email: { type: "string", required: "true", unique: true },
  password: { type: "string", required: "true" },
});

userModels.plugin(uniqueValidator);
module.exports = mongoose.model("User", userModels);