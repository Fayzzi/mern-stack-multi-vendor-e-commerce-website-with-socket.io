import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const initialState = {
  EventLoading: true,
  uploadEventSuccess: false,
  Events: [],
  EventError: null,
  HomepageEvents: [],
  shopEvents: [],
  shopEventsLoading: true,
  HomepageEventsLoading: true,
};
export const uploadEvent = createAsyncThunk(
  "/upload-Event",
  async ({ data }, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/v2/event/create-event", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data.EventNew;
    } catch (error) {
      if (error.response) {
        return rejectWithValue(error.response.data.message);
      }
    }
  }
);
//seller Events dashboard
export const getAllEvents = createAsyncThunk("/get-events", async ({ id }) => {
  const response = await axios.get("/api/v2/event/getall-events/" + id);
  return response.data.allEvents;
});
export const deleteSingleEvent = createAsyncThunk(
  "/delete-event",
  async (id) => {
    await axios.delete("/api/v2/event/delete-event/" + id);
    return id;
  }
);
//homepageEvents
export const getAllEventHomepage = createAsyncThunk(
  "/get-events-homepage",
  async () => {
    const response = await axios.get("/api/v2/event/show-all-homepage-events");
    return response.data;
  }
);
//Each shop events by params
export const getAllShopEvents = createAsyncThunk(
  "/get-events-by-shop",
  async ({ id }) => {
    const response = await axios.get(
      "/api/v2/event/getall-events-byShop/" + id
    );
    return response.data.allEventsbyShop;
  }
);
export const eventReducer = createSlice({
  name: "events",
  initialState,
  reducers: {
    resetAll: (state, action) => {
      state.uploadEventSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllEventHomepage.pending, (state) => {
        state.HomepageEventsLoading = true;
      })
      .addCase(getAllEventHomepage.fulfilled, (state, action) => {
        state.HomepageEventsLoading = false;
        state.HomepageEvents = action.payload;
      })
      .addCase(getAllShopEvents.pending, (state) => {
        state.shopEventsLoading = true;
      })
      .addCase(getAllShopEvents.fulfilled, (state, action) => {
        state.shopEventsLoading = false;
        state.shopEvents = action.payload;
      })
      .addCase(uploadEvent.pending, (state) => {
        state.EventLoading = true;
      })
      .addCase(uploadEvent.fulfilled, (state, action) => {
        state.EventLoading = false;
        state.Events.push(action.payload);
        state.uploadEventSuccess = true;
      })
      .addCase(uploadEvent.rejected, (state, action) => {
        state.EventLoading = false;
        state.EventError = action.payload;
      })
      .addCase(getAllEvents.pending, (state) => {
        state.EventLoading = true;
      })
      .addCase(getAllEvents.fulfilled, (state, action) => {
        state.EventLoading = false;
        state.Events = action.payload;
      })
      .addCase(getAllEvents.rejected, (state, action) => {
        state.EventLoading = false;
        state.EventError = action.error.message;
      })
      .addCase(deleteSingleEvent.fulfilled, (state, action) => {
        state.EventLoading = false;
        state.Events = state.Events.filter((p) => p._id !== action.payload);
      });
  },
});
export const { resetAll } = eventReducer.actions;
export default eventReducer.reducer;
