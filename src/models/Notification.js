const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Notification = new Schema(
    {
        message: { type: String, required: true },
        checked: { type: Boolean, default: false },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Notification", Notification);
