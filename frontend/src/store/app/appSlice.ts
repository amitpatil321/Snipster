import { createSlice } from "@reduxjs/toolkit";

interface AppState {
  currentPage: { label: string; path?: string; type: string } | null;
  snippetForm: { state: boolean; data: null };
}

const initialState: AppState = {
  currentPage: null,
  snippetForm: { state: false, data: null },
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
  },
});

export const { setCurrentPage, toggleAddSnippet } = appSlice.actions;
export default appSlice.reducer;
