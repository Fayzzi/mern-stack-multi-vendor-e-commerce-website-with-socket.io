const express = require("express");
const router = express.Router();
const Order = require("./../model/OrderModel");
const CatchAsyncError = require("./../middleware/CatchAsynError");
const stripe = require("stripe")(process.env.STRIP_SECRET_KEY);
// router.post(
//   "/payment/process",
//   CatchAsyncError(async (req, res, next) => {
//     const myPayment = await stripe.paymentIntents.create({
//       amount: req.body.amount,
//       currency: "INR",
//       metadata: {
//         company: "Faizan",
//       },
//     });
//     res.status(200).json({
//       success: true,
//       client_secret: myPayment.client_secret,
//     });
//   })
// );
// router.get(
//   "/stripeapikey",
//   CatchAsyncError(async (req, res, next) => {
//     res.status(200).json({ stripApiKey: process.env.STRIPE_API_KEY });
//   })
// );
router.post(
  "/cash-on-delivery",
  CatchAsyncError(async (req, res, next) => {
    try {
      const { totalPrice, cart, shippingAddres, user, shippingPrice } =
        req.body;
      const filterByshop = new Map();

      for (const item of cart) {
        const productID = item._id;

        if (!filterByshop.has(productID)) {
          filterByshop.set(productID, []);
        }

        filterByshop.get(productID).push(item);
      }

      const orders = [];

      for (const [productID, items] of filterByshop) {
        const singleOrder = await Order.create({
          cart: items,
          shopId: items[0].shopInfo._id,
          paymentInfo: {
            type: "Cash on delivery",
          },
          user: user,
          totalPrice: items.reduce(
            (acc, item) => acc + item.discountPrice * item.qty,
            0
          ),
          shippingAddres: shippingAddres,
          shippingPrice: items.reduce(
            (acc, item) => acc + item.discountPrice * 0.1,
            0
          ),
        });
        orders.push(singleOrder);
      }

      res.status(200).json({
        success: true,
        orders,
        message: "Success",
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  })
);

module.exports = router;
