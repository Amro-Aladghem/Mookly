using Application.Dtos;
using Domain.Enums;
using Infrastructure.AI.Chat;
using Infrastructure.AI.Interfaces;
using System.Text.Json;

namespace Application.Services.Coordinators
{
    public class AgentChatCoordinator
    {
        private readonly ChatService _chatService;
        private readonly TextToSpeechCoordinatorService _textToSpeechCoordinatorService;
        public AgentChatCoordinator(ChatService chatService, TextToSpeechCoordinatorService textToSpeechCoordinatorService)
        {
            _chatService = chatService;
            _textToSpeechCoordinatorService = textToSpeechCoordinatorService;
        }
        public async Task<AgentResponseDto?> GenerateAgentResponse(Guid chatSignture, Guid userId, IAgentChat agentChat)
        {
            try
            {
                List<ChatDto>? chatHistory = await HandleGetChatHistory(userId, chatSignture, agentChat);

                AgentResponseDto? agentResponseDto = await HandleGetAgentChatResponse(userId, chatHistory, agentChat);

                if (agentResponseDto is null)
                    return null;

                string? agentMessageAsAudioLink = null; //await HandleConvertAgentMessageAsAudioIfNeeded(agentResponseDto);

                ChatDto chatDto = await _chatService.CreateChat(userId, new ChatDto()
                {
                    Message = agentResponseDto.Message,
                    ChatRoleId = GetChatRoleIdByIAgentChat(agentChat),
                    AgentType = GetAgentTypeByIAgentChat(agentChat).ToString(),
                    ChatSignature = chatSignture,
                    UserId = userId,
                    CreationTime = DateTime.UtcNow,
                    ShowMessage = agentResponseDto.IsFinished || agentResponseDto.AskUser,
                    Data = agentResponseDto.Data is null ? null : JsonSerializer.Serialize(agentResponseDto.Data, DataJsonOptions),
                    IsFinalResponse = agentResponseDto.IsFinished,
                    MessageAsAudioLink = agentMessageAsAudioLink
                });

                return agentResponseDto;
            }
            catch
            {
                return null;
            }
        }

        private static readonly JsonSerializerOptions DataJsonOptions = new()
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        };
        private int GetChatRoleIdByIAgentChat(IAgentChat agentChat)
        {
            int roleId = agentChat switch
            {
                InterviewerAgentChat => (int)eAgentType.InterviewerAgent,
                _ => throw new Exception("agent chat parameter is not IAgentChat")
            };

            return roleId;
        }

        private eAgentType GetAgentTypeByIAgentChat(IAgentChat agentChat)
        {
            return agentChat switch
            {
                InterviewerAgentChat => eAgentType.InterviewerAgent,
                _ => throw new Exception("agent chat parameter is not IAgentChat")
            };
        }

        private List<ChatDto>? FilterChatHistoryByAgentType(List<ChatDto>? chatHistory, eAgentType agentType)
        {
            if (chatHistory is null)
                return null;

            string agentTypeName = agentType.ToString();

            List<ChatDto>? chats = chatHistory.Where(c => c.AgentType == agentTypeName)
                 .OrderBy(c => c.CreationTime)
                 .ToList();

            return chats;
        }

        private async Task<List<ChatDto>?> HandleGetChatHistory(Guid userId, Guid chatSignture, IAgentChat agentChat, bool filter = false)
        {

            List<ChatDto>? chatHistory = await _chatService.GetChatsForChatId(userId, chatSignture);

            if (filter)
            {
                eAgentType agentType = GetAgentTypeByIAgentChat(agentChat);
                return FilterChatHistoryByAgentType(chatHistory, agentType);
            }

            return chatHistory;
        }

        private async Task<AgentResponseDto?> HandleGetAgentChatResponse(Guid userId, List<ChatDto>? chatHistory, IAgentChat agentChat)
        {
            string? response = await agentChat.Chat(userId, chatHistory);

            if (response is null)
                return null;

            var options = new JsonSerializerOptions()
            {
                PropertyNameCaseInsensitive = false
            };

            AgentResponseDto agentResponseDto = JsonSerializer.Deserialize<AgentResponseDto>(response, options)!;

            return agentResponseDto;
        }

        private async Task<string?> HandleConvertAgentMessageAsAudioIfNeeded(AgentResponseDto agentResponseDto)
        {
            if ((agentResponseDto.AskUser || agentResponseDto.IsFinished)
                && !string.IsNullOrWhiteSpace(agentResponseDto.Message))
            {
                return await _textToSpeechCoordinatorService.HandleConvertTextToSpeechAndUpload(agentResponseDto.Message);
            }

            return null;
        }
    }
}
