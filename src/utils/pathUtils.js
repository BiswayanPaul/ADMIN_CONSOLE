// src/utils/pathUtils.js

export const getPathArray = (pathname) => pathname.split("/").filter(Boolean);

export const getFolderIdFromPath = (pathArray, folders) => {
  let parent = null;

  for (let rawName of pathArray) {
    const name = decodeURIComponent(rawName).toLowerCase();
    const folder = folders.find(
      (f) => f.name.toLowerCase() === name && f.parentId === parent,
    );
    if (!folder) return null;
    parent = folder.id;
  }

  return parent;
};
