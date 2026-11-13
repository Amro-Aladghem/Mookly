export interface ChatDto {
  chatSignature: string;
  userId: string;
  name?: string | null;
  creationTime: string;
  imageUrl?: string | null;
  imageType?: string | null;
  chatRoleId: number;
  message: string;
  data?: string | null;
  agentType?: string | null;
  showMessage: boolean;
  isFinalResponse: boolean;
  messageAsAudioLink?: string | null;
}

export interface AgentRequestDto {
  chatSignture?: string | null;
  userId: string;
  message: string;
  imageUri?: string | null;
  agentType?: string | null;
}
