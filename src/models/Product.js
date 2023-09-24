const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Product = new Schema(
    {
        name: { type: String, unique: true },
        price: { type: Number },
        slug: { type: String, unique: true },
        image: { type: String, unique: true },
        quantity: { type: Number, default: 1 },
        sold: { type: Number, default: 0 },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Category", Product);
