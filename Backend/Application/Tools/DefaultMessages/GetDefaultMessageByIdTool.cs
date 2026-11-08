using Application.Dtos;
using Application.Services;
using Application.Tools.Interfaces;

namespace Application.Tools.DefaultMessages
{
    public class GetDefaultMessageByIdTool : BaseTool, IAgentTool
    {
        private readonly DefaultMessageService _defaultMessageService;

        public GetDefaultMessageByIdTool(DefaultMessageService defaultMessageService)
        {
            _defaultMessageService = defaultMessageService;
        }

        public string Name => "GetDefaultMessageByIdTool";
        public Type ArgType => typeof(GetDefaultMessageByIdToolArg);

        public async Task<ToolResponse> ExecuteAsync(object arg)
        {
            GetDefaultMessageByIdToolArg getDefaultMessageByIdToolArg = (GetDefaultMessageByIdToolArg)arg;

            return await ExecuteTool<DefaultMessageDto?>(() =>
                _defaultMessageService.GetDefaultMessageById(getDefaultMessageByIdToolArg.id), Name);
        }
    }

    public class GetDefaultMessageByIdToolArg()
    {
        public Guid id { get; set; }
    }
}
