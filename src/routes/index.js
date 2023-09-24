var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
    //     res.render("pages/home.ejs");
    res.status(200).json("Hello baby!");
});
router.post("/", function (req, res, next) {
    console.log(req.body.text);
    res.send(`client post: ${req.body.text || "no text"}`);
});

module.exports = router;
