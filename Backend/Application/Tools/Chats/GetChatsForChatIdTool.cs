using Application.Dtos;
using Application.Services;
using Application.Tools.Interfaces;

namespace Application.Tools.Chats
{
    public class GetChatsForChatIdTool : BaseTool, IAgentTool
    {
        private readonly ChatService _chatService;

        public GetChatsForChatIdTool(ChatService chatService)
        {
            _chatService = chatService;
        }

        public string Name => "GetChatsForChatIdTool";
        public Type ArgType => typeof(GetChatsForChatIdToolArg);

        public async Task<ToolResponse> ExecuteAsync(object arg)
        {
            GetChatsForChatIdToolArg getChatsForChatIdToolArg = (GetChatsForChatIdToolArg)arg;

            return await ExecuteTool<List<ChatDto>?>(() =>
                _chatService.GetChatsForChatId(getChatsForChatIdToolArg.userId, getChatsForChatIdToolArg.chatSignature), Name);
        }
    }

    public class GetChatsForChatIdToolArg()
    {
        public Guid userId { get; set; }
        public Guid chatSignature { get; set; }
    }
}
