using Application.Dtos;
using Application.Services;
using Application.Tools.Interfaces;

namespace Application.Tools.DefaultMessages
{
    public class GetDefaultMessagesTool : BaseTool, IAgentTool
    {
        private readonly DefaultMessageService _defaultMessageService;

        public GetDefaultMessagesTool(DefaultMessageService defaultMessageService)
        {
            _defaultMessageService = defaultMessageService;
        }

        public string Name => "GetDefaultMessagesTool";
        public Type ArgType => typeof(GetDefaultMessagesToolArg);

        public async Task<ToolResponse> ExecuteAsync(object arg)
        {
            return await ExecuteTool<List<DefaultMessageDto>>(() =>
                _defaultMessageService.GetDefaultMessages(), Name);
        }
    }

    public class GetDefaultMessagesToolArg()
    {
    }
}
