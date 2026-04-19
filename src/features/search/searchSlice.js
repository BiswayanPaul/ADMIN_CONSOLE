// src/features/search/searchSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { searchItems, fetchSuggestions } from "../../services/api/searchApi";

// Search user's own storage
export const searchUserItems = createAsyncThunk(
  "search/searchUserItems",
  async ({ query, ownerId }, { rejectWithValue }) => {
    try {
      return await searchItems(query, ownerId);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

// Fetch suggestions from global DB (Feature #4)
export const loadSuggestions = createAsyncThunk(
  "search/loadSuggestions",
  async (query, { rejectWithValue }) => {
    try {
      return await fetchSuggestions(query);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

const searchSlice = createSlice({
  name: "search",
  initialState: {
    query: "",
    results: { folders: [], files: [] },
    suggestions: [],
    loading: false,
    suggestionsLoading: false,
    error: null,
    isOpen: false,
  },
  reducers: {
    setQuery: (state, action) => {
      state.query = action.payload;
    },
    clearSearch: (state) => {
      state.query = "";
      state.results = { folders: [], files: [] };
      state.suggestions = [];
      state.isOpen = false;
      state.error = null;
    },
    openSearch: (state) => {
      state.isOpen = true;
    },
    closeSearch: (state) => {
      state.isOpen = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchUserItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchUserItems.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload;
      })
      .addCase(searchUserItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loadSuggestions.pending, (state) => {
        state.suggestionsLoading = true;
      })
      .addCase(loadSuggestions.fulfilled, (state, action) => {
        state.suggestionsLoading = false;
        state.suggestions = action.payload;
      })
      .addCase(loadSuggestions.rejected, (state) => {
        state.suggestionsLoading = false;
      });
  },
});

export const { setQuery, clearSearch, openSearch, closeSearch } =
  searchSlice.actions;
export default searchSlice.reducer;
