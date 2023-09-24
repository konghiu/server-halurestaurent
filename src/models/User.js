const mongoose = require("mongoose");
const ItemCart = require("./ItemCart");
const Schema = mongoose.Schema;

const Address = new Schema({
     recipient: { type: String, required: true },
     address: { type: String, required: true },
     phone: { type: String, required: true },
});

const User = new Schema(
     {
          firstName: { type: String, required: true },
          lastName: { type: String, required: true },
          username: { type: String, required: true },
          email: { type: String, required: true },
          password: { type: String, required: true },
          admin: { type: Boolean, default: false },
          cart: [ItemCart],
          addresses: [Address],
          avatar: { type: String, default: "" },
          loginAt: { type: Date, default: Date.now() },
          logoutAt: { type: Date, default: Date.now() },
     },
     {
          timestamps: true,
     }
);

module.exports = mongoose.model("User", User);
