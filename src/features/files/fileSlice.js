// src/features/files/fileSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchFiles,
  createFile,
  updateFile,
  deleteFile,
} from "../../services/api/fileApi";

export const loadFiles = createAsyncThunk(
  "files/load",
  async ({ parentId, ownerId }) => {
    return await fetchFiles(parentId, ownerId);
  },
);

export const addFile = createAsyncThunk(
  "files/add",
  async (data, { rejectWithValue }) => {
    try {
      return await createFile(data);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const editFile = createAsyncThunk(
  "files/edit",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await updateFile(id, data);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const removeFile = createAsyncThunk(
  "files/remove",
  async (id, { rejectWithValue }) => {
    try {
      await deleteFile(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

const fileSlice = createSlice({
  name: "files",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadFiles.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadFiles.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
      })
      .addCase(loadFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addFile.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(editFile.fulfilled, (state, action) => {
        const i = state.list.findIndex((f) => f.id === action.payload.id);
        if (i !== -1) state.list[i] = action.payload;
      })
      .addCase(removeFile.fulfilled, (state, action) => {
        state.list = state.list.filter((f) => f.id !== action.payload);
      });
  },
});

export default fileSlice.reducer;
