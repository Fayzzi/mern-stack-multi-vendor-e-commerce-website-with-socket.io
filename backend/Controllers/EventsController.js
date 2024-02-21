const express = require("express");
const router = express.Router();
const Product = require("./../model/Product");
const Shop = require("./../model/Shop");
const Event = require("./../model/Events");
const { upload } = require("./../multer");
const catchAsyncErrors = require("./../middleware/CatchAsynError");
const ErrorHandelr = require("./../utils/ErrorHandler");
const CatchAsynError = require("./../middleware/CatchAsynError");
const { SellerAuthenticated } = require("./../middleware/auth");
const fs = require("fs");
//create event
router.post(
  "/create-event",
  upload.array("images", 100),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const {
        name,
        shopInfo,
        category,
        description,
        tags,
        images,
        start_date,
        end_date,
        stock,
        originalPrice,
        discountPrice,
      } = req.body;
      const shop = await Shop.findById({ _id: shopInfo });
      if (shop) {
        const allfiles = req.files;
        const ImageUrls = allfiles.map((f) => f.filename);

        const EventNew = await Event.create({
          name,
          category,
          description,
          tags,
          start_date,
          end_date,
          images: ImageUrls,
          stock,
          shopInfo,
          originalPrice,
          discountPrice,
        });
        res.status(200).json({
          success: true,
          EventNew,
        });
      } else {
        return next(new ErrorHandelr("Shop not found", 400));
      }
    } catch (error) {
      return next(new ErrorHandelr(error.message, 400));
    }
  })
);
//events by seller Id(dashboard)
router.get(
  "/getall-events/:id",
  SellerAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const getShop = await Shop.findById(id);
    if (getShop) {
      const allEvents = await Event.find({ shopInfo: id });
      res.status(200).json({
        success: true,
        allEvents,
      });
    } else {
      return next(new ErrorHandelr("Shop not found", 400));
    }
  })
);
//delete dashboard events by seller Id(dashboard)
router.delete(
  "/delete-event/:id",
  SellerAuthenticated,
  CatchAsynError(async (req, res, next) => {
    const { id } = req.params;
    const findEvent = await Event.findById(id);
    if (!findEvent) {
      return next(new ErrorHandelr("Event not found", 400));
    } else {
      findEvent.images.forEach((im) => {
        const filename = im;
        const filePath = "uploads/" + filename;
        fs.unlink(filePath, (err) => {
          if (err) {
            console.log("Error unlink");
          }
        });
      });
      //deleting from events schema
      const deletedEvent = await Event.findByIdAndDelete(id);
      res.json({
        success: true,
        message: "Event Deleted",
      });
    }
  })
);
//homepage Events
router.get(
  "/show-all-homepage-events",
  CatchAsynError(async (req, res, next) => {
    try {
      const getAllEvents = await Event.find().populate("shopInfo");
      res.json(getAllEvents);
    } catch (error) {
      return next(new ErrorHandelr(error.message, 400));
    }
  })
);
//Every shop events from params
router.get(
  "/getall-events-byShop/:id",
  catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const getShop = await Shop.findById(id);
    if (getShop) {
      const allEventsbyShop = await Event.find({ shopInfo: id });
      res.status(200).json({
        success: true,
        allEventsbyShop,
      });
    } else {
      return next(new ErrorHandelr("Shop not found", 400));
    }
  })
);

module.exports = router;
