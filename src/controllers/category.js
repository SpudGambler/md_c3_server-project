const Category = require("../models/category");

const createCategory = async (req, res) => {
  try {
    const category = new Category({
      name: req.body.name,
      description: req.body.description,
    });
    const categoryStored = await category.save();
    if (!categoryStored) {
      return res.status(404).send({
        message: "Category could not be saved",
      });
    }
    return res.status(200).send({ category: categoryStored });
  } catch (error) {
    res.status(500).send({
      message: "Server error",
    });
  }
};

const getCategories = async (req, res) => {
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
    const categories = await Category.paginate({}, options);
    if (!categories || categories.totalPages === 0) {
      return res.status(404).send({
        message: "No category has been found",
      });
    }
    return res.status(200).send({
      categories,
    });
  } catch (error) {
    res.status(500).send({
      message: "Server error while obtaining categories",
    });
  }
};

module.exports = { createCategory, getCategories };
