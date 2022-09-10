const mongoose = require("mongoose");

const postsModels = mongoose.Schema({
  userId: { type: mongoose.Schema.ObjectId, required: true },
  postText: { type: String, required: true },
  date: { type: Date, required: true },
  imageUrl: { type: String },
  likes: { type: Number, default: 0 },
  usersLiked: { type: Array, default: [] },
});

module.exports = mongoose.model("Posts", postsModels);
