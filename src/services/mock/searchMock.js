// src/services/mock/searchMock.js
import { folders, files, globalDatabase } from "./fakeData";

const delay = (ms = 250) => new Promise((res) => setTimeout(res, ms));

export const searchMock = async (query, ownerId) => {
  await delay();
  const q = query.toLowerCase();

  const matchedFolders = folders.filter(
    (f) => f.ownerId === ownerId && f.name.toLowerCase().includes(q),
  );
  const matchedFiles = files.filter(
    (f) => f.ownerId === ownerId && f.name.toLowerCase().includes(q),
  );

  return { folders: matchedFolders, files: matchedFiles };
};

export const fetchSuggestionsMock = async (query) => {
  await delay();
  const q = query.toLowerCase();
  return globalDatabase.filter((item) => item.name.toLowerCase().includes(q));
};
