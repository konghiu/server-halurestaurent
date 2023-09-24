const Booking = require("../models/Booking");
const Product = require("../models/Product");
const Notification = require("../models/Notification");
const User = require("../models/User");

const errorServer = "Lỗi máy chủ không phản hồi";

const bookingController = {
    // [method] create code for order
    generateOrderCode: async (Model) => {
        return await Model.findOne({}, {}, { sort: { code: -1 } }).then(
            (lastDocument) => {
                if (lastDocument) {
                    const lastCode = lastDocument.code.substring(1);
                    const nextCodeNumericPart = parseInt(lastCode) + 1;
                    const nextCode =
                        "#" + nextCodeNumericPart.toString().padStart(4, "0");
                    return nextCode;
                }
                return "#0001";
            }
        );
    },
    // [POST] order
    PostOrder: async (req, res) => {
        if (!req.body.category.length)
            return res.status(400).json({
                message: "Yêu cầu thêm sảm phẩm trước khi thanh toán.",
            });

        try {
            const code = await bookingController.generateOrderCode(Booking);
            const bill = {
                ...req.body,
                code: code,
                user: req.userID,
            };

            req.body.category.forEach(async (item) => {
                await Product.findOneAndReplace(
                    {
                        _id: item._id,
                        quantity: {
                            $lte: item.quantity,
                        },
                    },
                    {
                        $inc: {
                            quantity: -item.quantity,
                            sold: item.quantity,
                        },
                    }
                );
            });
            await User.findByIdAndUpdate(req.userID, {
                cart: [],
            });
            const createBill = new Booking(bill);
            await createBill.save();

            const notify = new Notification({
                user: req.userID,
                message: `Bạn đã <b>tạo</b> đơn hàng <b>${code}</b> thành công.`,
            });
            await notify.save();

            res.status(200).json({
                bill: createBill,
                notify: notify,
            });
        } catch (e) {
            res.status(200).json({ message: e.message });
        }
    },

    // [PUT] user cancel order
    PutCancelOrder: async (req, res) => {
        try {
            const bill = await Booking.findById(req.body.id);
            bill.category.forEach(async (item) => {
                await Product.findByIdAndUpdate(item._id, {
                    $inc: {
                        quantity: item.quantity,
                        sold: -item.quantity,
                    },
                });
            });
            bill.status = "cancel";
            await bill.save();
            const notify = new Notification({
                message: `Bạn đã <b>hủy</b> đơn hàng <b>${bill.code}</b> thành công.`,
                user: req.userID,
            });
            await notify.save();

            res.status(200).json({
                notify: notify,
            });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    // [GET] admin get all orders
    GetAllOrders: async (req, res) => {
        // admin's userId
        const orders = await Booking.find({});
        return res.status(200).json(orders);
    },

    GetAllOrders: async (req, res) => {
        const orders = await Booking.find({
            $and: [
                {
                    status: {
                        $ne: "completed",
                    },
                },
                {
                    status: {
                        $ne: "cancel",
                    },
                },
            ],
        });
        return res.status(200).json(orders);
    },

    // [GET] user get all orders by status
    GetAllOrdersForUserByStatus: async (req, res) => {
        let orders = await Booking.find({
            user: req.userID,
            status: req.params.status,
        });
        return res.status(200).json(orders);
    },

    // [PUT] admin update status user's order
    PutStatusOrder: async (req, res) => {
        try {
            const booking = await Booking.findByIdAndUpdate(req.body.id, {
                status: req.params.status,
            });
            await booking.save();
            return await res
                .status(200)
                .json({ message: "Booking was confirmed which is preparing." });
        } catch (err) {
            return res.status(404).json({ message: errorServer });
        }
    },
};

module.exports = bookingController;
