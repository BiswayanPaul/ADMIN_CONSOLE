// src/components/FolderItem.jsx
import { useState } from "react";

const COLOR_MAP = {
  blue: "bg-blue-100 border-blue-300",
  red: "bg-red-100 border-red-300",
  green: "bg-green-100 border-green-300",
  yellow: "bg-yellow-100 border-yellow-300",
  purple: "bg-purple-100 border-purple-300",
  pink: "bg-pink-100 border-pink-300",
  orange: "bg-orange-100 border-orange-300",
  teal: "bg-teal-100 border-teal-300",
};

const COLORS = Object.keys(COLOR_MAP);

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

  const colorClass = COLOR_MAP[folder.color] || COLOR_MAP.blue;

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
                {COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => handleColorChange(c)}
                    className={`w-5 h-5 rounded-full border-2 bg-${c}-400 ${folder.color === c ? "border-gray-800" : "border-transparent"}`}
                    title={c}
                  />
                ))}
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
