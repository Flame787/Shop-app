// Redux Toolkit store-slice for 'isLoggedIn'-state (authentification), role ("user" / "admin"), user-object, token (JWT), actions (login, logout)

import { createSlice } from "@reduxjs/toolkit";

// defining initial state, which will be added to 'createSlice' function
const initialState = {
  isLoggedIn: false,
  role: null,
  user: null,
  token: null,
  openLoginModal: false,
};

// createSlice contains reducer-functions (reducers) which use Immer library to enable changing state in immutable way (no spread-operator needed)
const authSlice = createSlice({  
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isLoggedIn = true;
      state.role = action.payload.role;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.openLoginModal = false;       // close Modal after login was successful
    },
    logout: (state, action) => {
      state.isLoggedIn = false;
      state.role = null;
      state.user = null;
      state.token = null;
    },
    openModal: (state) => {
      state.openLoginModal = true;
    },
    closeModal: (state) => {
      state.openLoginModal = false;
    },
  },
});

export const { login, logout, openModal, closeModal } = authSlice.actions;
export default authSlice.reducer;
