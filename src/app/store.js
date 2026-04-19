// src/app/store.js
import { configureStore } from "@reduxjs/toolkit";
import folderReducer from "../features/folders/folderSlice";
import fileReducer from "../features/files/fileSlice";
import authReducer from "../features/auth/authSlice";
import searchReducer from "../features/search/searchSlice"; // ← ADD

export const store = configureStore({
  reducer: {
    auth: authReducer,
    folders: folderReducer,
    files: fileReducer,
    search: searchReducer, // ← ADD
  },
});
