using Application.Dtos;
using Application.Services;
using Application.Tools.Interfaces;

namespace Application.Tools.Canvas
{
    public class GetCanvasForChatIdTool : BaseTool, IAgentTool
    {
        private readonly CanvaService _canvaService;

        public GetCanvasForChatIdTool(CanvaService canvaService)
        {
            _canvaService = canvaService;
        }

        public string Name => "GetCanvasForChatIdTool";
        public Type ArgType => typeof(GetCanvasForChatIdToolArg);

        public async Task<ToolResponse> ExecuteAsync(object arg)
        {
            GetCanvasForChatIdToolArg getCanvasForChatIdToolArg = (GetCanvasForChatIdToolArg)arg;

            return await ExecuteTool<List<CanvaDto>>(() =>
                _canvaService.GetCanvasForChatId(getCanvasForChatIdToolArg.userId, getCanvasForChatIdToolArg.chatId), Name);
        }
    }

    public class GetCanvasForChatIdToolArg()
    {
        public Guid userId { get; set; }
        public Guid chatId { get; set; }
    }
}
