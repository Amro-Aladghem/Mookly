using Application.Dtos;
using Application.Services;
using Application.Tools.Interfaces;

namespace Application.Tools.Chats
{
    public class CreateChatTool : BaseTool, IAgentTool
    {
        private readonly ChatService _chatService;

        public CreateChatTool(ChatService chatService)
        {
            _chatService = chatService;
        }

        public string Name => "CreateChatTool";
        public Type ArgType => typeof(CreateChatToolArg);

        public async Task<ToolResponse> ExecuteAsync(object arg)
        {
            CreateChatToolArg createChatToolArg = (CreateChatToolArg)arg;

            return await ExecuteTool<ChatDto>(() =>
                _chatService.CreateChat(createChatToolArg.userId, createChatToolArg.chatDto), Name);
        }
    }

    public class CreateChatToolArg()
    {
        public Guid userId { get; set; }
        public ChatDto chatDto { get; set; } = null!;
    }
}
