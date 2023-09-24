const Booking = require("../models/Booking");
const Notification = require("../models/Notification");

let admin = {};
let consumers = {};

const socketConntect = (socket, io) => {
    console.log("We are live and connected: " + socket.id);

    socket.on("login", async (payload) => {
        if (payload.admin) {
            admin[payload.id] = socket.id;
        } else {
            consumers[payload.id] = socket.id;
        }
        const notification = await Notification.find({ user: payload.id });
        io.to(socket.id).emit("send_notify", notification);
    });

    socket.on("order", async (bill, note) => {
        Object.keys(admin).forEach(async (key) => {
            const notify = new Notification({
                message: note.message,
                user: key,
            });
            await notify.save();
            io.to(admin[key]).emit("consumer_order", bill, notify);
        });
    });

    socket.on("update_status_order", async (payload) => {
        const notify = new Notification({
            message: payload.message,
            user: payload.userId,
        });
        await notify.save();
        const response = {
            id: payload.id,
            notify: notify,
        };
        io.to(consumers[payload.userId]).emit(
            "admin_send_status_order",
            response
        );
    });

    socket.on("consumer_cancel_order", async (payload) => {
        Object.keys(admin).forEach(async (key) => {
            const notify = new Notification({
                message: payload.message,
                user: key,
            });
            await notify.save();
            io.to(admin[key]).emit("consumer_cancel_order", payload.id, notify);
        });
    });

    socket.on("notification_checked", async (id, skip) => {
        await Notification.updateMany(
            { checked: false, user: id },
            { checked: true }
        ).skip(skip);
    });

    socket.on("disconnect", (err) => {
        console.log(`${socket.id} disconnected`);
    });
};

module.exports = socketConntect;
