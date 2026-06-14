// src/api/config.js

export const API_BASE_URL =
	import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

export const USE_MOCK_API = false;

// Hardcoded final URL — client.js aur auth.js dono yahi use karte hain
export const FINAL_API_BASE_URL =
	import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";