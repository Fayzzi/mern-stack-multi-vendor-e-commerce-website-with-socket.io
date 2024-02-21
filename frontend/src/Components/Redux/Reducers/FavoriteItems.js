import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  fav: localStorage.getItem("Favorites")
    ? JSON.parse(localStorage.getItem("Favorites"))
    : [],
};

export const favoriteSlice = createSlice({
  name: "Favorites",
  initialState,
  reducers: {
    addtoFavorites: (state, action) => {
      const Item = action.payload;
      const alreadyAdded = state.fav.find((i) => i._id === Item._id);
      if (alreadyAdded) {
        state.fav = state.fav.map((i) =>
          i._id === alreadyAdded._id ? Item : i
        );
      } else {
        state.fav = [...state.fav, Item];
      }
      localStorage.setItem("Favorites", JSON.stringify(state.fav));
    },
    removeFromFavorites: (state, action) => {
      const ItemToRemove = action.payload;
      state.fav = state.fav.filter((i) => i._id !== ItemToRemove._id);
      localStorage.setItem("Favorites", JSON.stringify(state.fav));
    },
  },
});
export const { addtoFavorites, removeFromFavorites } = favoriteSlice.actions;
export default favoriteSlice.reducer;
