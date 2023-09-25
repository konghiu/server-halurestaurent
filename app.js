const express = require("express");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const db = require("./src/config/db");
const dotenv = require("dotenv");
const cors = require("cors");
const { Server } = require("socket.io");
const createError = require("http-errors");

dotenv.config();
// import router
const indexRouter = require("./src/routes/index");
const searchRouter = require("./src/routes/search");
const categoryRouter = require("./src/routes/category");
const userRouter = require("./src/routes/user");
const authRouter = require("./src/routes/auth");
const bookingRouter = require("./src/routes/booking");
const middlewareController = require("./src/controllers/middlewareController");
const { createServer } = require("http");
const socketConntect = require("./src/routes/socket");
const Product = require("./src/models/Product");

db.connect();

// view engine setup
app.set("views", path.join(__dirname, "src/views"));
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "src/public")));
app.use(
    cors({
        origin: "http://konghiu.github.io/halurestaurent/",
        // origin: "http://localhost:3000",
        optionsSuccessStatus: 200,
        credentials: true,
    })
);
app.use(cookieParser({}));
app.use(function (req, res, next) {
    res.header("Content-Type", "application/json;charset=UTF-8");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

app.use("/", indexRouter);
app.use("/user", middlewareController.verifyToken, userRouter);
app.use("/v/auth", authRouter);
app.use("/category", categoryRouter);
app.use("/booking", bookingRouter);
app.use("/search", searchRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => socketConntect(socket, io));

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
});

module.exports = app;

// "start": "node ./bin/www"
