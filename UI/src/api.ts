import { useEffect, useState } from "react";

const LS_KEY = "whoami";

export function saveUser(user: { name: any; role: any; }) {
  localStorage.setItem(LS_KEY, JSON.stringify(user));
}

export function loadUser() {
  const raw = localStorage.getItem(LS_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    localStorage.removeItem(LS_KEY);
    return null;
  }
}

export function clearUser() {
  localStorage.removeItem(LS_KEY);
}

async function request(path: string, options: any = {}) {
  const me = loadUser();
  const headers: any = { "content-type": "application/json"};
  if (me) {
    headers["x-user-name"] = encodeURIComponent(me.name);
    headers["x-user-role"] = me.role;
  }

  const resp = await fetch("/api" + path, {
    credentials: "include",
    ...options,
    headers,
  });

  if (!resp.ok) {
    let text = "ошибка " + resp.status;
    try {
      const data = await resp.json();
      if (data.message) text = data.message;
    } catch {}
    throw new Error(text);
  }

  if (resp.status === 204) return null;
  return resp.json();
}

export async function login(email: string, password: string) {
  const resp = await fetch("/api/auth/login", {
    method: "POST",
    credentials: "include",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ login: email, password }),
  });

  if (!resp.ok) {
    let text = "неверный логин или пароль";
    try {
      const data = await resp.json();
      if (data.message) text = data.message;
    } catch {}
    throw new Error(text);
  }


  const data = await resp.json().catch(() => ({}));
  const user = {
    name: data?.name || email.split("@")[0],
    role: data?.role || "duty",
  };
  saveUser(user);
  return user;
}

export async function logout() {
  clearUser();
  try {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
  } catch {}
}

export function getRequests(status: string) {
  const url = status ? "/requests?status=" + status : "/requests";
  return request(url);
}

export function getRequest(id: string) {
  return request("/requests/" + id);
}

export function takeRequest(id: string) {
  return request("/requests/" + id + "/take", { method: "POST" });
}

export function patchRequest(id: string, data: { priority?: string; assignee?: string; }) {
  return request("/requests/" + id, { method: "PATCH", body: JSON.stringify(data) });
}
