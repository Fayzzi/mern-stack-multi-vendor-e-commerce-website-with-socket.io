import { createAsyncThunk, createReducer, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isSeller: false,
  isSellerLoading: true,
  seller: null,
  sellerError: null,
  shopProductLoading: true,
  ShopProducts: null,
};
export const getSeller = createAsyncThunk("/getSeller", async () => {
  const response = await axios.get("/api/v2/shop/getShop");
  return response.data.seller;
});
export const getEveryShopProducts = createAsyncThunk(
  "/get-products",
  async (id) => {
    const response = await axios.get("/api/v2/product/shop-products/" + id);
    return response.data;
  }
);
export const LogoutSeller = createAsyncThunk("/LogoutSeller", async () => {
  await axios.post("/api/v2/shop/sellerLogout");
});
export const sellerReducer = createSlice({
  name: "seller",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getSeller.pending, (state) => {
        state.isSellerLoading = true;
      })
      .addCase(getSeller.fulfilled, (state, action) => {
        state.isSellerLoading = false;
        state.seller = action.payload;
        state.isSeller = true;
      })
      .addCase(getSeller.rejected, (state, action) => {
        state.isSellerLoading = false;
        state.isSeller = false;
        state.seller = null;
        state.sellerError = action.error.message;
      })
      .addCase(LogoutSeller.fulfilled, (state) => {
        state.isSellerLoading = false;
        state.seller = null;
        state.isSeller = false;
      })
      .addCase(getEveryShopProducts.pending, (state) => {
        state.shopProductLoading = true;
      })
      .addCase(getEveryShopProducts.fulfilled, (state, action) => {
        state.shopProductLoading = false;
        state.ShopProducts = action.payload;
      });
  },
});
export default sellerReducer.reducer;
