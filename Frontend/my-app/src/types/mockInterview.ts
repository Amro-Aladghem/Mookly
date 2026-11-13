export interface MockInterviewDto {
  id?: string | null;
  chatSignture: string;
  userId: string;
  mockInterviewTypeId: string;
  status: string;
  jobTypeId?: number | null;
  jobLevelId?: number | null;
  about: string;
}

export interface GetMockInterviewDto {
  id?: string | null;
  chatSignture: string;
  userId: string;
  mockInterviewType: string;
  status: string;
  jobType?: string | null;
  jobLevel?: string | null;
  about: string;
  createdAt: string;
}

export interface CreateMockInterviewDto {
  mockInterviewTypeId: string;
  jobTypeId?: number | null;
  jobLevelId?: number | null;
  about: string;
}

export interface MockInterviewResultDto {
  id?: string | null;
  mockInterviewId: string;
  overallScore: number;
  summary: string;
  strengths: string;
  areasForImprovement: string;
  recommendations: string;
  createdAt: string;
}

export interface ActiveInterviewCache {
  mockInterviewId: string;
  chatSignature: string;
  infoMessage: string;
  mockInterviewType: string;
  jobType?: string | null;
  jobLevel?: string | null;
  about: string;
  createdAt: string;
}
