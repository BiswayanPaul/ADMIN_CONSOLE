// src/services/api/searchApi.js
import { searchMock, fetchSuggestionsMock } from "../mock/searchMock";

const USE_MOCK = true;

export const searchItems = async (query, ownerId) => {
  if (USE_MOCK) return searchMock(query, ownerId);
  // return client.get(`/search?q=${query}`).then(r => r.data);
};

export const fetchSuggestions = async (query) => {
  if (USE_MOCK) return fetchSuggestionsMock(query);
  // return client.get(`/suggestions?q=${query}`).then(r => r.data);
};
