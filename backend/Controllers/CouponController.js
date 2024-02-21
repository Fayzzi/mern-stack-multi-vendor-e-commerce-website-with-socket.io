const express = require("express");
const router = express.Router();
const Product = require("./../model/Product");
const Shop = require("./../model/Shop");
const Event = require("./../model/Events");
const { upload } = require("./../multer");
const catchAsyncErrors = require("./../middleware/CatchAsynError");
const ErrorHandelr = require("./../utils/ErrorHandler");
const CatchAsynError = require("./../middleware/CatchAsynError");
const {
  SellerAuthenticated,
  isAuthenticated,
} = require("./../middleware/auth");
const fs = require("fs");
const coupon = require("./../model/Coupons");
const ErrorHandler = require("./../utils/ErrorHandler");
router.post(
  "/create-coupon-code",
  SellerAuthenticated,
  CatchAsynError(async (req, res, next) => {
    try {
      const existingCoupon = await coupon.findOne({ name: req.body.name });

      if (existingCoupon) {
        return next(new ErrorHandler("Coupon name should be unique!!", 400));
      } else {
        const newCoupon = await coupon.create(req.body);
        res.status(201).json({
          success: true,
          newCoupon,
        });
      }
    } catch (error) {
      return next(new ErrorHandelr(error.message, 400));
    }
  })
);

router.get(
  "/get-all-coupons/:id",
  SellerAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const checkShop = await Shop.findById(id);
    if (checkShop) {
      const getAllCoupons = await coupon.find({
        shopInfo: id,
      });
      res.status(201).json({
        success: true,
        getAllCoupons,
      });
    } else {
      return next(new ErrorHandelr("Shop Doesnt exists", 400));
    }
  })
);
router.delete(
  "/delete-coupon/:id",
  SellerAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { id } = req.params;
      const couponData = await coupon.findById(id);
      if (!couponData) {
        return next(new ErrorHandelr("Coupon not found", 400));
      } else {
        await coupon.findByIdAndDelete(id);
        res.json({
          success: true,
          message: "Coupon Deleted",
        });
      }
    } catch (error) {
      return next(new ErrorHandelr(error.message, 400));
    }
  })
);
router.get(
  "/get-coupon/:name",
  isAuthenticated,
  CatchAsynError(async (req, res, next) => {
    try {
      const couponCode = await coupon.findOne({ name: req.params.name });
      res.status(200).json({
        couponCode,
      });
    } catch (e) {
      return next(new ErrorHandelr(error.message, 400));
    }
  })
);
module.exports = router;
