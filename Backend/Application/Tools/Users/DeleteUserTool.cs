using Application.Services;
using Application.Tools.Interfaces;

namespace Application.Tools.Users
{
    public class DeleteUserTool : BaseTool, IAgentTool
    {
        private readonly UserService _userService;

        public DeleteUserTool(UserService userService)
        {
            _userService = userService;
        }

        public string Name => "DeleteUserTool";
        public Type ArgType => typeof(DeleteUserToolArg);

        public async Task<ToolResponse> ExecuteAsync(object arg)
        {
            DeleteUserToolArg deleteUserToolArg = (DeleteUserToolArg)arg;

            return await ExecuteTool<bool>(() =>
                _userService.DeleteUser(deleteUserToolArg.id), Name);
        }
    }

    public class DeleteUserToolArg()
    {
        public Guid id { get; set; }
    }
}
