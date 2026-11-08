using Application.Dtos;
using Application.Services;
using Application.Tools.Interfaces;

namespace Application.Tools.ChatRoles
{
    public class GetChatRoleByIdTool : BaseTool, IAgentTool
    {
        private readonly ChatRoleService _chatRoleService;

        public GetChatRoleByIdTool(ChatRoleService chatRoleService)
        {
            _chatRoleService = chatRoleService;
        }

        public string Name => "GetChatRoleByIdTool";
        public Type ArgType => typeof(GetChatRoleByIdToolArg);

        public async Task<ToolResponse> ExecuteAsync(object arg)
        {
            GetChatRoleByIdToolArg getChatRoleByIdToolArg = (GetChatRoleByIdToolArg)arg;

            return await ExecuteTool<ChatRoleDto?>(() =>
                _chatRoleService.GetChatRoleById(getChatRoleByIdToolArg.id), Name);
        }
    }

    public class GetChatRoleByIdToolArg()
    {
        public int id { get; set; }
    }
}
