const DEFAULT_API_BASE_URL = "https://sahara-backend-api-production.up.railway.app";

const configuredBase = (import.meta.env.VITE_API_BASE_URL || "").trim();

export const API_BASE_URL = (configuredBase || DEFAULT_API_BASE_URL).replace(/\/+$/, "");

export const apiUrl = (path) => {
  if (!path) return API_BASE_URL;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
};

export const apiFetch = (path, options) => fetch(apiUrl(path), options);
