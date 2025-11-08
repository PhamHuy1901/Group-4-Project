import axios from "axios";

export const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:3001",
});

// Simple auth token helpers that use localStorage so token persists across reloads
const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

export function setAuthToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    localStorage.removeItem(TOKEN_KEY);
    delete api.defaults.headers.common["Authorization"];
  }
}

export function getAuthToken() {
  return localStorage.getItem(TOKEN_KEY);
}

// initialize from storage on load
const existing = getAuthToken();
if (existing) {
  api.defaults.headers.common["Authorization"] = `Bearer ${existing}`;
}

export function clearAuthToken() {
  setAuthToken(null);
}

export function setAuthUser(user) {
  if (user) {
    try { localStorage.setItem(USER_KEY, JSON.stringify(user)); } catch(_) {}
  } else {
    localStorage.removeItem(USER_KEY);
  }
}

export function getAuthUser() {
  try { const v = localStorage.getItem(USER_KEY); return v ? JSON.parse(v) : null; } catch(_) { return null; }
}

export function clearAuthUser() { setAuthUser(null); }
