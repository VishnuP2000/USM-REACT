
import { createSlice } from '@reduxjs/toolkit'

const savedUser = JSON.parse(localStorage.getItem("user"));//it is convert object in to json string

const initial_State = {
  user: savedUser?.user || null,
  token: savedUser?.token || null
};

const user = createSlice({
  name: "auth",
  initialState: initial_State,
  reducers: {
    login: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
    },
  },
});


export const {login,logout}=user.actions;

export default user.reducer