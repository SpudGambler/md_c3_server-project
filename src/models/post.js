const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const PostSchema = new mongoose.Schema({
  title: String,
  miniature: String,
  content: String,
  created_at: { type: Date, default: Date.now },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  path: {
    type: String,
    unique: true,
  },
});

PostSchema.plugin(mongoosePaginate);
const Post = mongoose.model("Post", PostSchema);
module.exports = Post;
