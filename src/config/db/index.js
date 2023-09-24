const mongoose = require("mongoose");
async function connect() {
    try {
        await mongoose.connect(process.env.MONGO_CONNECT);
        console.log("connect successfull");
    } catch (err) {
        console.log("connect failure");
    }
}
module.exports = { connect };
