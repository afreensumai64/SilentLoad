// src/api.js — Central API service for SilentLoad

const BASE = "/api"; // proxied via vite to http://localhost:5000

function getToken() {
  return localStorage.getItem("sl_token");
}

function authHeaders() {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function request(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: authHeaders(),
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

export const api = {
  auth: {
    register: (name, email, password) =>
      request("POST", "/auth/register", { name, email, password }),
    login: (email, password) =>
      request("POST", "/auth/login", { email, password }),
    me: () => request("GET", "/auth/me"),
  },
  tasks: {
    today: () => request("GET", "/tasks"),
    all: () => request("GET", "/tasks/all"),
    add: (task) => request("POST", "/tasks", task),
    toggleComplete: (id) => request("PATCH", `/tasks/${id}/complete`),
    delete: (id) => request("DELETE", `/tasks/${id}`),
  },
  checkins: {
    save: (selectedAreas) => request("POST", "/checkins", { selectedAreas }),
    today: () => request("GET", "/checkins/today"),
  },
  mood: {
    log: (mood, completedCount, totalCount) =>
      request("POST", "/mood", { mood, completedCount, totalCount }),
    history: () => request("GET", "/mood"),
  },
  stats: {
    dashboard: () => request("GET", "/stats"),
  },
};

export function saveSession(token, user) {
  localStorage.setItem("sl_token", token);
  localStorage.setItem("sl_user", JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem("sl_token");
  localStorage.removeItem("sl_user");
}

export function getUser() {
  try {
    return JSON.parse(localStorage.getItem("sl_user") || "null");
  } catch {
    return null;
  }
}

export function isLoggedIn() {
  return !!getToken();
}
