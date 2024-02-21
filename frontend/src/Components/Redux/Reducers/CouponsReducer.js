import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  coupons: [],
  couponLoading: true,
  couponError: null,
  couponUploadSuccess: false,
};
export const deleteOneCoupon = createAsyncThunk(
  "/delete-one",
  async ({ id }, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/v2/coupon/delete-coupon/${id}`);
      return id;
    } catch (error) {
      if (error.response) {
        return rejectWithValue(error.response.data.message);
      }
    }
  }
);
export const uploadCoupon = createAsyncThunk(
  "/upload-coupon",
  async ({ data }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "/api/v2/coupon/create-coupon-code",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data.newCoupon;
    } catch (error) {
      if (error.response) {
        return rejectWithValue(error.response.data.message);
      }
    }
  }
);
export const getAllCoupons = createAsyncThunk(
  "/getAll",
  async ({ id }, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/v2/coupon/get-all-coupons/` + id);
      return data.getAllCoupons;
    } catch (error) {
      if (error.response) {
        return rejectWithValue(error.response.data.message);
      }
    }
  }
);

const CouponReducer = createSlice({
  name: "couponReducer",
  initialState,
  reducers: {
    clearErrorsofCoupon: (state) => {
      state.couponError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteOneCoupon.fulfilled, (state, action) => {
        state.couponLoading = false;
        state.couponError = null;
        state.coupons = state.coupons.filter((c) => c._id !== action.payload);
      })
      .addCase(uploadCoupon.fulfilled, (state, action) => {
        state.couponLoading = false;
        state.coupons.push(action.payload);
        state.couponUploadSuccess = true;
        state.couponError = null;
      })
      .addCase(uploadCoupon.rejected, (state, action) => {
        state.couponLoading = false;
        state.couponError = action.payload;
        state.couponUploadSuccess = false;
      })
      .addCase(deleteOneCoupon.rejected, (state, action) => {
        state.couponLoading = false;
        state.couponError = action.payload;
      })

      .addCase(getAllCoupons.fulfilled, (state, action) => {
        state.couponLoading = false;
        state.coupons = action.payload;
        state.couponError = null;
      })
      .addCase(getAllCoupons.rejected, (state, action) => {
        state.couponLoading = false;
        state.couponError = action.payload;
      });
  },
});
export const { clearErrorsofCoupon } = CouponReducer.actions;
export default CouponReducer.reducer;
