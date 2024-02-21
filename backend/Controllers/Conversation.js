const conversation = require("./../model/Message");
const ErrorHandeler = require("./../utils/ErrorHandler");
const CatchAsyncErrors = require("./../middleware/CatchAsynError");
const express = require("express");
const router = express.Router();
const {
  SellerAuthenticated,
  isAuthenticated,
} = require("./../middleware/auth");
//create a new conversation
router.post(
  "/create-new-conversation",
  CatchAsyncErrors(async (req, res, next) => {
    try {
      const { groupTitle, userId, sellerId } = req.body;
      const isExistingRoom = await conversation.findOne({
        groupTitle: groupTitle,
      });
      if (isExistingRoom) {
        res.status(200).json({
          success: true,
          isExistingRoom,
        });
      } else {
        const newConversationRoom = await conversation.create({
          members: [userId, sellerId],
          groupTitle: groupTitle,
        });
        res.status(200).json({
          success: true,
          newConversationRoom,
        });
      }
    } catch (error) {
      return next(new ErrorHandeler(error.message, 400));
    }
  })
);
//getting seller Conversation
router.get(
  "/get-seller-conversation/:sellerId",
  SellerAuthenticated,
  CatchAsyncErrors(async (req, res, next) => {
    try {
      const allConversations = await conversation
        .find({
          members: { $in: [req.params.sellerId] },
        })
        .sort({
          updatedAt: -1,
        });
      res.status(200).json({
        success: true,
        allConversations,
      });
    } catch (e) {
      return next(new ErrorHandeler(error.message, 400));
    }
  })
);
//updating last message
router.put(
  "/update-last-conversation/:id",
  CatchAsyncErrors(async (req, res, next) => {
    try {
      const { lastMessage, lastMessageId } = req.body;
      const conversationtoupdate = await conversation.findByIdAndUpdate(
        req.params.id,
        {
          lastMessage,
          lastMessageID: lastMessageId,
        }
      );
      res.status(200).json({
        success: true,
        conversationtoupdate,
      });
    } catch (error) {
      return next(new ErrorHandeler(error.message, 400));
    }
  })
);
//getting user conversations
router.get(
  "/get-user-conversation/:userID",
  isAuthenticated,
  CatchAsyncErrors(async (req, res, next) => {
    try {
      const allConversations = await conversation
        .find({
          members: { $in: [req.params.userID] },
        })
        .sort({
          updatedAt: -1,
        });
      res.status(200).json({
        success: true,
        allConversations,
      });
    } catch (e) {
      return next(new ErrorHandeler(error.message, 400));
    }
  })
);
module.exports = router;
