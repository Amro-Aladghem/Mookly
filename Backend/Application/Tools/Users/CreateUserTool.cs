using Application.Dtos;
using Application.Services;
using Application.Tools.Interfaces;

namespace Application.Tools.Users
{
    public class CreateUserTool : BaseTool, IAgentTool
    {
        private readonly UserService _userService;

        public CreateUserTool(UserService userService)
        {
            _userService = userService;
        }

        public string Name => "CreateUserTool";
        public Type ArgType => typeof(CreateUserToolArg);

        public async Task<ToolResponse> ExecuteAsync(object arg)
        {
            CreateUserToolArg createUserToolArg = (CreateUserToolArg)arg;

            return await ExecuteTool<UserDto?>(() =>
                _userService.CreateUser(createUserToolArg.userDto), Name);
        }
    }

    public class CreateUserToolArg()
    {
        public UserDto userDto { get; set; } = null!;
    }
}
