// src/services/api/fileApi.js
import {
  getFilesMock,
  createFileMock,
  updateFileMock,
  deleteFileMock,
} from "../mock/fileMock";

const USE_MOCK = true;

export const fetchFiles = async (parentId, ownerId) => {
  if (USE_MOCK) return getFilesMock(parentId, ownerId);
  // return client.get(`/files?parentId=${parentId}`).then(r => r.data);
};

export const createFile = async (data) => {
  if (USE_MOCK) return createFileMock(data);
  // return client.post("/files", data).then(r => r.data);
};

export const updateFile = async (id, data) => {
  if (USE_MOCK) return updateFileMock(id, data);
  // return client.put(`/files/${id}`, data).then(r => r.data);
};

export const deleteFile = async (id) => {
  if (USE_MOCK) return deleteFileMock(id);
  // return client.delete(`/files/${id}`).then(r => r.data);
};
