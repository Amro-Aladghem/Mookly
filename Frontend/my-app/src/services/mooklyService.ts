import api from '@/services/api';
import type { ApiResponse } from '@/types/api';
import type { AgentRequestDto, ChatDto } from '@/types/chat';
import type { NotificationDto } from '@/types/notification';
import type { CreateUserDto, UserDto } from '@/types/user';
import type { JobLevelDto, JobTypeDto, MockInterviewTypeDto } from '@/types/lookup';
import type {
  CreateMockInterviewDto,
  GetMockInterviewDto,
  MockInterviewDto,
  MockInterviewResultDto,
} from '@/types/mockInterview';
import type { CanvaDto } from '@/types/canva';

const baseUri = '/users';

const toFailure = (error: unknown): ApiResponse<never> => {
  const { message, statusCode } = error as { message: string; statusCode: number };
  return { isSuccess: false, error: message, statusCode };
};

export const mooklyService = {
  // ---------- users ----------
  async createUser(dto: CreateUserDto): Promise<ApiResponse<UserDto>> {
    try {
      const response = await api.post<UserDto>(baseUri, dto);
      return { isSuccess: true, data: response.data };
    } catch (error) {
      return toFailure(error);
    }
  },

  async getUserInfo(userId: string): Promise<ApiResponse<UserDto>> {
    try {
      const response = await api.get<UserDto>(`${baseUri}/${userId}`);
      return { isSuccess: true, data: response.data };
    } catch (error) {
      return toFailure(error);
    }
  },

  // ---------- lookups ----------
  async getJobTypes(): Promise<ApiResponse<JobTypeDto[]>> {
    try {
      const response = await api.get<JobTypeDto[]>('/lookups/job-types');
      return { isSuccess: true, data: Array.isArray(response.data) ? response.data : [] };
    } catch (error) {
      return toFailure(error);
    }
  },

  async getJobLevels(): Promise<ApiResponse<JobLevelDto[]>> {
    try {
      const response = await api.get<JobLevelDto[]>('/lookups/job-levels');
      return { isSuccess: true, data: Array.isArray(response.data) ? response.data : [] };
    } catch (error) {
      return toFailure(error);
    }
  },

  async getMockInterviewTypes(): Promise<ApiResponse<MockInterviewTypeDto[]>> {
    try {
      const response = await api.get<MockInterviewTypeDto[]>(
        '/lookups/mock-interview-types',
      );
      return { isSuccess: true, data: Array.isArray(response.data) ? response.data : [] };
    } catch (error) {
      return toFailure(error);
    }
  },

  // ---------- chats ----------
  async createChat(userId: string, chatDto: ChatDto): Promise<ApiResponse<ChatDto>> {
    try {
      const response = await api.post<ChatDto>(`${baseUri}/${userId}/chats`, chatDto);
      return { isSuccess: true, data: response.data };
    } catch (error) {
      return toFailure(error);
    }
  },

  async getChatHistory(
    userId: string,
    chatSignature: string,
  ): Promise<ApiResponse<ChatDto[]>> {
    try {
      const response = await api.get<ChatDto[] | null>(
        `${baseUri}/${userId}/chats/${chatSignature}`,
      );
      return { isSuccess: true, data: Array.isArray(response.data) ? response.data : [] };
    } catch (error) {
      return toFailure(error);
    }
  },

  async getNotificationsForChat(
    userId: string,
    chatSignature: string,
  ): Promise<ApiResponse<NotificationDto[]>> {
    try {
      const response = await api.get<NotificationDto[]>(
        `${baseUri}/${userId}/chats/${chatSignature}/notifications`,
      );
      return { isSuccess: true, data: Array.isArray(response.data) ? response.data : [] };
    } catch (error) {
      return toFailure(error);
    }
  },

  async chatWithAgent(
    userId: string,
    chatSignature: string,
    agentRequestDto: AgentRequestDto,
  ): Promise<ApiResponse<string>> {
    try {
      const response = await api.post<string>(
        `${baseUri}/${userId}/chats/${chatSignature}/agent`,
        agentRequestDto,
      );
      return { isSuccess: true, data: response.data };
    } catch (error) {
      return toFailure(error);
    }
  },

  // ---------- mock interviews ----------
  async createMockInterview(
    userId: string,
    chatSignature: string,
    dto: CreateMockInterviewDto,
  ): Promise<ApiResponse<MockInterviewDto>> {
    try {
      const response = await api.post<MockInterviewDto>(
        `${baseUri}/${userId}/chats/${chatSignature}/mock-interviews`,
        dto,
      );
      return { isSuccess: true, data: response.data };
    } catch (error) {
      return toFailure(error);
    }
  },

  async getMockInterviewByChatSignature(
    userId: string,
    chatSignature: string,
  ): Promise<ApiResponse<GetMockInterviewDto>> {
    try {
      const response = await api.get<GetMockInterviewDto>(
        `${baseUri}/${userId}/chats/${chatSignature}/mock-interviews`,
      );
      return { isSuccess: true, data: response.data };
    } catch (error) {
      return toFailure(error);
    }
  },

  async getMockInterviewsByUserId(
    userId: string,
  ): Promise<ApiResponse<GetMockInterviewDto[]>> {
    try {
      const response = await api.get<GetMockInterviewDto[]>(
        `${baseUri}/${userId}/mock-interviews`,
      );
      return { isSuccess: true, data: Array.isArray(response.data) ? response.data : [] };
    } catch (error) {
      return toFailure(error);
    }
  },

  async getLastMockInterview(
    userId: string,
  ): Promise<ApiResponse<GetMockInterviewDto>> {
    try {
      const response = await api.get<GetMockInterviewDto>(
        `${baseUri}/${userId}/mock-interviews/last`,
      );
      return { isSuccess: true, data: response.data };
    } catch (error) {
      return toFailure(error);
    }
  },

  async getMockInterviewResult(
    userId: string,
    mockInterviewId: string,
  ): Promise<ApiResponse<MockInterviewResultDto>> {
    try {
      const response = await api.get<MockInterviewResultDto>(
        `${baseUri}/${userId}/mock-interviews/${mockInterviewId}/result`,
      );
      return { isSuccess: true, data: response.data };
    } catch (error) {
      return toFailure(error);
    }
  },

  // ---------- canvas ----------
  async getCanvasForChat(
    userId: string,
    chatSignature: string,
  ): Promise<ApiResponse<CanvaDto[]>> {
    try {
      const response = await api.get<CanvaDto[]>(
        `${baseUri}/${userId}/chats/${chatSignature}/canvas`,
      );
      return { isSuccess: true, data: Array.isArray(response.data) ? response.data : [] };
    } catch (error) {
      return toFailure(error);
    }
  },

  async getCanvasById(userId: string, canvaId: string): Promise<ApiResponse<CanvaDto>> {
    try {
      const response = await api.get<CanvaDto>(
        `${baseUri}/${userId}/canvas/${canvaId}`,
      );
      return { isSuccess: true, data: response.data };
    } catch (error) {
      return toFailure(error);
    }
  },
};

export default mooklyService;
