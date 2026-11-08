using Application.Dtos;
using Application.Services;
using Application.Tools.Interfaces;

namespace Application.Tools.Canvas
{
    public class GetCanvaByIdTool : BaseTool, IAgentTool
    {
        private readonly CanvaService _canvaService;

        public GetCanvaByIdTool(CanvaService canvaService)
        {
            _canvaService = canvaService;
        }

        public string Name => "GetCanvaByIdTool";
        public Type ArgType => typeof(GetCanvaByIdToolArg);

        public async Task<ToolResponse> ExecuteAsync(object arg)
        {
            GetCanvaByIdToolArg getCanvaByIdToolArg = (GetCanvaByIdToolArg)arg;

            return await ExecuteTool<CanvaDto?>(() =>
                _canvaService.GetCanvaById(getCanvaByIdToolArg.userId, getCanvaByIdToolArg.id), Name);
        }
    }

    public class GetCanvaByIdToolArg()
    {
        public Guid userId { get; set; }
        public Guid id { get; set; }
    }
}
