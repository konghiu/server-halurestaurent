const mongoose = require("mongoose");
const url =
    "mongodb+srv://conghieu:conghieu312004@cluster0.d3gcpfp.mongodb.net/";
async function connect() {
    try {
        await mongoose.connect(url);
        console.log("connect successfull");
    } catch (err) {
        console.log("connect failure");
    }
}
module.exports = { connect };
