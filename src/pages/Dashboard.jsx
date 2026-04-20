// src/pages/Dashboard.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import SearchBar from "../components/SearchBar";
import {
  loadFolders,
  addFolder,
  editFolder,
  removeFolder,
} from "../features/folders/folderSlice";
import {
  loadFiles,
  addFile,
  editFile,
  removeFile,
} from "../features/files/fileSlice";
import { useNavigate, useLocation } from "react-router-dom";
import { logoutUser } from "../features/auth/authSlice";
import Breadcrumb from "../components/Breadcrumb";
import FolderItem from "../components/FolderItem";
import FileItem from "../components/FileItem";
import { getFolderIdFromPath, getPathArray } from "../utils/pathUtils";
import { folders as allFolders } from "../services/mock/fakeData";

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useSelector((state) => state.auth);
  const { list: folderList, loading: foldersLoading } = useSelector(
    (state) => state.folders,
  );
  const { list: fileList, loading: filesLoading } = useSelector(
    (state) => state.files,
  );

  const path = getPathArray(location.pathname);
  const folderId = getFolderIdFromPath(path, allFolders);
  const ownerId = user?.id;

  // AFTER — also depends on user, so it re-fires when user is restored
  useEffect(() => {
    if (!user) return; // wait until user is available
    dispatch(loadFolders({ parentId: folderId ?? null, ownerId: user.id }));
    dispatch(loadFiles({ parentId: folderId ?? null, ownerId: user.id }));
  }, [location.pathname, user, dispatch, folderId]);

  // ── Create Folder ──────────────────────────────────────────
  const handleCreateFolder = () => {
    const name = prompt("Folder name:");
    if (!name?.trim()) return;
    dispatch(
      addFolder({
        name: name.trim(),
        parentId: folderId ?? null,
        ownerId,
        color: "blue",
      }),
    );
  };

  // ── Create File ────────────────────────────────────────────
  const handleCreateFile = () => {
    const name = prompt("File name:");
    if (!name?.trim()) return;
    dispatch(
      addFile({
        name: name.trim(),
        parentId: folderId ?? null,
        ownerId,
        type: "text",
        icon: "📄",
      }),
    );
  };

  const isLoading = foldersLoading || filesLoading;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <div className="flex items-center justify-between px-6 py-3 bg-white border-b shadow-sm">
        <h1 className="text-lg font-bold text-blue-600 shrink-0">📦 MyDrive</h1>

        {/* Search — sits in the middle of the navbar */}
        <SearchBar currentFolderId={folderId} />

        <div className="flex items-center gap-4 shrink-0">
          <span className="text-sm text-gray-600">👤 {user?.name}</span>
          <button
            onClick={() => dispatch(logoutUser())}
            className="text-sm text-red-500 hover:underline"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-6">
        <Breadcrumb />

        {/* Action Buttons */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={handleCreateFolder}
            className="bg-blue-600 text-white text-sm px-4 py-2 rounded hover:bg-blue-700"
          >
            + New Folder
          </button>
          <button
            onClick={handleCreateFile}
            className="bg-green-600 text-white text-sm px-4 py-2 rounded hover:bg-green-700"
          >
            + New File
          </button>
        </div>

        {isLoading ? (
          <p className="text-gray-400 text-sm">Loading...</p>
        ) : (
          <>
            {/* Folders */}
            {folderList.length > 0 && (
              <>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Folders
                </h3>
                {folderList.map((folder) => (
                  <FolderItem
                    key={folder.id}
                    folder={folder}
                    path={path}
                    navigate={navigate}
                    onEdit={(id, data) => dispatch(editFolder({ id, data }))}
                    onDelete={(id) => dispatch(removeFolder(id))}
                  />
                ))}
              </>
            )}

            {/* Files */}
            {fileList.length > 0 && (
              <>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mt-6 mb-2">
                  Files
                </h3>
                {fileList.map((file) => (
                  <FileItem
                    key={file.id}
                    file={file}
                    onEdit={(id, data) => dispatch(editFile({ id, data }))}
                    onDelete={(id) => dispatch(removeFile(id))}
                  />
                ))}
              </>
            )}

            {/* Empty state */}
            {folderList.length === 0 && fileList.length === 0 && (
              <div className="text-center py-20 text-gray-400">
                <p className="text-4xl mb-3">📂</p>
                <p>This folder is empty</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
