import { createSlice } from "@reduxjs/toolkit";

interface AppState {
  currentPage: { label: string; path?: string } | null;
}

const initialState: AppState = {
  currentPage: null,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setCurrentPage(state, action) {
      state.currentPage = action.payload || null;
    },
  },
});

export const { setCurrentPage } = appSlice.actions;
export default appSlice.reducer;
