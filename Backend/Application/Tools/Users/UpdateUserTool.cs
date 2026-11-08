using Application.Dtos;
using Application.Services;
using Application.Tools.Interfaces;

namespace Application.Tools.Users
{
    public class UpdateUserTool : BaseTool, IAgentTool
    {
        private readonly UserService _userService;

        public UpdateUserTool(UserService userService)
        {
            _userService = userService;
        }

        public string Name => "UpdateUserTool";
        public Type ArgType => typeof(UpdateUserToolArg);

        public async Task<ToolResponse> ExecuteAsync(object arg)
        {
            UpdateUserToolArg updateUserToolArg = (UpdateUserToolArg)arg;

            return await ExecuteTool<UserDto?>(() =>
                _userService.UpdateUser(updateUserToolArg.id, updateUserToolArg.userDto), Name);
        }
    }

    public class UpdateUserToolArg()
    {
        public Guid id { get; set; }
        public UserDto userDto { get; set; } = null!;
    }
}
