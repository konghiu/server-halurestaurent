const express = require("express");
const route = express.Router();

route.post("", function (req, res) {
     const body = req.file;
     res.json(body.originalname);
});

module.exports = route;
