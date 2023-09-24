const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Booking = new Schema(
    {
        code: { type: String, unique: true, required: true },
        address: { type: String, required: true },
        phone: { type: String, required: true },
        recipient: { type: String, required: true },
        category: [
            {
                _id: { type: String, required: true },
                name: { type: String, required: true },
                price: { type: Number },
                quantity: { type: Number },
            },
        ],
        total: { type: Number, required: true },
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        status: { type: String, default: "queue" },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Booking", Booking);
