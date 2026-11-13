import {
  ACTIVE_INTERVIEW_STORAGE_PREFIX,
  AUTO_MESSAGE_STORAGE_PREFIX,
  LAST_CHAT_STORAGE_KEY,
  USER_CACHE_STORAGE_KEY,
  USER_ID_STORAGE_KEY,
} from '@/libs/config';
import type { ActiveInterviewCache, GetMockInterviewDto } from '@/types/mockInterview';
import type { UserDto } from '@/types/user';

function readJson<T>(key: string): T | null {
  try {
    const value = window.localStorage.getItem(key);
    if (!value) return null;
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function writeJson(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore storage failures
  }
}

export function readUserId(): string | null {
  try {
    const value = window.localStorage.getItem(USER_ID_STORAGE_KEY);
    return value && value.trim().length > 0 ? value : null;
  } catch {
    return null;
  }
}

export function writeUserId(userId: string): void {
  try {
    window.localStorage.setItem(USER_ID_STORAGE_KEY, userId);
  } catch {
    // ignore storage failures
  }
}

export function readUserCache(): UserDto | null {
  return readJson<UserDto>(USER_CACHE_STORAGE_KEY);
}

export function writeUserCache(user: UserDto): void {
  writeJson(USER_CACHE_STORAGE_KEY, user);
}

export function clearUserStorage(): void {
  try {
    window.localStorage.removeItem(USER_ID_STORAGE_KEY);
    window.localStorage.removeItem(USER_CACHE_STORAGE_KEY);
  } catch {
    // ignore storage failures
  }
}

export function writeLastChatSignature(chatSignature: string): void {
  try {
    window.localStorage.setItem(LAST_CHAT_STORAGE_KEY, chatSignature);
  } catch {
    // ignore storage failures
  }
}

export function readLastChatSignature(): string | null {
  try {
    const value = window.localStorage.getItem(LAST_CHAT_STORAGE_KEY);
    return value && value.trim().length > 0 ? value : null;
  } catch {
    return null;
  }
}

export function activeInterviewKey(chatSignature: string): string {
  return `${ACTIVE_INTERVIEW_STORAGE_PREFIX}${chatSignature}`;
}

export function readActiveInterview(chatSignature: string): ActiveInterviewCache | null {
  return readJson<ActiveInterviewCache>(activeInterviewKey(chatSignature));
}

export function writeActiveInterview(interview: ActiveInterviewCache): void {
  writeJson(activeInterviewKey(interview.chatSignature), interview);
}

export function activeInterviewFromDto(interview: GetMockInterviewDto): ActiveInterviewCache {
  return {
    mockInterviewId: interview.id ?? '',
    chatSignature: interview.chatSignture,
    infoMessage: '',
    mockInterviewType: interview.mockInterviewType,
    jobType: interview.jobType ?? null,
    jobLevel: interview.jobLevel ?? null,
    about: interview.about,
    createdAt: interview.createdAt,
  };
}

export function autoMessageKey(chatSignature: string): string {
  return `${AUTO_MESSAGE_STORAGE_PREFIX}${chatSignature}`;
}

export function readAutoMessageSent(chatSignature: string): boolean {
  try {
    return window.localStorage.getItem(autoMessageKey(chatSignature)) === '1';
  } catch {
    return false;
  }
}

export function markAutoMessageSent(chatSignature: string): void {
  try {
    window.localStorage.setItem(autoMessageKey(chatSignature), '1');
  } catch {
    // ignore storage failures
  }
}

export function clearAutoMessageSent(chatSignature: string): void {
  try {
    window.localStorage.removeItem(autoMessageKey(chatSignature));
  } catch {
    // ignore storage failures
  }
}
