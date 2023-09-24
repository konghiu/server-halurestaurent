const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ItemCart = new Schema(
     {
          quantity: { type: Number, default: 1 },
          product: {
               type: mongoose.Schema.Types.ObjectId,
               ref: "Category",
          },
     },
     {
          timestamps: true,
     }
);

module.exports = ItemCart;
