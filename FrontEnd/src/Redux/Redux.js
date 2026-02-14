
import { createSlice } from '@reduxjs/toolkit'


console.log('it is redux')
const initial_State={
  user:null,
  token:null
}

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