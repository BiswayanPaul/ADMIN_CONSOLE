// src/services/mock/authMock.js
import { users } from "./fakeData";

const delay = (ms = 300) => new Promise((res) => setTimeout(res, ms));

export const loginMock = async ({ email, password }) => {
  await delay();
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) throw new Error("Invalid email or password");
  const { password: _, ...safeUser } = user;
  return { user: safeUser, token: "mock-token-" + user.id };
};

export const logoutMock = async () => {
  await delay(100);
  return { success: true };
};

export const getMeMock = async (token) => {
  await delay(100);
  const userId = token?.replace("mock-token-", "");
  const user = users.find((u) => u.id === userId);
  if (!user) throw new Error("Invalid token");
  const { password: _, ...safeUser } = user;
  return safeUser;
};
