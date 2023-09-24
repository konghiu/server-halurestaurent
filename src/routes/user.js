const express = require("express");
const userController = require("../controllers/userController");
const upload = require("../config/multer/multer").uploadAvatar;
const route = express.Router();

route.post("/change-password", userController.changePassword);
route.delete("/cart/remove:id", userController.removeItemCart);
route.put("/cart/set-quantity-item:id", userController.PutSetQuantityitem);
route.post("/addresses", userController.postAddress);
route.delete("/addresses:id", userController.deleteAddress);
route.post("/addresses/default:index", userController.changeDefault);
route.post("/avatar", upload.single("image"), userController.updateAvatar);

module.exports = route;
