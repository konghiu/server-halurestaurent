const multer = require("multer");
const fs = require("fs");

const storage = multer.diskStorage({
     destination: function (req, file, callback) {
          callback(null, "./src/public/images");
     },
     filename: function (req, file, callback) {
          callback(null, file.originalname);
     },
});

const storageAvatar = multer.diskStorage({
     destination: (req, file, callback) => {
          let type = req.userID;
          console.log(req);
          let path = `./src/public/avatars/${type}`;
          try {
               if (!fs.existsSync(path)) {
                    fs.mkdirSync(path);
               }
               callback(null, path);
          } catch (err) {
               console.error(err);
          }
     },
     filename: function (req, file, callback) {
          callback(null, file.originalname);
     },
});

const upload = multer({ storage: storage });
const uploadAvatar = multer({ storage: storageAvatar });

module.exports = { upload, uploadAvatar };
