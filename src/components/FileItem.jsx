// src/components/FileItem.jsx
import { useState } from "react";
import { FILE_ICONS as ICONS } from "../constants/fileIcons";

export default function FileItem({ file, onEdit, onDelete }) {
  const [showMenu, setShowMenu] = useState(false);
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState(file.name);

  const handleRename = () => {
    if (newName.trim() && newName !== file.name) {
      onEdit(file.id, { name: newName.trim() });
    }
    setEditing(false);
    setShowMenu(false);
  };

  const handleIconChange = (icon) => {
    onEdit(file.id, { icon });
    setShowMenu(false);
  };

  const formatSize = (bytes) => {
    if (!bytes) return "";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1048576).toFixed(1) + " MB";
  };

  return (
    <div className="relative flex items-center justify-between p-3 border rounded mb-2 bg-white hover:bg-gray-50">
      {/* Left: icon + name */}
      <div className="flex items-center gap-2 flex-1">
        <span className="text-lg">{file.icon || "📄"}</span>
        {editing ? (
          <input
            autoFocus
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onBlur={handleRename}
            onKeyDown={(e) => e.key === "Enter" && handleRename()}
            className="border rounded px-2 py-0.5 text-sm w-48"
          />
        ) : (
          <div>
            <p className="text-sm font-medium">{file.name}</p>
            {file.size > 0 && (
              <p className="text-xs text-gray-400">{formatSize(file.size)}</p>
            )}
          </div>
        )}
      </div>

      {/* Right: 3-dot menu */}
      <div className="relative">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu((p) => !p);
          }}
          className="px-2 py-1 rounded hover:bg-gray-200 text-gray-600 text-lg leading-none"
        >
          ⋮
        </button>

        {showMenu && (
          <div className="absolute right-0 top-8 bg-white border rounded shadow-lg z-10 w-44 text-sm">
            <button
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              onClick={() => {
                setEditing(true);
                setShowMenu(false);
              }}
            >
              ✏️ Rename
            </button>
            <div className="px-4 py-2 border-t">
              <p className="text-xs text-gray-400 mb-2">Icon</p>
              <div className="flex gap-1 flex-wrap">
                {ICONS.map((ic) => (
                  <button
                    key={ic}
                    onClick={() => handleIconChange(ic)}
                    className={`text-base px-1 rounded ${file.icon === ic ? "bg-blue-100" : "hover:bg-gray-100"}`}
                  >
                    {ic}
                  </button>
                ))}
              </div>
            </div>
            <button
              className="block w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 border-t"
              onClick={() => {
                onDelete(file.id);
                setShowMenu(false);
              }}
            >
              🗑️ Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
