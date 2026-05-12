// Redux Toolkit store-slice for 'isLoggedIn'-state (authentification), role ("user" / "admin"), user-object, token (JWT), actions (login, logout)

import { createSlice } from "@reduxjs/toolkit";

// defining initial state, which will be added to 'createSlice' function
const initialState = {
  isLoggedIn: false,
  role: null,
  user: null,
  token: null,
  modalType: null, // 'login' or 'signup'
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
      state.modalType = null;       // close Modal after login was successful
    },
    logout: (state, action) => {
      state.isLoggedIn = false;
      state.role = null;
      state.user = null;
      state.token = null;
    },
    restoreSession: (state, action) => {
      // Used to restore session from HttpOnly cookie on app load
      state.isLoggedIn = true;
      state.role = action.payload.role;
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    openLoginModal: (state) => {
      state.modalType = 'login';
    },
    openSignupModal: (state) => {
      state.modalType = 'signup';
    },
    closeModal: (state) => {
      state.modalType = null;
    },
  },
});

export const { login, logout, restoreSession, setToken, openLoginModal, openSignupModal, closeModal } = authSlice.actions;
export default authSlice.reducer;
