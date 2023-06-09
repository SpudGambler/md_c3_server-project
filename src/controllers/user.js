const bcrypt = require("bcryptjs");
const User = require("../models/user");
const image = require("../utils/image");

const getMe = async (req, res) => {
  try {
    const { user_id } = req.user;
    const response = await User.findById(user_id);
    if (!response) {
      return res.status(400).send({ msg: "No se ha encontrado usuario" });
    }
    res.status(200).send(response);
  } catch (error) {
    res.status(500).send({ msg: "Error del servidor" });
  }
};

const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await User.findById(id);
    if (!response) {
      return res.status(400).send({ msg: "No se ha encontrado usuario" });
    }
    res.status(200).send(response);
  } catch (error) {
    res.status(500).send({ msg: "Error del servidor" });
  }
};

const getUsers = async (req, res) => {
  try {
    const active = req.query;
    let response = null;
    if (active !== undefined) {
      response = await User.find();
    } else {
      response = await User.find({ active: "true" });
    }
    res.status(200).send(response);
  } catch (error) {
    res.status(500).send({ msg: "Error del servidor" });
  }
};

const createUser = async (req, res) => {
  try {
    const userData = req.body;
    console.log(req);
    const user = new User({ ...userData, active: false });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);
    user.password = hashedPassword;

    if (req.files.avatar) {
      const imagePath = image.getFilePath(req.files.avatar);
      user.avatar = imagePath;
    }

    const userStored = await user.save();
    res.status(201).send(userStored);
  } catch (error) {
    res.status(400).send({ message: "Error while creating user" });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userData = req.body;
    if (userData.password) {
      const salt = bcrypt.genSaltSync(10);
      const hashPassword = bcrypt.hash(userData.password, salt);
      userData.password = hashPassword;
    } else {
      delete userData.password;
    }
    if (req.files && req.files.avatar) {
      const imagePath = image.getFilePath(req.files.avatar);
      userData.avatar = imagePath;
    }

    await User.findByIdAndUpdate({ _id: id }, userData);
    res.status(200).send({ message: "Update successfully" });
  } catch (error) {
    res.status(400).send({ message: "Error while updating user" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.status(200).send({ message: "Deleted successfully" });
  } catch (error) {
    res.status(400).send({ message: "Error while deleting user" });
  }
};

module.exports = {
  getMe,
  getUser,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
};
