const express = require("express");
const ErrorHandler = require("./middleware/error");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser"); //inbuild
// const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use("/", express.static("uploads"));
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(fileUpload({ useTempFiles: true }));
//process env
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config();
}
//routes
const user = require("./Controllers/UserController");
const Order = require("./Controllers/OrdersController");

const shop = require("./Controllers/ShopController");
const product = require("./Controllers/ProductController");
const events = require("./Controllers/EventsController");
const coupons = require("./Controllers/CouponController");
const address = require("./Controllers/AddressController");
const payment = require("./Controllers/PaymentController");
const brainTreePayment = require("./Controllers/BraintreeController");
const messages = require("./Controllers/Conversation");
const singleMessage = require("./Controllers/singleMessage");

app.use("/api/v2/user", user);
app.use("/api/v2/singlemessage", singleMessage);
app.use("/api/v2/orders", Order);
app.use("/api/v2/payment", payment);
app.use("/api/v2/braintree", brainTreePayment);
app.use("/api/v2/shop", shop);
app.use("/api/v2/conversation", messages);
app.use("/api/v2/product", product);
app.use("/api/v2/event", events);
app.use("/api/v2/coupon", coupons);
app.use("/api/v2/address", address);
//handeling errors
app.use(ErrorHandler);
module.exports = app;
