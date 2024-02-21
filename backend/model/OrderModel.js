const mongoose = require("mongoose");
const OrderSchema = new mongoose.Schema({
  cart: {
    type: [],
    required: true,
  },
  shippingAddres: {
    type: Object,
    required: true,
  },
  shopId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  user: {
    type: Object,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  shippingPrice: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    default: "Processing",
  },
  paymentInfo: {
    id: { type: String },
    type: { type: String },
    status: { type: String },
  },

  paidAt: {
    type: Date,
    default: Date.now(),
  },
  deliveredAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});
module.exports = mongoose.model("Orders", OrderSchema);
