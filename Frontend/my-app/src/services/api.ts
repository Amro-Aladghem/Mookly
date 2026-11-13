import axios from 'axios';
import { API_BASE_URL } from '@/libs/config';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const statusCode = error.response?.status ?? 500;
    const rawMessage = error.response?.data?.message ?? error.response?.data;
    const message =
      typeof rawMessage === 'string' && rawMessage.trim().length > 0
        ? rawMessage
        : 'حدث خطأ غير متوقع';

    return Promise.reject({ message, statusCode });
  },
);

export default api;
