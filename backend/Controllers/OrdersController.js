const express = require("express");
const router = express.Router();
const Order = require("./../model/OrderModel");
const Shop = require("./../model/Shop");
const product = require("./../model/Product");
const { upload } = require("./../multer");
const catchAsyncErrors = require("./../middleware/CatchAsynError");
const ErrorHandelr = require("./../utils/ErrorHandler");
const fs = require("fs");
const CatchAsynError = require("./../middleware/CatchAsynError");
const {
  isAuthenticated,
  SellerAuthenticated,
} = require("./../middleware/auth");
const ErrorHandler = require("./../utils/ErrorHandler");

router.get(
  "/get-all-order/:id",
  isAuthenticated,
  CatchAsynError(async (req, res, next) => {
    try {
      const allOrders = await Order.find({ "user._id": req.user.id }).sort({
        createdAt: -1,
      });
      res.status(200).json({ success: true, orders: allOrders });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  })
);
//updating order status
router.put(
  "/updating-order-status/:id",
  SellerAuthenticated,
  CatchAsynError(async (req, res, next) => {
    try {
      const { ProductId, status, qty } = req.body;
      const order = await Order.findById(req.params.id);
      if (order) {
        if (status === "Transfered to Delivery Partner") {
          //updating product and reducing stock of delivered product
          const updatingProduct = await product.findById(ProductId);
          if (updatingProduct) {
            updatingProduct.sold_out = updatingProduct.sold_out + qty;
            updatingProduct.stock = updatingProduct.stock - qty;
            order.status = "Transfered to Delivery Partner";
            await order.save();
            await updatingProduct.save({ validateBeforeSave: false });
          } else {
            return next(new ErrorHandelr("No Product found by this id", 400));
          }
        }
        if (status === "Delivered") {
          const updatingProduct = await product.findById(ProductId);
          if (updatingProduct) {
            updatingProduct.sold_out = updatingProduct.sold_out + qty;
            updatingProduct.stock = updatingProduct.stock - qty;
            updatingProduct.save({ validateBeforeSave: false });
            order.deliveredAt = Date.now();
            order.paymentInfo.status = "Successful";
            order.status = "Delivered";
            await order.save();
            await order.save({ validateBeforeSave: false });
            res.status(200).json({ status: "Successful", order });
          }
        }
        if (status === "Refund Success") {
          const updatingProduct = await product.findById(ProductId);
          if (updatingProduct) {
            updatingProduct.sold_out = updatingProduct.sold_out - qty;
            updatingProduct.stock = updatingProduct.stock + qty;
            updatingProduct.save({ validateBeforeSave: false });

            order.status = status;
            await order.save();
            await order.save({ validateBeforeSave: false });
            res.status(200).json({ status: "Refund Successful", order });
          }
        } else {
          order.status = status;
          await order.save();
          await order.save({ validateBeforeSave: false });
          res.status(200).json({ status: "Successful", order });
        }
      } else {
        return next(new ErrorHandelr("No order found by this id", 400));
      }
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  })
);
//order refund status by user(not seller)
router.put(
  "/order-refund/:id",
  SellerAuthenticated,
  CatchAsynError(async (req, res, next) => {
    try {
      const { status } = req.body;
      const order = await Order.findById(req.params.id);
      if (order) {
        order.status = status;
        order.save({ validateBeforeSave: false });
        res.json({
          message: "Refund requested!!",
        });
      } else {
        return next(new ErrorHandelr("No order found by this id", 400));
      }
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  })
);
module.exports = router;
