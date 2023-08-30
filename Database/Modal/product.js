const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    title: { type: String },
    desc: { type: String },
  },
  { timestamps: true }
);

const Post = mongoose.models.Post || mongoose.model("Post", postSchema);

module.exports = Post;
