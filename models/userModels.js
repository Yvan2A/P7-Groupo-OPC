const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userModels = mongoose.Schema({
  isAdmin : {type: Boolean, required:true, default: false},
  lastname: { type: String, required: true},
  firstname: { type: String, required: true},
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

userModels.plugin(uniqueValidator);
module.exports = mongoose.model("User", userModels);