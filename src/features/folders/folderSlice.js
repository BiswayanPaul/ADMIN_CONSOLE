// src/features/folders/folderSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchFolders,
  createFolder,
  updateFolder,
  deleteFolder,
} from "../../services/api/folderApi";

export const loadFolders = createAsyncThunk(
  "folders/load",
  async ({ parentId, ownerId }) => {
    return await fetchFolders(parentId, ownerId);
  },
);

export const addFolder = createAsyncThunk(
  "folders/add",
  async (data, { rejectWithValue }) => {
    try {
      return await createFolder(data);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const editFolder = createAsyncThunk(
  "folders/edit",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await updateFolder(id, data);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const removeFolder = createAsyncThunk(
  "folders/remove",
  async (id, { rejectWithValue }) => {
    try {
      await deleteFolder(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

const folderSlice = createSlice({
  name: "folders",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Load
      .addCase(loadFolders.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadFolders.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
      })
      .addCase(loadFolders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add
      .addCase(addFolder.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      // Edit
      .addCase(editFolder.fulfilled, (state, action) => {
        const i = state.list.findIndex((f) => f.id === action.payload.id);
        if (i !== -1) state.list[i] = action.payload;
      })
      // Remove
      .addCase(removeFolder.fulfilled, (state, action) => {
        state.list = state.list.filter((f) => f.id !== action.payload);
      });
  },
});

export default folderSlice.reducer;
