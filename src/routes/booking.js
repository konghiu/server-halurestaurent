const bookingController = require("../controllers/bookingController");
const middlewareController = require("../controllers/middlewareController");
const router = require("express").Router();

router.get("/", bookingController.GetAllOrders);
router.post("/", middlewareController.verifyToken, bookingController.PostOrder);
router.get(
    "/status/uncomplete",
    middlewareController.verifyToken,
    middlewareController.verifyAdmin,
    bookingController.GetAllOrders
);
router.get(
    "/status/:status",
    middlewareController.verifyToken,
    bookingController.GetAllOrdersForUserByStatus
);
router.put(
    "/status/:status",
    middlewareController.verifyToken,
    middlewareController.verifyAdmin,
    bookingController.PutStatusOrder
);
router.put(
    "/cancel",
    middlewareController.verifyToken,
    bookingController.PutCancelOrder
);

module.exports = router;
