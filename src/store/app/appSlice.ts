import { createSlice } from "@reduxjs/toolkit";

interface AppState {
  currentPage: { label: string; path?: string } | null;
  addSnippetOpen: boolean;
}

const initialState: AppState = {
  currentPage: null,
  addSnippetOpen: false,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setCurrentPage(state, action) {
      state.currentPage = action.payload || null;
    },
    toggleAddSnippet(state, action) {
      state.addSnippetOpen = action.payload;
    },
  },
});

export const { setCurrentPage, toggleAddSnippet } = appSlice.actions;
export default appSlice.reducer;
