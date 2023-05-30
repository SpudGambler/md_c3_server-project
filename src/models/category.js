const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  photo: String,
  created_at: { type: Date, default: Date.now },
});

CategorySchema.plugin(mongoosePaginate);
const Category = mongoose.model("Category", CategorySchema);
module.exports = Category;
