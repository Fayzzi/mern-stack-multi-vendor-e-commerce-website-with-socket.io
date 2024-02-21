import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const initialState = {
  productLoading: true,
  uploadSuccess: false,
  products: [],
  productError: null,
  homePageProducts: null,
  homePageProductLoading: false,
};
export const uploadProduct = createAsyncThunk(
  "/upload-product",
  async ({ data }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "/api/v2/product/create-product",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data.product;
    } catch (error) {
      if (error.response) {
        return rejectWithValue(error.response.data.message);
      }
    }
  }
);
//seller dashboard products
export const getAllProducts = createAsyncThunk(
  "/get-product",
  async ({ id }) => {
    const response = await axios.get("/api/v2/product/getall-products/" + id);
    return response.data.allproducts;
  }
);
//getting all available products to show on homepage
export const homapageProducts = createAsyncThunk("/get-homepage", async () => {
  const response = await axios.get("/api/v2/product/get-all-homepage-products");
  return response.data;
});
export const deleteSingle = createAsyncThunk("/delete-product", async (id) => {
  await axios.delete("/api/v2/product/delete-product/" + id);
  return id;
});

export const productReducer = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(homapageProducts.pending, (state) => {
        state.homePageProductLoading = true;
      })
      .addCase(homapageProducts.fulfilled, (state, action) => {
        state.homePageProductLoading = false;
        state.homePageProducts = action.payload;
      })
      .addCase(uploadProduct.pending, (state) => {
        state.productLoading = true;
      })
      .addCase(uploadProduct.fulfilled, (state, action) => {
        state.productLoading = false;
        state.products.push(action.payload);
        state.uploadSuccess = true;
      })
      .addCase(uploadProduct.rejected, (state, action) => {
        state.productLoading = false;
        state.productError = action.payload;
      })
      .addCase(getAllProducts.pending, (state) => {
        state.productLoading = true;
      })
      .addCase(getAllProducts.fulfilled, (state, action) => {
        state.productLoading = false;
        state.products = action.payload;
      })
      .addCase(getAllProducts.rejected, (state, action) => {
        state.productLoading = false;
        state.productError = action.error.message;
      })
      .addCase(deleteSingle.fulfilled, (state, action) => {
        state.productLoading = false;
        state.products = state.products.filter((p) => p._id !== action.payload);
        state.homePageProducts = state.homePageProducts.filter(
          (p) => p._id !== action.payload
        );
      });
  },
});
export default productReducer.reducer;
