const express = require("express");
const path = require("path");
const User = require("./../model/UserModel");
const seller = require("./../model/Shop");

const { upload } = require("../multer");
const ErrorHandler = require("../utils/ErrorHandler");
const fs = require("fs");
const router = express.Router();
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/SendMail");
const catchAsyncError = require("./../middleware/CatchAsynError");
const sendToken = require("../utils/JWTToken");
const CatchAsynError = require("./../middleware/CatchAsynError");
const { isAuthenticated } = require("../middleware/auth");
router.post("/create-user", upload.single("file"), async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      throw new ErrorHandler("Fill-Up all fields", 400);
    }
    if (!req.file) {
      throw new ErrorHandler("Please select an image", 400);
    }
    // Check if the user with the given email already exists
    const userEmail = await User.findOne({ email: email });
    if (userEmail) {
      const filename = req.file.filename;
      const filepath = "uploads/" + filename;
      fs.unlink(filepath, (err) => {
        if (err) {
          res.status(500).json({ message: "Error deleting file" });
        }
      });
      throw new ErrorHandler("User already exists", 400);
    }

    // Extract the filename from the uploaded file
    const filename = req.file.filename;

    const avatar = filename;

    // Create a new user
    const user = {
      name: name,
      email: email,
      password: password,
      avatar: avatar,
    };

    const activationToken = createActivationToken(user);
    const activationUrl = "http://localhost:5173/activation/" + activationToken;
    try {
      await sendMail({
        email: user.email,
        subject: "Activate your account",
        message: `Hello ${user.name}, please click the link to activate your account: ${activationUrl}`,
      });

      res.status(201).json({
        success: true,
        message: `Please check your email (${user.email}) for activating your account.`,
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
    // Pass the error to the error-handling middleware
    return next(new ErrorHandler(error.message, 400));
  }
});
//cresate activation token
const createActivationToken = (user) => {
  return jwt.sign(user, process.env.Activation_Token, {
    expiresIn: "5m",
  });
};
//actiavte user by sending mail
router.post(
  "/activation",
  catchAsyncError(async (req, res, next) => {
    try {
      const { activation_token } = req.body;
      const userData = jwt.verify(
        activation_token,
        process.env.Activation_Token
      );
      if (userData) {
        const { name, email, password, avatar } = userData;

        // Check if the user already exists
        let user = await User.findOne({ email: email });
        if (user) {
          return next(new ErrorHandler("User already exists!!", 500));
        }

        // Create a new user in the database
        user = await User.create({
          name,
          email,
          password,
          avatar,
        });

        // Respond with a token or any other necessary information
        sendToken(user, 201, res);
      } else {
        return next(new ErrorHandler("Invalid activation token", 400));
      }
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);
//loggin In user
router.post(
  "/login-user",
  CatchAsynError(async (req, res, next) => {
    // Added `next` parameter
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return next(new ErrorHandler("Invalid email or password", 400));
      }
      const user = await User.findOne({ email: email }).select("+password"); //select password from the database because we have selected as false in the schema
      if (!user) {
        return next(new ErrorHandler("User doesn't exist", 400));
      }
      const isPasswordValid = await user.comparePassword(password); // Added `await`
      if (!isPasswordValid) {
        return next(new ErrorHandler("Password is not valid", 400));
      }
      sendToken(user, 200, res);
    } catch (error) {
      // Handle the error appropriately, for example:
      next(new ErrorHandler(error.message, 500));
    }
  })
);
//Loading User
router.get(
  "/getuser",
  isAuthenticated,
  CatchAsynError(async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return next(new ErrorHandler("User doesn't exist", 400));
      }
      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {}
  })
);
//logout
router.post(
  "/logout",
  isAuthenticated,
  CatchAsynError(async (req, res, next) => {
    try {
      res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
      });
      res.status(201).json({
        success: true,
        message: "Log Out Successull",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);
//updating user info
router.put(
  "/updateuser",
  upload.single("image"),
  isAuthenticated,
  CatchAsynError(async (req, res, next) => {
    try {
      const { name, email, password, phoneNumber } = req.body;

      const existUser = await User.findOne({ email: email }).select(
        "+password"
      );
      if (existUser) {
        const ispasswordValid = await existUser.comparePassword(password);
        if (req.file) {
          const filename = req.file.filename;
          const avatar = filename;
          //removing current image from project
          const existing = existUser.avatar;
          const filepath = "uploads/" + existing;
          fs.unlink(filepath, (err) => {
            if (err) {
              console.log(err);
            }
          });

          if (ispasswordValid) {
            existUser.name = name;
            existUser.avatar = avatar;
            existUser.email = email;
            existUser.phoneNumber = phoneNumber;
            await existUser.save();
            res.json({
              user: existUser,
            });
          } else {
            return next(new ErrorHandler("Password is not correct!!", 500));
          }
        } else {
          if (ispasswordValid) {
            existUser.name = name;
            existUser.email = email;
            existUser.phoneNumber = phoneNumber;
            await existUser.save();
            res.json({
              user: existUser,
            });
          } else {
            return next(new ErrorHandler("Password is not correct!!", 500));
          }
        }
      } else {
        console.log(name, email);
      }
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);
//update user password
router.put(
  "/update-password",
  isAuthenticated,
  CatchAsynError(async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id).select("+password");
      const isPasswordMatched = await user.comparePassword(
        req.body.oldPassword
      );
      if (isPasswordMatched) {
        if (req.body.newPassword !== req.body.confirmPassword) {
          return next(new ErrorHandler("Passwords does not match!!", 500));
        } else {
          user.password = req.body.newPassword;
          await user.save();
          res.json({
            message: "Password changed successfully!",
          });
        }
      } else {
        return next(new ErrorHandler("old Password is not correct!!", 500));
      }
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);
//finding user information by id
router.get(
  "/get-user-data/:id",
  CatchAsynError(async (req, res, next) => {
    try {
      const userData = await User.findById(req.params.id);
      res.json({
        message: "successfully!",
        userData,
      });
    } catch (e) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);
//finding seller information by id
router.get(
  "/get-seller-data/:id",
  CatchAsynError(async (req, res, next) => {
    try {
      const userData = await seller.findById(req.params.id);
      res.json({
        message: "Seller found",
        userData,
      });
    } catch (e) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;
