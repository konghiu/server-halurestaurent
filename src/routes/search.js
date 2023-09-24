const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.get("/", async (req, res) => {
     const query = {
          username: {
               $regex: req.query.username || "",
          },
     };
     let data = await User.find(query);
     // data = data.sort((a, b) => {
     //      let fa = a.username.toLowerCase(),
     //           fb = b.username.toLowerCase();
     //      if (fa < fb) return -1;
     //      if (fa > fb) return 1;
     //      return 0;
     // });

     res.render("pages/search.ejs", {
          list: data,
     });
});
router.post("/", (req, res) => {
     res.send(`text search post: ${req.body.username}`);
});

module.exports = router;
