using Application.Dtos;
using Application.Services;
using Application.Tools.Interfaces;

namespace Application.Tools.ChatRoles
{
    public class GetChatRolesTool : BaseTool, IAgentTool
    {
        private readonly ChatRoleService _chatRoleService;

        public GetChatRolesTool(ChatRoleService chatRoleService)
        {
            _chatRoleService = chatRoleService;
        }

        public string Name => "GetChatRolesTool";
        public Type ArgType => typeof(GetChatRolesToolArg);

        public async Task<ToolResponse> ExecuteAsync(object arg)
        {
            return await ExecuteTool<List<ChatRoleDto>>(() =>
                _chatRoleService.GetChatRoles(), Name);
        }
    }

    public class GetChatRolesToolArg()
    {
    }
}
