// src/components/SearchBar.jsx
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setQuery,
  clearSearch,
  searchUserItems,
  loadSuggestions,
} from "../features/search/searchSlice";
import { addFile } from "../features/files/fileSlice";
import { addFolder } from "../features/folders/folderSlice";
import { useNavigate } from "react-router-dom";

// Debounce hook
function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function SearchBar({ currentFolderId }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { query, results, suggestions, loading, suggestionsLoading } =
    useSelector((state) => state.search);
  const { user } = useSelector((state) => state.auth);

  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);
  const wrapperRef = useRef(null);

  const debouncedQuery = useDebounce(query, 400);

  const hasResults = results.folders.length > 0 || results.files.length > 0;
  const noResults = !loading && debouncedQuery.trim().length > 0 && !hasResults;
  const showDropdown = focused && debouncedQuery.trim().length > 0;

  // ── Trigger search when debounced query changes ──────────
  useEffect(() => {
    if (!debouncedQuery.trim()) return;
    dispatch(searchUserItems({ query: debouncedQuery, ownerId: user?.id }));
  }, [debouncedQuery, dispatch, user?.id]);

  // ── Load global suggestions when user has no results ─────
  useEffect(() => {
    if (noResults && debouncedQuery.trim()) {
      dispatch(loadSuggestions(debouncedQuery));
    }
  }, [noResults, debouncedQuery, dispatch]);

  // ── Close dropdown on outside click ──────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setFocused(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleClear = () => {
    dispatch(clearSearch());
    inputRef.current?.focus();
  };

  // Navigate to the folder that contains a result item
  const handleResultClick = (item, type) => {
    setFocused(false);
    dispatch(clearSearch());
    if (type === "folder") {
      navigate("/root/" + item.name.toLowerCase());
    }
    // For files you can extend this to open a preview modal later
  };

  // Add a global-DB suggested item to user's current folder
  const handleAddSuggestion = (item) => {
    if (item.type === "folder") {
      dispatch(
        addFolder({
          name: item.name,
          parentId: currentFolderId ?? null,
          ownerId: user?.id,
          color: "blue",
        }),
      );
    } else {
      dispatch(
        addFile({
          name: item.name,
          parentId: currentFolderId ?? null,
          ownerId: user?.id,
          type: item.type,
          icon: item.icon,
        }),
      );
    }
    setFocused(false);
    dispatch(clearSearch());
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-md">
      {/* Input */}
      <div className="flex items-center border rounded-lg bg-white shadow-sm px-3 py-2 gap-2">
        <span className="text-gray-400">🔍</span>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => dispatch(setQuery(e.target.value))}
          onFocus={() => setFocused(true)}
          placeholder="Search files and folders..."
          className="flex-1 text-sm outline-none bg-transparent"
        />
        {query && (
          <button
            onClick={handleClear}
            className="text-gray-400 hover:text-gray-600 text-lg leading-none"
          >
            ×
          </button>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
          {/* Loading spinner */}
          {loading && (
            <div className="px-4 py-3 text-sm text-gray-400">Searching...</div>
          )}

          {/* ── User's results ── */}
          {!loading && hasResults && (
            <>
              {results.folders.length > 0 && (
                <div>
                  <p className="px-4 pt-3 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Folders
                  </p>
                  {results.folders.map((folder) => (
                    <div
                      key={folder.id}
                      onClick={() => handleResultClick(folder, "folder")}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-blue-50 cursor-pointer"
                    >
                      <span>📁</span>
                      <div>
                        <p className="text-sm font-medium">{folder.name}</p>
                        <p className="text-xs text-gray-400">Folder</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {results.files.length > 0 && (
                <div className={results.folders.length > 0 ? "border-t" : ""}>
                  <p className="px-4 pt-3 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Files
                  </p>
                  {results.files.map((file) => (
                    <div
                      key={file.id}
                      onClick={() => handleResultClick(file, "file")}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-blue-50 cursor-pointer"
                    >
                      <span>{file.icon || "📄"}</span>
                      <div>
                        <p className="text-sm font-medium">{file.name}</p>
                        <p className="text-xs text-gray-400 capitalize">
                          {file.type}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* ── No results → show global suggestions (Feature #4) ── */}
          {noResults && (
            <div>
              <div className="px-4 pt-3 pb-1 border-b">
                <p className="text-sm text-gray-500">
                  No results in your storage.
                </p>
              </div>

              {suggestionsLoading && (
                <div className="px-4 py-3 text-sm text-gray-400">
                  Loading suggestions...
                </div>
              )}

              {!suggestionsLoading && suggestions.length > 0 && (
                <div>
                  <p className="px-4 pt-3 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Suggested from database
                  </p>
                  {suggestions.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between px-4 py-2 hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <span>{item.icon}</span>
                        <div>
                          <p className="text-sm font-medium">{item.name}</p>
                          <p className="text-xs text-gray-400 capitalize">
                            {item.type}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleAddSuggestion(item)}
                        className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                      >
                        + Add
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {!suggestionsLoading && suggestions.length === 0 && (
                <div className="px-4 py-3 text-sm text-gray-400">
                  No suggestions found either.
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
