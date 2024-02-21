const braintree = require("braintree");
const express = require("express");
const router = express.Router();
const CatchAsyncError = require("./../middleware/CatchAsynError");
const ErrorHandler = require("./../utils/ErrorHandler");
const { isAuthenticated } = require("./../middleware/auth");
const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

// Getting token from Braintree
router.get(
  "/get-braintree-token",
  CatchAsyncError(async (req, res, next) => {
    try {
      // Get token from Braintree
      gateway.clientToken.generate({}, function (err, response) {
        if (err) {
          return next(new ErrorHandler(err, 400));
        } else {
          res.send(response);
        }
      });
    } catch (e) {
      return next(new ErrorHandler(e.message, 400));
    }
  })
);

const OrderModel = require("./../model/OrderModel");

// Payments integration
router.post("/braintree-payments", isAuthenticated, async (req, res) => {
  try {
    const { nonce, totalPrice, eachShopDataInArray, shippingAddres, user } =
      req.body;

    // Using shopItemsMap to group items by shopId
    const shopItemsMap = new Map();

    for (const item of eachShopDataInArray) {
      const shopId = item.shopId; //  shopId is an object
      if (!shopItemsMap.has(shopId)) {
        shopItemsMap.set(shopId, []);
      }
      shopItemsMap.get(shopId).push(item);
    }

    const orders = [];

    // Wrap the asynchronous operation in a Promise
    const result = await new Promise((resolve, reject) => {
      gateway.transaction.sale(
        {
          amount: totalPrice,
          paymentMethodNonce: nonce,
          options: {
            submitForSettlement: true,
          },
        },
        function (err, result) {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });

    if (result.success) {
      for (const [shopId, items] of shopItemsMap) {
        const singleOrder = await OrderModel.create({
          eachShopDataInArray: items,
          paymentInfo: {
            id: result.transaction.id,
            type: result.transaction.type,
            status: result.transaction.status,
          },

          user: user,
          totalPrice: totalPrice,
          shippingAddres: shippingAddres,
        });
        orders.push(singleOrder);
      }

      console.log(orders);
      res.json({ ok: true, orders });
    } else {
      res.json({ ok: false, message: "Transaction failed", result });
    }
  } catch (e) {
    res.status(500).json({ ok: false, message: e.message });
  }
});

module.exports = router;
