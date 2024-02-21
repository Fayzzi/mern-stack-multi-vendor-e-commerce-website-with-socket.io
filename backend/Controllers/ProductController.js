const express = require("express");
const router = express.Router();
const Product = require("./../model/Product");
const Shop = require("./../model/Shop");
const Order = require("./../model/OrderModel");

const { upload } = require("./../multer");
const catchAsyncErrors = require("./../middleware/CatchAsynError");
const ErrorHandelr = require("./../utils/ErrorHandler");
const fs = require("fs");
const CatchAsynError = require("./../middleware/CatchAsynError");
//create product
const {
  SellerAuthenticated,
  isAuthenticated,
} = require("./../middleware/auth");
router.post(
  "/create-product",
  upload.array("images", 100),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const {
        name,
        shopId,
        category,
        description,
        tags,
        images,
        stock,
        originalPrice,
        discountPrice,
      } = req.body;
      const shop = await Shop.findById({ _id: shopId });
      if (shop) {
        const allfiles = req.files;
        const ImageUrls = allfiles.map((f) => f.filename);

        const product = await Product.create({
          name,
          shopId,
          category,
          description,
          tags,
          images: ImageUrls,
          stock,
          shopInfo: shop._id,
          originalPrice,
          discountPrice,
        });
        res.status(200).json({
          success: true,
          product,
        });
      } else {
        return next(new ErrorHandelr("Shop not found", 400));
      }
    } catch (error) {
      return next(new ErrorHandelr(error.message, 400));
    }
  })
);
//find all products related to shop by seller id
router.get(
  "/getall-products/:id",
  CatchAsynError(async (req, res, next) => {
    const { id } = req.params;
    try {
      const allproducts = await Product.find({
        shopInfo: id,
      });
      res.status(200).json({
        success: true,
        allproducts,
      });
    } catch (error) {
      return next(new ErrorHandelr(error.message, 400));
    }
  })
);
//delete product of shop
router.delete(
  "/delete-product/:id",
  SellerAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { id } = req.params;
      const productData = await Product.findById(id);
      if (!productData) {
        return next(new ErrorHandelr("Product not found", 400));
      } else {
        productData.images.forEach((im) => {
          const filename = im;
          const filepath = "uploads/" + filename;
          fs.unlink(filepath, (err) => {
            if (err) {
              console.log("Error unlink");
            }
          });
        });
        //deleting from products schema
        const productDelete = await Product.findByIdAndDelete(id);
        //deleting from Orders schema
        await Order.deleteMany({ "cart.0._id": id });
        res.json({
          success: true,
          message: "Product Deleted",
        });
      }
    } catch (error) {
      return next(new ErrorHandelr(error.message, 400));
    }
  })
);

//getting each shop own products not by loggedIn seller id from params
router.get(
  "/shop-products/:id",
  CatchAsynError(async (req, res, next) => {
    try {
      const { id } = req.params;
      const checkShop = await Shop.findById(id);
      if (checkShop) {
        const AllProducts = await Product.find({
          shopInfo: checkShop._id,
        }).populate("shopInfo");
        res.json(AllProducts);
      } else {
        return next(new ErrorHandelr("Shop doesnt exists", 500));
      }
    } catch (error) {
      return next(new ErrorHandelr(error.message, 400));
    }
  })
);
//get all products for homepage to show
router.get(
  "/get-all-homepage-products",
  CatchAsynError(async (req, res, next) => {
    try {
      const allHomepageProducts = await Product.find()
        .populate("shopInfo")
        .sort({ createdAt: -1 });
      res.json(allHomepageProducts);
    } catch (error) {
      return next(new ErrorHandelr(error.message, 400));
    }
  })
);
//posting product review
router.put(
  "/post-review",
  isAuthenticated,
  CatchAsynError(async (req, res, next) => {
    try {
      const { rating, user, comment, productId, orderId, shopId } = req.body;
      const productExist = await Product.findById(productId);

      if (productExist) {
        const isReview = productExist.reviews.find(
          (rev) => rev.user._id.toString() === user._id.toString()
        );

        if (isReview) {
          productExist.reviews.forEach((rev) => {
            if (rev.user._id.toString() === user._id.toString()) {
              rev.rating = rating;
              rev.comment = comment;
              rev.productId = productId;
              rev.user = user;
            }
          });
        } else {
          // Create a new review object and push it to the reviews array
          const newReview = {
            user: user,
            rating: rating,
            comment: comment,
            productId: productId,
          };
          productExist.reviews.push(newReview);
        }

        const avg =
          productExist.reviews.reduce((total, rev) => total + rev.rating, 0) /
          productExist.reviews.length;

        productExist.rating = avg;

        await productExist.save({ validateBeforeSave: false });

        //Update isReviewed state of order to prevent the user from a second review
        await Order.findByIdAndUpdate(
          {
            _id: orderId,
          },
          {
            $set: {
              "cart.$[shopElem].isReviewed": true,
            },
          },
          {
            arrayFilters: [{ "shopElem._id": productId }],
            new: true,
          }
        );

        res.json({
          success: true,
          message: "Product review added successfully!",
        });
      } else {
        res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  })
);

module.exports = router;
