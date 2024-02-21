// userSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isAuthenticated: false,
  user: null,
  loading: true,
  error: null,
  updateAddressSuccess: false,
  updateAddressError: null,
};

export const GetUser = createAsyncThunk("user/getUserSingle", async () => {
  const response = await axios.get("/api/v2/user/getuser");
  return response.data.user;
});

export const LogoutUser = createAsyncThunk("user/logout", async () => {
  await axios.post("/api/v2/user/logout");
});

export const uploadAddress = createAsyncThunk(
  "user/uploadAddress",
  async ({ data }, { rejectWithValue }) => {
    try {
      const response = await axios.put("/api/v2/address/create-address", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        return rejectWithValue(error.response.data.message);
      }
      // Handle other types of errors if needed
      throw error;
    }
  }
);

export const updateUserData = createAsyncThunk(
  "user/updateUserData",
  async ({ data }, { rejectWithValue }) => {
    try {
      const response = await axios.put("/api/v2/user/updateuser", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data.user;
    } catch (error) {
      if (error.response) {
        return rejectWithValue(error.response.data.message);
      }
      // Handle other types of errors if needed
      throw error;
    }
  }
);

export const deleteAddress = createAsyncThunk(
  "user/deleteAddress",
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        "/api/v2/address/delete-address/" + id
      );
      return response.data; // Assuming your server returns the deleted address ID
    } catch (error) {
      if (error.response) {
        return rejectWithValue(error.response.data.message);
      }
      // Handle other types of errors if needed
      throw error;
    }
  }
);

const UserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
      state.updateAddressError = null;
      state.updateAddressSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(GetUser.pending, (state) => {
        state.isAuthenticated = false;
        state.loading = true;
      })
      .addCase(GetUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(GetUser.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.loading = false;
        state.user = null;
        state.error = action.error.message;
      })
      .addCase(LogoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.loading = false;
        state.user = null;
        state.error = null;
      })
      .addCase(updateUserData.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUserData.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(updateUserData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(uploadAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.updateAddressError = null;
        state.updateAddressSuccess = true;
      })
      .addCase(uploadAddress.rejected, (state, action) => {
        state.loading = false;
        state.updateAddressSuccess = false;
        state.updateAddressError = action.payload;
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.updateAddressSuccess = true;
        state.updateAddressError = null;
      })
      .addCase(deleteAddress.rejected, (state, action) => {
        state.loading = false;
        state.updateAddressError = action.payload;
      });
  },
});
export const { clearErrors } = UserSlice.actions;

export default UserSlice.reducer;
