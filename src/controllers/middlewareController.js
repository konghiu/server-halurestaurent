const jwt = require("jsonwebtoken");
const User = require("../models/User");

const middlewareController = {
    verifyToken: function (req, res, next) {
        let token = req.headers.authorization;
        console.log("verify token");
        token = token.slice(7, token.length);
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
            if (err) {
                if (err.message !== "jwt expired")
                    return res
                        .status(401)
                        .json({ message: "You must be login." });
                return res.json({ message: err.message });
            }
            req.userID = data.token;
            next();
        });
    },
    verifyAdmin: async (req, res, next) => {
        console.log("verify admin");
        let id = req.userID;
        try {
            const user = await User.findById(id);
            if (user.admin) next();
            else
                return res
                    .status(400)
                    .json({ message: "You are not allowed to enter." });
        } catch (e) {
            return res.status(401).json({ message: "You must be login." });
        }
    },
};

module.exports = middlewareController;
