import { MOCK_HEALTH_HISTORY, MOCK_NUTRITION_TODAY, MOCK_SOS_HISTORY, MOCK_ME } from './mockData';

const DEFAULT_API_BASE_URL = "https://sahara-backend-api-production.up.railway.app";

const configuredBase = (import.meta.env.VITE_API_BASE_URL || "").trim();

export const API_BASE_URL = (configuredBase || DEFAULT_API_BASE_URL).replace(/\/+$/, "");

export const apiUrl = (path) => {
  if (!path) return API_BASE_URL;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
};

export const apiFetch = async (path, options = {}) => {
  const token = localStorage.getItem('sahara_token');
  
  if (token === 'demo-token') {
    console.log('[MOCK API] Intercepted:', path);
    
    let data = null;
    if (path.includes('/api/auth/me')) data = MOCK_ME;
    else if (path.includes('/api/health/history')) data = MOCK_HEALTH_HISTORY;
    else if (path.includes('/api/nutrition/today')) data = MOCK_NUTRITION_TODAY;
    else if (path.includes('/api/emergency/history')) data = MOCK_SOS_HISTORY;
    
    if (data) {
      return {
        ok: true,
        status: 200,
        json: async () => data,
        text: async () => JSON.stringify(data)
      };
    }
  }

  return fetch(apiUrl(path), options);
};
