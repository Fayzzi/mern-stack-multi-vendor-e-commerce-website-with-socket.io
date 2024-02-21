import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: localStorage.getItem("cartItems")
    ? JSON.parse(localStorage.getItem("cartItems"))
    : [],
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const isItemExist = state.cart.find((i) => i._id === item._id);
      //if item exist it simply update the item
      if (isItemExist) {
        state.cart = state.cart.map((i) =>
          i._id === isItemExist._id ? item : i
        );
      } else {
        state.cart = [...state.cart, item];
      }
      // Update localStorage with the new cart state
      localStorage.setItem("cartItems", JSON.stringify(state.cart));
    },
    removeFromCart: (state, action) => {
      const itemIdToRemove = action.payload;
      const updatedCart = state.cart.filter(
        (item) => item._id !== itemIdToRemove._id
      );
      state.cart = updatedCart;

      // Update localStorage with the updated cart state
      localStorage.setItem("cartItems", JSON.stringify(updatedCart));
    },
    clearCart: (state) => {
      state.cart = [];

      // Clear localStorage
      localStorage.removeItem("cartItems");
      localStorage.removeItem("latest-array");
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
