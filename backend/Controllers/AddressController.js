const express = require("express");
const router = express.Router();
const catchasynError = require("./../middleware/CatchAsynError");
const user = require("./../model/UserModel");
const ErrorHandeler = require("./../utils/ErrorHandler");
const { isAuthenticated } = require("../middleware/auth");
router.put(
  "/create-address",
  isAuthenticated,
  catchasynError(async (req, res, next) => {
    try {
      const checkUser = await user.findById(req.user.id);
      if (checkUser) {
        const sameType = checkUser.addresses.find(
          (address) => address.addressType === req.body.addressType
        );
        if (sameType) {
          return next(
            new ErrorHandeler(
              `${req.body.addressType} address already exists`,
              400
            )
          );
        } else {
          // if exists then update it
          const existingAddress = checkUser.addresses.find(
            (address) => address._id === req.body._id
          );
          if (existingAddress) {
            Object.assign(existingAddress, req.body);
          } else {
            // add new address to array
            checkUser.addresses.push(req.body);
            await checkUser.save();
            res.json(checkUser);
          }
        }
      } else {
        return next(new ErrorHandeler("user not found", 400));
      }
    } catch (error) {
      return next(new ErrorHandeler(error.message, 400));
    }
  })
);

// routes/userRoutes.js
router.delete(
  "/delete-address/:id",
  isAuthenticated,
  catchasynError(async (req, res, next) => {
    try {
      const addressId = req.params.id;
      const userId = req.user.id;
      //update user's data
      await user.findByIdAndUpdate(
        { _id: userId },
        { $pull: { addresses: { _id: addressId } } }
      );

      //return the updated data
      const userData = await user.findById(userId);
      res.json(userData);
    } catch (e) {
      return next(new ErrorHandeler(e.message, 400));
    }
  })
);

module.exports = router;
