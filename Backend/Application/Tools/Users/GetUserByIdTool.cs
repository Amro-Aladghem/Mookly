using Application.Dtos;
using Application.Services;
using Application.Tools.Interfaces;

namespace Application.Tools.Users
{
    public class GetUserByIdTool : BaseTool, IAgentTool
    {
        private readonly UserService _userService;

        public GetUserByIdTool(UserService userService)
        {
            _userService = userService;
        }

        public string Name => "GetUserByIdTool";
        public Type ArgType => typeof(GetUserByIdToolArg);

        public async Task<ToolResponse> ExecuteAsync(object arg)
        {
            GetUserByIdToolArg getUserByIdToolArg = (GetUserByIdToolArg)arg;

            return await ExecuteTool<UserDto?>(() =>
                _userService.GetUserById(getUserByIdToolArg.id), Name);
        }
    }

    public class GetUserByIdToolArg()
    {
        public Guid id { get; set; }
    }
}
