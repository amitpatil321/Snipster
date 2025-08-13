import { createSelector } from "@reduxjs/toolkit";

import { type RootState } from "@/store/index";

export const selectAuthUser = (state: RootState) => state.auth.user;

export const selectAuthUserId = createSelector(
  [selectAuthUser],
  (user) => user?.authId,
);
