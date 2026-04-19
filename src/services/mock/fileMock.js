// src/services/mock/fileMock.js
import { files } from "./fakeData";

const delay = (ms = 200) => new Promise((res) => setTimeout(res, ms));

export const getFilesMock = async (parentId, ownerId) => {
  await delay();
  return files.filter((f) => f.parentId === parentId && f.ownerId === ownerId);
};

export const createFileMock = async (data) => {
  await delay();
  const newFile = {
    id: "f" + Date.now().toString(),
    name: data.name,
    parentId: data.parentId,
    ownerId: data.ownerId,
    type: data.type || "text",
    size: data.size || 0,
    icon: data.icon || "📄",
    color: data.color || null,
    createdAt: new Date().toISOString(),
  };
  files.push(newFile);
  return newFile;
};

export const updateFileMock = async (id, data) => {
  await delay();
  const index = files.findIndex((f) => f.id === id);
  if (index === -1) throw new Error("File not found");
  files[index] = { ...files[index], ...data };
  return files[index];
};

export const deleteFileMock = async (id) => {
  await delay();
  const index = files.findIndex((f) => f.id === id);
  if (index === -1) throw new Error("File not found");
  files.splice(index, 1);
  return { success: true };
};
