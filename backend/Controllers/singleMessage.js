const messages = require("./../model/singleMessage");
const ErrorHandeler = require("./../utils/ErrorHandler");
const CatchAsyncErrors = require("./../middleware/CatchAsynError");
const express = require("express");
const router = express.Router();
const { upload } = require("./../multer");
//create a new message
router.post(
  "/create-new-message",
  upload.array("images"),
  CatchAsyncErrors(async (req, res, next) => {
    try {
      if (req.files) {
        //allfiles
        const files = req.files;
        const imageUrls = files.map((file) => file.filename);

        const newMessage = await messages.create({
          sender: req.body.sender,
          images: imageUrls,
          text: req.body.text,
          conversationId: req.body.conversationId,
        });
        res.status(200).json({
          success: true,
          newMessage,
        });
      } else {
        const newMessage = await messages.create({
          sender: req.body.sender,
          conversationId: req.body.conversationId,
          text: req.body.text,
        });
        res.status(200).json({
          success: true,
          newMessage,
        });
      }
    } catch (error) {
      return next(new ErrorHandeler(error.message, 500));
    }
  })
);
//get all messages
router.get(
  "/get-all-messages/:id",
  CatchAsyncErrors(async (req, res, next) => {
    try {
      const allmessages = await messages.find({
        conversationId: req.params.id,
      });
      res.status(200).json({
        success: true,
        allmessages,
      });
    } catch (e) {
      return next(new ErrorHandeler(e.message, 500));
    }
  })
);

module.exports = router;
