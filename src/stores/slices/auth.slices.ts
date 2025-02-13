import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GlobalUserDto } from "@/types/type.ts";

export interface IAuthState {
  user: GlobalUserDto | null;
  token: string | null;
}

const initialState: IAuthState = {
  user: null,
  token: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<IAuthState>) {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    unsetUser(state) {
      state.user = null;
      state.token = null;
    },
  },
});

export const { setUser, unsetUser } = authSlice.actions;

export default authSlice.reducer;
