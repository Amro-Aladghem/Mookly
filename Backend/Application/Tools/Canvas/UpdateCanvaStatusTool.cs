using Application.Dtos;
using Application.Services;
using Application.Tools.Interfaces;

namespace Application.Tools.Canvas
{
    public class UpdateCanvaStatusTool : BaseTool, IAgentTool
    {
        private readonly CanvaService _canvaService;

        public UpdateCanvaStatusTool(CanvaService canvaService)
        {
            _canvaService = canvaService;
        }

        public string Name => "UpdateCanvaStatusTool";
        public Type ArgType => typeof(UpdateCanvaStatusToolArg);

        public async Task<ToolResponse> ExecuteAsync(object arg)
        {
            UpdateCanvaStatusToolArg updateCanvaStatusToolArg = (UpdateCanvaStatusToolArg)arg;

            return await ExecuteTool<CanvaDto?>(() =>
                _canvaService.UpdateCanvaStatus(updateCanvaStatusToolArg.userId, updateCanvaStatusToolArg.id, updateCanvaStatusToolArg.canvaStatusDto), Name);
        }
    }

    public class UpdateCanvaStatusToolArg()
    {
        public Guid userId { get; set; }
        public Guid id { get; set; }
        public CanvaStatusDto canvaStatusDto { get; set; } = null!;
    }
}
