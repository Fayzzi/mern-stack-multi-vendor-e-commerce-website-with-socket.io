import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const initialState = {
  orderLoading: true,
  orders: [],
  orderError: null,
  shoporderLoading: true,
  shoporders: [],
  shoporderError: null,
};
export const getAllOrders = createAsyncThunk("/get-orders", async ({ id }) => {
  const response = await axios.get("/api/v2/orders/get-all-order/" + id);
  return response.data.orders;
});
export const getAllShopOrders = createAsyncThunk(
  "/get-shop-orders",
  async ({ id }) => {
    const response = await axios.get("/api/v2/shop/get-shop-orders/" + id);
    return response.data.shopAllOrders;
  }
);
export const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllOrders.pending, (state) => {
        state.orderLoading = true;
      })
      .addCase(getAllOrders.fulfilled, (state, action) => {
        state.orderLoading = false;
        state.orders = action.payload;
      })
      .addCase(getAllOrders.rejected, (state, action) => {
        state.orderLoading = false;
        state.orderError = action.error.message;
      })
      .addCase(getAllShopOrders.pending, (state) => {
        state.shoporderLoading = true;
      })
      .addCase(getAllShopOrders.fulfilled, (state, action) => {
        state.shoporderLoading = false;
        state.shoporders = action.payload;
      })
      .addCase(getAllShopOrders.rejected, (state, action) => {
        state.shoporderLoading = false;
        state.shoporderError = action.error.message;
      });
  },
});

export default ordersSlice.reducer;
