import { configureStore } from "@reduxjs/toolkit";
import appReducer from "store/app/appSlice";
import authReducer from "store/auth/authSlice";

export const store = configureStore({
  reducer: {
    app: appReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
