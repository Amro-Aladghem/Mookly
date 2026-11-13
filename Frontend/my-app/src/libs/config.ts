export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5141/api/v1';

export const USER_ID_STORAGE_KEY = 'mookly.userId';
export const USER_CACHE_STORAGE_KEY = 'mookly.user';
export const ACTIVE_INTERVIEW_STORAGE_PREFIX = 'mookly.activeInterview.';
export const AUTO_MESSAGE_STORAGE_PREFIX = 'mookly.autoMessage.';
export const LAST_CHAT_STORAGE_KEY = 'mookly.lastChatSignature';

export const POLL_INTERVAL_MS = 4000;
