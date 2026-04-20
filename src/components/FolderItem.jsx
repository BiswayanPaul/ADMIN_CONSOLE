// src/components/FolderItem.jsx
import { useState } from "react";
import { FOLDER_COLORS } from "../constants/colors"; // ← import from constants

const COLOR_MAP = {
  blue: { item: "bg-blue-100 border-blue-300", dot: "bg-blue-400" },
  red: { item: "bg-red-100 border-red-300", dot: "bg-red-400" },
  green: { item: "bg-green-100 border-green-300", dot: "bg-green-400" },
  yellow: { item: "bg-yellow-100 border-yellow-300", dot: "bg-yellow-400" },
  purple: { item: "bg-purple-100 border-purple-300", dot: "bg-purple-400" },
  pink: { item: "bg-pink-100 border-pink-300", dot: "bg-pink-400" },
  orange: { item: "bg-orange-100 border-orange-300", dot: "bg-orange-400" },
  teal: { item: "bg-teal-100 border-teal-300", dot: "bg-teal-400" },
};

// ↑ COLOR_MAP stays here because it's UI-specific (Tailwind classes).
//   FOLDER_COLORS from constants drives the loop — single source of truth
//   for which colors exist. If you add "cyan" to colors.js, just add it
//   to COLOR_MAP here too and it automatically appears in the picker.

export default function FolderItem({
  folder,
  path,
  navigate,
  onEdit,
  onDelete,
}) {
  const [showMenu, setShowMenu] = useState(false);
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState(folder.name);

  const colorClass = COLOR_MAP[folder.color]?.item || COLOR_MAP.blue.item;

  const handleNavigate = () => {
    if (editing) return;
    const slug = encodeURIComponent(folder.name.toLowerCase());
    navigate("/" + [...path, slug].join("/"));
  };

  const handleRename = () => {
    if (newName.trim() && newName !== folder.name) {
      onEdit(folder.id, { name: newName.trim() });
    }
    setEditing(false);
    setShowMenu(false);
  };

  const handleColorChange = (color) => {
    onEdit(folder.id, { color });
    setShowMenu(false);
  };

  return (
    <div
      className={`relative flex items-center justify-between p-3 border rounded mb-2 ${colorClass}`}
    >
      {/* Left: icon + name */}
      <div
        className="flex items-center gap-2 cursor-pointer flex-1"
        onClick={handleNavigate}
      >
        <span>📁</span>
        {editing ? (
          <input
            autoFocus
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onBlur={handleRename}
            onKeyDown={(e) => e.key === "Enter" && handleRename()}
            className="border rounded px-2 py-0.5 text-sm w-40"
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span className="text-sm font-medium">{folder.name}</span>
        )}
      </div>

      {/* Right: 3-dot menu */}
      <div className="relative">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu((p) => !p);
          }}
          className="px-2 py-1 rounded hover:bg-black/10 text-gray-600 text-lg leading-none"
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
              <p className="text-xs text-gray-400 mb-2">Color</p>
              <div className="flex gap-1 flex-wrap">
                {FOLDER_COLORS.map(
                  (
                    c, // ← FOLDER_COLORS drives the loop
                  ) => (
                    <button
                      key={c}
                      onClick={() => handleColorChange(c)}
                      title={c}
                      className={`
                      w-5 h-5 rounded-full border-2 transition-transform hover:scale-110
                      ${COLOR_MAP[c].dot}
                      ${folder.color === c ? "border-gray-800 scale-110" : "border-transparent"}
                    `}
                    />
                  ),
                )}
              </div>
            </div>

            <button
              className="block w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 border-t"
              onClick={() => {
                onDelete(folder.id);
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
