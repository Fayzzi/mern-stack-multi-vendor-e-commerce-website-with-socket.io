const express = require("express");
const router = express.Router();
const fs = require("fs");
const jwt = require("jsonwebtoken");
const sendMail = require("./../utils/SendMail");

const {
  isAuthenticated,
  SellerAuthenticated,
} = require("./../middleware/auth");
const { upload } = require("./../multer");
const ErrorHandler = require("../utils/ErrorHandler");
const shop = require("./../model/Shop");
const orders = require("./../model/OrderModel");

const CatchAsynError = require("../middleware/CatchAsynError");
const sendShopToken = require("../utils/ShopJwtToken");
const Products = require("./../model/Product");
router.post("/createShop", upload.single("file"), async (req, res, next) => {
  try {
    const { name, password, address, zipCode, phoneNumber, email } = req.body;
    const userEmail = await shop.findOne({ email: email });
    if (userEmail) {
      const filename = req.file.filename;
      const filepath = "uploads/" + filename;
      fs.unlink(filepath, (err) => {
        if (!err) {
          console.log("Deleted file");
        }
      });
      return next(new ErrorHandler("Shop already exists!!", 400));
    }

    const filename = req.file.filename;
    const avatar = filename;

    const newShop = {
      name,
      password,
      address,
      zipCode,
      phoneNumber,
      email,
      avatar,
    };

    const activationToken = createShopActivationToken(newShop);
    const activationLink =
      "http://localhost:5173/seller/activation/" + activationToken;

    try {
      await sendMail({
        email: newShop.email,
        subject: "Activation of shop",
        message: `Hello ${newShop.name}, please activate your shop by clicking this link: ${activationLink}`,
      });

      res.status(201).json({
        success: true,
        message: `Please check your email (${newShop.email}) for activating your shop.`,
      });
    } catch (error) {
      console.error("Error sending activation email:", error);
      // Handle the error without exposing details to the client
      res.status(500).json({
        success: false,
        message: "Error sending activation email. Please try again later.",
      });
    }
  } catch (error) {
    return next(ErrorHandler(error.message, 500));
  }
});
const createShopActivationToken = (user) => {
  return jwt.sign(user, process.env.Activation_Token, {
    expiresIn: "5m",
  });
};
router.post(
  "/seller/activation",
  CatchAsynError(async (req, res, next) => {
    try {
      const { activation_token } = req.body;
      const userData = jwt.verify(
        activation_token,
        process.env.Activation_Token
      );
      if (userData) {
        const { name, email, password, avatar, address, phoneNumber, zipCode } =
          userData;
        let existingSeller = await shop.findOne({ email: email });
        if (existingSeller) {
          return next(new ErrorHandler("Shop already exists!!", 400));
        }

        const createdSeller = await shop.create({
          name,
          email,
          password,
          avatar,
          address,
          phoneNumber,
          zipCode,
        });
        sendShopToken(createdSeller, 200, res);
      } else {
        return next(new ErrorHandler("Invalid activation token", 400));
      }
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);
router.post(
  "/loginShop",
  CatchAsynError(async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const existngUser = await shop
        .findOne({ email: email })
        .select("+password");
      if (existngUser) {
        const ispasswordValid = await existngUser.comparePassword(password);
        if (ispasswordValid) {
          sendShopToken(existngUser, 200, res);
        } else {
          return next(new ErrorHandler("Invalid Password", 400));
        }
      } else {
        return next(new ErrorHandler("User not found", 400));
      }
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);
//load shop
router.get(
  "/getShop",
  SellerAuthenticated,
  CatchAsynError(async (req, res, next) => {
    try {
      const seller = await shop.findById(req.seller.id);
      if (!seller) {
        return next(new ErrorHandler("User not found", 400));
      }
      res.status(200).json({
        success: true,
        seller,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);
//seller logout
router.post(
  "/sellerLogout",
  CatchAsynError(async (req, res, next) => {
    res.clearCookie("seller_Token");
    res.json({ success: true, message: "Seller logged out successfully" });
  })
);
//showing shop info
router.get(
  "/showShop/:id",

  CatchAsynError(async (req, res, next) => {
    try {
      const { id } = req.params;
      const shopData = await shop.findById(id);
      res.status(200).json({
        success: true,
        shopData,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);
//getting shop orders
router.get(
  "/get-shop-orders/:id",
  SellerAuthenticated,
  CatchAsynError(async (req, res, next) => {
    const { id } = req.params;
    const shopAllOrders = await orders
      .find({ shopId: id })
      .sort({ createdAt: -1 });
    res.json({ shopAllOrders });
  })
);
//updating shop info
router.put(
  "/update-shop-info",
  SellerAuthenticated,
  upload.single("image"),
  CatchAsynError(async (req, res, next) => {
    const {
      name,
      email,
      address,
      zipCode,
      password,
      phoneNumber,
      description,
    } = req.body;
    const validShop = await shop
      .findById({ _id: req.seller.id })
      .select("+password");
    if (validShop) {
      const comparePassword = await validShop.comparePassword(password);
      if (comparePassword) {
        if (req.file) {
          //deleting the current image from project
          const existingImage = validShop.avatar;
          const filepath = "uploads/" + existingImage;
          fs.unlink(filepath, (err) => {
            if (err) {
              console.log(err);
            }
          });
          validShop.name = name;
          validShop.avatar = req.file.filename;
          validShop.zipCode = zipCode;
          validShop.address = address;
          validShop.phoneNumber = phoneNumber;
          validShop.description = description;
          await validShop.save();
          const newData = await shop.findById({ _id: req.seller.id });
          res.json({ newData });
        } else {
          validShop.name = name;
          validShop.zipCode = zipCode;
          validShop.address = address;
          validShop.phoneNumber = phoneNumber;
          validShop.description = description;
          await validShop.save();
          res.json({ message: "Update successful" });
        }
      } else {
        return next(new ErrorHandler("Password is not correct!!", 500));
      }
    } else {
      return next(new ErrorHandler("No shop found!!", 500));
    }
  })
);
module.exports = router;
