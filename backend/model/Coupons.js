const mongoose = require("mongoose");
const CouponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    discount: {
      type: Number,
      required: true,
    },
    minAmount: {
      type: Number,
    },
    maxAmount: {
      type: Number,
    },

    shopInfo: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Shops",
    },
    selectedProduct: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Coupons", CouponSchema);
