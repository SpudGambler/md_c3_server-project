const express = require("express");
const multiparty = require("connect-multiparty");
const UserController = require("../controllers/user");
const middleware_authentication = require("../middlewares/authenticated");
const fs = require("fs");
const uploadDir = "./uploads/avatar";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const md_upload = multiparty({ uploadDir: "./uploads/avatar" });
const api = express.Router();

api.get("/me", [middleware_authentication.ensureAuth], UserController.getMe);
api.get("/", [middleware_authentication.ensureAuth], UserController.getUsers);
api.get("/:id", [middleware_authentication.ensureAuth], UserController.getUser);
api.post(
  "/user",
  [middleware_authentication.ensureAuth, md_upload],
  UserController.createUser
);

api.put(
  "/:id",
  [middleware_authentication.ensureAuth, md_upload],
  UserController.updateUser
);

api.delete(
  "/:id",
  [middleware_authentication.ensureAuth],
  UserController.deleteUser
);

module.exports = api;
