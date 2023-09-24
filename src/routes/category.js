const express = require("express");
const route = express.Router();
const categoryController = require("../controllers/categoryController");
const upload = require("../config/multer/multer").upload;
const middlewareController = require("../controllers/middlewareController");

route.get("/", categoryController.getAll);
route.get("/:page", categoryController.getLimit);
route.post(
    "/update:id",
    upload.single("image"),
    categoryController.updateProduct
);
route.delete("/remove:id", categoryController.removeOutStore);
route.post(
    "/add-cart",
    middlewareController.verifyToken,
    categoryController.addCart
);
route.post("/:regex", categoryController.search);

module.exports = route;
