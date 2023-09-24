const User = require("../models/User");
const bcrypt = require("bcryptjs");
const config = require("../config/config.json");

const userController = {
    // [UPDATE] change password
    changePassword: async function (req, res) {
        const oPw = req.body.oPw;
        const nPw = req.body.nPw;
        const user = await User.findById(req.userID);
        if (user != null) {
            const cmpPassword = bcrypt.compareSync(oPw, user.password);
            if (!cmpPassword)
                return res.status(400).json({
                    message: "Mat khau cu khong chinh xac.",
                });
            else if (oPw == nPw)
                return res.status(400).json({
                    message: "Mat khau moi khong duoc trung voi mat khau cu.",
                });
            else {
                user.password = bcrypt.hashSync(
                    nPw,
                    config.authentication.saltRound
                );
                user.save();
                return res
                    .status(200)
                    .json({ message: "Doi mat khau thanh cong." });
            }
        }
        return res.status(404).json({ message: "nguoi dung khong ton tai" });
    },
    // [POST] update avatar image
    updateAvatar: async (req, res) => {
        const user = await User.findByIdAndUpdate(
            req.userID,
            {
                avatar: req.file.originalname,
            },
            { new: true }
        ).catch((err) => {
            return res.status(400).json({ message: err.message });
        });
        res.status(200).json(user.avatar);
    },
    // [GET] get all item in cart
    getCart: async function (req, res) {
        const user = await User.findById(req.userID).populate({
            path: "cart",
            populate: {
                path: "product",
            },
        });
        return res.status(200).json(user.cart);
    },

    // [PUT] set quantity item in user's cart
    PutSetQuantityitem: async (req, res) => {
        console.log(req.body.quantity);
        try {
            await User.updateOne(
                {
                    _id: req.userID,
                    "cart._id": req.params.id,
                },
                {
                    $set: { "cart.$.quantity": req.body.quantity },
                }
            );
            return res.status(200).json({ message: "success" });
        } catch (e) {
            return res
                .status(400)
                .json({ message: "happen an error in server" });
        }
    },

    // [POST] remove a item in cart
    removeItemCart: async function (req, res) {
        const user = await User.findByIdAndUpdate(
            req.userID,
            {
                $pull: {
                    cart: {
                        _id: req.params.id,
                    },
                },
            },
            {
                new: true,
            }
        ).populate({
            path: "cart",
            populate: {
                path: "product",
            },
        });
        return res.status(200).json(user.cart);
    },

    postAddress: async (req, res) => {
        const address = { ...req.body };
        const user = await User.findByIdAndUpdate(
            req.userID,
            {
                $push: {
                    addresses: address,
                },
            },
            {
                new: true,
            }
        )
            .populate({
                path: "addresses",
            })
            .catch((err) => {
                return res.status(400).json({ message: err.message });
            });
        return res.status(200).json(user.addresses[user.addresses.length - 1]);
    },
    deleteAddress: async (req, res) => {
        const user = await User.findByIdAndUpdate(req.userID, {
            $pull: {
                addresses: {
                    _id: req.params.id,
                },
            },
        })
            .populate({
                path: "addresses",
            })
            .catch((err) => {
                return res.status(400).json({ message: err.message });
            });
        return res.status(200).json(user.addresses);
    },
    changeDefault: async (req, res) => {
        const addressID = req.params.index;
        const user = await User.findById(req.userID);
        const addresses = user.addresses;
        if (!addresses || addresses?.length < 2)
            return res.status(400).json({ message: "Invalid address" });

        let swap = addresses[addressID];
        addresses[addressID] = addresses[0];
        addresses[0] = swap;

        await user.save();
        return res.status(200).json(addresses);
    },
};

module.exports = userController;
