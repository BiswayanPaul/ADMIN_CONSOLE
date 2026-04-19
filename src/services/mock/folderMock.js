// src/services/mock/folderMock.js
import { folders } from "./fakeData";

const delay = (ms = 200) => new Promise((res) => setTimeout(res, ms));

export const getFoldersMock = async (parentId, ownerId) => {
  await delay();
  return folders.filter(
    (f) => f.parentId === parentId && f.ownerId === ownerId,
  );
};

export const createFolderMock = async (data) => {
  await delay();
  const newFolder = {
    id: Date.now().toString(),
    name: data.name,
    parentId: data.parentId,
    ownerId: data.ownerId,
    color: data.color || "blue",
    createdAt: new Date().toISOString(),
  };
  folders.push(newFolder);
  return newFolder;
};

export const updateFolderMock = async (id, data) => {
  await delay();
  const index = folders.findIndex((f) => f.id === id);
  if (index === -1) throw new Error("Folder not found");
  folders[index] = { ...folders[index], ...data };
  return folders[index];
};

export const deleteFolderMock = async (id) => {
  await delay();
  const index = folders.findIndex((f) => f.id === id);
  if (index === -1) throw new Error("Folder not found");
  folders.splice(index, 1);
  return { success: true };
};
