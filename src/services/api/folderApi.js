// src/services/api/folderApi.js
import {
  getFoldersMock,
  createFolderMock,
  updateFolderMock,
  deleteFolderMock,
} from "../mock/folderMock";

const USE_MOCK = true;

export const fetchFolders = async (parentId, ownerId) => {
  if (USE_MOCK) return getFoldersMock(parentId, ownerId);
  // return client.get(`/folders?parentId=${parentId}`).then(r => r.data);
};

export const createFolder = async (data) => {
  if (USE_MOCK) return createFolderMock(data);
  // return client.post("/folders", data).then(r => r.data);
};

export const updateFolder = async (id, data) => {
  if (USE_MOCK) return updateFolderMock(id, data);
  // return client.put(`/folders/${id}`, data).then(r => r.data);
};

export const deleteFolder = async (id) => {
  if (USE_MOCK) return deleteFolderMock(id);
  // return client.delete(`/folders/${id}`).then(r => r.data);
};
