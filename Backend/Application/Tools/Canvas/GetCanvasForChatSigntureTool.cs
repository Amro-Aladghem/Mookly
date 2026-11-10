using Application.Dtos;
using Application.Services;
using Application.Tools.Interfaces;

namespace Application.Tools.Canvas
{
    public class GetCanvasForChatSigntureTool : BaseTool, IAgentTool
    {
        private readonly CanvaService _canvaService;

        public GetCanvasForChatSigntureTool(CanvaService canvaService)
        {
            _canvaService = canvaService;
        }

        public string Name => "GetCanvasForChatSigntureTool";
        public Type ArgType => typeof(GetCanvasForChatSigntureToolArg);

        public async Task<ToolResponse> ExecuteAsync(object arg)
        {
            GetCanvasForChatSigntureToolArg getCanvasForChatSigntureToolArg = (GetCanvasForChatSigntureToolArg)arg;

            return await ExecuteTool<List<CanvaDto>>(() =>
                _canvaService.GetCanvasForChatSignture(getCanvasForChatSigntureToolArg.userId, getCanvasForChatSigntureToolArg.chatSignture), Name);
        }
    }

    public class GetCanvasForChatSigntureToolArg()
    {
        public Guid userId { get; set; }
        public string chatSignture { get; set; } = null!;
    }
}
