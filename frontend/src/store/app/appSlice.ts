import { createSlice } from "@reduxjs/toolkit";

interface AppState {
  currentPage: { label: string; path?: string; type: string } | null;
  snippetForm: { state: boolean; data: null };
  addFolder: boolean;
}

const initialState: AppState = {
  currentPage: null,
  snippetForm: { state: false, data: null },
  addFolder: false,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setCurrentPage(state, action) {
      state.currentPage = action.payload || null;
    },
    toggleAddSnippet(state, action) {
      state.snippetForm = {
        state: action.payload.state,
        data: action.payload.data,
      };
    },
    toggleAddFolder(state, action) {
      state.addFolder = action.payload;
    },
  },
});

export const { setCurrentPage, toggleAddSnippet, toggleAddFolder } =
  appSlice.actions;
export default appSlice.reducer;
