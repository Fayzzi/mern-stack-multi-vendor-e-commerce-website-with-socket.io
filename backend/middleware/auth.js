const ErrorHandler = require("../utils/ErrorHandler");
const catchAsynErrors = require("./CatchAsynError");
const jwt = require("jsonwebtoken");
const User = require("./../model/UserModel.js");
const CatchAsyncErrors = require("./../middleware/CatchAsynError");
const Shop = require("../model/Shop.js");
exports.isAuthenticated = CatchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return next(new ErrorHandler("Please login first...", 401));
  }
  const userData = jwt.verify(token, process.env.JWT_SECRET_KEY);
  req.user = await User.findById(userData.id);
  next();
});
exports.SellerAuthenticated = CatchAsyncErrors(async (req, res, next) => {
  const { seller_Token } = req.cookies;
  if (!seller_Token) {
    return next(new ErrorHandler("Please login first...", 401));
  }
  const userData = jwt.verify(seller_Token, process.env.JWT_SECRET_KEY);
  req.seller = await Shop.findById(userData.id);
  next();
});
