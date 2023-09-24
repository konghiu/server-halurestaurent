const Product = require("../models/Product");
const User = require("../models/User");
var fs = require("fs");

const categoryController = {
    getAll: async function (req, res) {
        const cart = await Product.find();
        res.status(200).json(cart);
    },
    getLimit: async function (req, res) {
        const page = req.params.page;
        const sort = req.query.sort; //name or price
        const type = Number(req.query.type); // 1 (increase) or -1 (decrease)
        const max = Number(req.query.max) || 1000000;
        const min = Number(req.query.min) || 1000;
        const query = {
            $and: [{ price: { $gte: min } }, { price: { $lte: max } }],
        };
        let category;
        if (sort === "name") {
            category = await Product.find(query)
                .sort({ name: type })
                .skip((page - 1) * 6)
                .limit(6);
        } else if (sort === "price") {
            category = await Product.find(query)
                .sort({ price: type })
                .skip((page - 1) * 6)
                .limit(6);
        } else {
            category = await Product.find(query)
                .skip((page - 1) * 6)
                .limit(6);
        }
        return res.status(200).json(category);
    },
    getLimitAndSort: async function (req, res) {
        const page = req.params.page;
        const category = await Product.find()
            .skip((page - 1) * 6)
            .limit(6);
        return res.status(200).json(category);
    },
    insert: async function (req, res) {
        const body = { ...req.body };
        body.image = req.file.originalname;
        const findProduct = await Product.findOne({ name: body.name });
        if (findProduct !== null) {
            fs.unlink(`./src/public/images/${req.body.image}`, (err) => {
                if (err) throw err;
                console.log("File deleted!");
            });
            return res.status(400).json({ message: "Product's name exist." });
        }
        const newProduct = new Product(body);
        newProduct.save();
        return res.status(200).json({
            message: "Product has just been added.",
        });
    },
    removeOutStore: async function (req, res) {
        try {
            const id = req.params.id;
            const query = {
                "cart.product": { $gte: id },
            };
            const filter = {
                $pull: {
                    cart: {
                        product: id,
                    },
                },
            };
            await Product.findByIdAndDelete(id);
            await User.updateMany(query, filter);
            fs.unlink(`./src/public/images/${req.body.image}`, (err) => {
                if (err) throw err;
                console.log("File deleted!");
            });
            return res.status(200).json({ message: "remove success" });
        } catch (err) {
            res.status(500).json(err);
        }
    },
    addCart: async function (req, res) {
        const product = { ...req.body };
        const user = await User.findById(req.userID);
        const cart = user.cart;
        const findIx = cart.findIndex((item) => item.product == product._id);
        if (findIx == -1) {
            cart.push({
                product: product,
                quantity: product.quantity,
            });
        } else cart[findIx].quantity += product.quantity || 1;

        const resCart = await user.populate({
            path: "cart",
            populate: {
                path: "product",
            },
        });
        user.save();
        return res.status(200).json(resCart.cart);
    },
    updateProduct: async function (req, res) {
        try {
            const id = req.params.id;
            const putData = req.body;
            delete putData.image;
            if (req.file?.originalname) putData.image = req.file.originalname;

            const product = await Product.findByIdAndUpdate(id, putData, {
                new: true,
            });
            return res
                .status(200)
                .json({ message: "update successful!", product });
        } catch (err) {
            return res.status(400).json(err);
        }
    },
    search: async function (req, res) {
        const search = req.params.regex;
        const find = await Product.find({
            $or: [
                { name: { $regex: new RegExp(search, "i") } },
                { slug: { $regex: new RegExp(search, "i") } },
            ],
        });
        res.status(200).json(find);
    },
};

module.exports = categoryController;
