import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./Reducers/UserReducer";
import sellerReducer from "./Reducers/SellerReducer";
import productReducer from "./Reducers/ProductReducer";
import eventReducer from "./Reducers/EventReducer";
import couponReducer from "./Reducers/CouponsReducer";
import cart from "./Reducers/CartItems";
import fav from "./Reducers/FavoriteItems";
import orders from "./Reducers/Allorders";
const Store = configureStore({
  reducer: {
    user: userReducer,
    seller: sellerReducer,
    products: productReducer,
    events: eventReducer,
    coupons: couponReducer,
    cart: cart,
    fav: fav,
    orders: orders,
  },
});
export default Store;
