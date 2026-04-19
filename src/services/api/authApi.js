// src/services/api/authApi.js
import { loginMock, logoutMock, getMeMock } from "../mock/authMock";

const USE_MOCK = true;

export const login = async (credentials) => {
  if (USE_MOCK) return loginMock(credentials);
  // return client.post("/auth/login", credentials).then(r => r.data);
};

export const logout = async () => {
  if (USE_MOCK) return logoutMock();
  // return client.post("/auth/logout").then(r => r.data);
};

export const getMe = async (token) => {
  if (USE_MOCK) return getMeMock(token);
  // return client.get("/auth/me").then(r => r.data);
};
