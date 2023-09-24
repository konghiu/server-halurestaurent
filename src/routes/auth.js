const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.get("/sign-in", authController.signInGet);
router.post("/sign-in", authController.signInPost);
router.get("/sign-up", authController.signUpGet);
router.post("/sign-up", authController.signUpPost);
router.post("/sign-out", authController.signOutPost);
router.post("/refresh-token", authController.refreshToken);

module.exports = router;
