/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import mooklyService from '@/services/mooklyService';
import {
  clearUserStorage,
  readUserCache,
  readUserId,
  writeUserCache,
  writeUserId,
} from '@/libs/storage';
import type { ApiResponse } from '@/types/api';
import type { CreateUserDto, UserDto } from '@/types/user';

interface UserContextValue {
  userId: string | null;
  user: UserDto | null;
  loading: boolean;
  createUser: (dto: CreateUserDto) => Promise<ApiResponse<UserDto>>;
  refreshUser: () => Promise<void>;
  logout: () => void;
}

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<string | null>(() => readUserId());
  const [user, setUser] = useState<UserDto | null>(() => readUserCache());
  const [loading, setLoading] = useState<boolean>(() => Boolean(readUserId()));

  const refreshUser = useCallback(async () => {
    const storedUserId = readUserId();

    if (!storedUserId) {
      setUserId(null);
      setUser(null);
      setLoading(false);
      return;
    }

    setUserId(storedUserId);
    setLoading(true);

    try {
      const result = await mooklyService.getUserInfo(storedUserId);
      if (result.isSuccess) {
        setUser(result.data);
        writeUserCache(result.data);
      } else if (result.statusCode === 404) {
        clearUserStorage();
        setUserId(null);
        setUser(null);
      }
    } catch {
      // keep the cached user when the network is unavailable
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refreshUser();
  }, [refreshUser]);

  const createUser = useCallback(async (dto: CreateUserDto) => {
    const result = await mooklyService.createUser(dto);

    if (result.isSuccess && result.data.id) {
      writeUserId(result.data.id);
      writeUserCache(result.data);
      setUserId(result.data.id);
      setUser(result.data);
    }

    return result;
  }, []);

  const logout = useCallback(() => {
    clearUserStorage();
    setUserId(null);
    setUser(null);
  }, []);

  const value = useMemo<UserContextValue>(
    () => ({
      userId,
      user,
      loading,
      createUser,
      refreshUser,
      logout,
    }),
    [userId, user, loading, createUser, refreshUser, logout],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser(): UserContextValue {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within a UserProvider');
  return ctx;
}
