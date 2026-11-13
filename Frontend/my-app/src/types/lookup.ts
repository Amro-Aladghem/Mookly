export interface JobTypeDto {
  id: number;
  name: string;
}

export interface JobLevelDto {
  id: number;
  name: string;
}

export interface MockInterviewTypeDto {
  id: string;
  title: string;
  description?: string | null;
}
