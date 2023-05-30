const Post = require("../models/post");
const Category = require("../models/category");
const image = require("../utils/image");
const mongoose = require("mongoose");

const createPost = async (req, res) => {
  try {
    const { title, content, category, path } = req.body;
    if (!category) {
      return res.status(400).send({
        message: "The category is required",
      });
    }
    const existingCategory = await Category.findOne({ _id: category });
    if (!existingCategory) {
      return res.status(400).send({
        message: "Selected category does not exist",
      });
    }
    const post = new Post({
      title,
      content,
      category,
      path,
    });
    if (!req.files.miniature) {
      return res.status(400).send({
        message: "The miniature is required",
      });
    }
    const imagePath = image.getFilePath(req.files.miniature);
    post.miniature = imagePath;
    const postStored = await post.save();
    if (!postStored) {
      return res.status(400).send({
        message: "Post could not be saved",
      });
    }
    res.status(200).send({
      post: postStored,
    });
  } catch (error) {
    res.status(500).send({
      message: "Server error",
    });
  }
};

const getPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    if (isNaN(pageNumber) || isNaN(limitNumber)) {
      return res.status(400).send({
        message: "Pagination parameters should be valid numbers",
      });
    }
    const options = {
      page: pageNumber,
      limit: limitNumber,
      sort: { date: "desc" },
    };
    const posts = await Post.paginate({}, options);
    if (!posts || posts.totalPages === 0) {
      return res.status(404).send({
        message: "No post has been found",
      });
    }
    res.status(200).send({
      posts,
    });
  } catch (error) {
    res.status(500).send({
      message: "Server error",
    });
  }
};

const getPost = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).send({
        message: "Post id is required",
      });
    }
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).send({
        message: "No post has been found",
      });
    }
    res.status(200).send({
      post,
    });
  } catch (error) {
    res.status(500).send({
      message: "Server error",
    });
  }
};

const getPostsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    if (!mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).send({
        message: "Category id is invalid",
      });
    }
    const posts = await Post.find({ category });
    if (!posts || posts.length === 0) {
      return res.status(404).send({
        message: "No posts for this category have been found",
      });
    }
    res.status(200).send({
      posts,
    });
  } catch (error) {
    res.status(500).send({
      message: "Server error while obtaining posts by category",
    });
  }
};

const getPostsBySearch = async (req, res) => {
  try {
    const { search } = req.params;
    if (!search) {
      return res.status(400).send({
        message: "Search param is required",
      });
    }
    const posts = await Post.find({
      $or: [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ],
    });
    if (posts.length === 0) {
      return res.status(404).send({
        message: "No posts for the param search have been found",
      });
    }
    res.status(200).send({
      posts,
    });
  } catch (error) {
    res.status(500).send({
      message: "Server error while obtaining posts by search parameter",
    });
  }
};

const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).send({
        message: "Post id is required",
      });
    }
    const updates = req.body;
    const post = await Post.findByIdAndUpdate(id, updates, { new: true });
    if (!post) {
      return res.status(404).send({
        message: "No post has been found",
      });
    }
    res.status(200).send({ message: "Post has been successfully updated" });
  } catch (error) {
    res.status(500).send({
      message: "Server error while updating post",
    });
  }
};

const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).send({
        message: "Post id is required",
      });
    }
    const deletedPost = await Post.findByIdAndDelete(id);
    if (!deletedPost) {
      return res.status(404).send({
        message: "No post has been found",
      });
    }
    res.status(200).send({
      message: "Post has been successfully deleted",
    });
  } catch (error) {
    res.status(500).send({
      message: "Server error while deleting post",
    });
  }
};

module.exports = {
  createPost,
  getPosts,
  getPost,
  getPostsByCategory,
  getPostsBySearch,
  updatePost,
  deletePost,
};
