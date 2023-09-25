const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("../config/config.json");

// refresh token list
const tokenList = {};

const accountController = {
    // [POST] create access token
    createAccessToken: function (id) {
        const token = jwt.sign({ token: id }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: 3600,
        });
        return token;
    },
    // [POST] create refresh token
    createRefreshToken: function (id) {
        const token = jwt.sign(
            { token: id },
            process.env.REFRESH_TOKEN_SECRET,
            {
                expiresIn: 86400,
            }
        );
        return token;
    },

    // [GET] sign in form
    signInGet: function (req, res) {
        res.render("pages/signIn.ejs");
    },

    // [POST] sign in action
    signInPost: async function (req, res) {
        const query = {
            email: req.body.email,
        };
        const updateTimeLogin = { loginAt: new Date() };
        await User.findOne(query)
            .populate({
                path: "cart",
                populate: {
                    path: "product",
                },
            })
            .then(async (data) => {
                if (data !== null) {
                    if (bcrypt.compareSync(req.body.password, data.password)) {
                        await User.findOneAndUpdate(query, updateTimeLogin);
                        const refreshToken =
                            accountController.createRefreshToken(data._id);
                        const accessToken = accountController.createAccessToken(
                            data._id
                        );
                        const resUser = { ...data._doc };
                        delete resUser.password;
                        res.cookie("refreshToken", refreshToken, {
                            httpOnly: true,
                            sameSite: false,
                            secure: true,
                        });
                        let response = {
                            ...resUser,
                            accessToken,
                        };
                        tokenList[refreshToken] = accessToken;
                        return res.status(200).json(response);
                    }
                }
                return res.status(400).json({
                    message: "Warning! Incorrect email or password.",
                });
            })
            .catch((err) => {
                return res.status(400).json({ message: err.message });
            });
    },

    // [GET] sign up form
    signUpGet: function (req, res, next) {
        res.render("pages/signUp.ejs");
    },

    // [POST] sign up action
    signUpPost: async function (req, res) {
        const registerUser = { ...req.body };
        const isUserExist = await User.findOne({ email: registerUser.email });
        if (isUserExist === null) {
            registerUser.password = bcrypt.hashSync(
                registerUser.password,
                config.authentication.saltRound
            );
            registerUser.username = `${registerUser.firstName} ${registerUser.lastName}`;
            const newUser = new User(registerUser);
            newUser.save();
            return res
                .status(200)
                .json({ message: "User was registed successful." });
        }
        res.status(400).json({ message: "Email was existed!" });
    },

    // [GET] sign out action
    signOutPost: function (req, res) {
        res.clearCookie("refreshToken");
        res.status(200).json(null);
    },

    // [POST] refresh token
    refreshToken: function (req, res) {
        let refreshToken = req.headers.authorization;
        refreshToken = refreshToken.slice(7, refreshToken.length);
        if (refreshToken && refreshToken in tokenList) {
            jwt.verify(
                refreshToken,
                process.env.REFRESH_TOKEN_SECRET,
                async (err, data) => {
                    if (!err) {
                        const newAccessToken =
                            accountController.createAccessToken(data.token);
                        tokenList[refreshToken] = newAccessToken;
                        const user = await User.findById(data.token).populate({
                            path: "cart",
                            populate: {
                                path: "product",
                            },
                        });
                        const resUser = { ...user._doc };
                        delete resUser.password;
                        const response = {
                            ...resUser,
                            accessToken: newAccessToken,
                        };
                        return res.status(200).json(response);
                    }
                }
            );
        } else {
            return res.status(401).json({ message: "You must be login" });
        }
    },
};

module.exports = accountController;
