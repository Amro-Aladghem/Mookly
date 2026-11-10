using Application.Dtos;
using Application.Services;
using Application.Tools.Interfaces;

namespace Application.Tools.Canvas
{
    public class AddCanvaTool : BaseTool, IAgentTool
    {
        private readonly CanvaService _canvaService;

        public AddCanvaTool(CanvaService canvaService)
        {
            _canvaService = canvaService;
        }

        public string Name => "AddCanvaTool";
        public Type ArgType => typeof(AddCanvaToolArg);

        public async Task<ToolResponse> ExecuteAsync(object arg)
        {
            AddCanvaToolArg addCanvaToolArg = (AddCanvaToolArg)arg;

            return await ExecuteTool<CanvaDto?>(() =>
                _canvaService.AddCanva(addCanvaToolArg.userId, addCanvaToolArg.chatSignture, addCanvaToolArg.canvaDto), Name);
        }
    }

    public class AddCanvaToolArg()
    {
        public Guid userId { get; set; }
        public string chatSignture { get; set; } = null!;
        public CanvaDto canvaDto { get; set; } = null!;
    }
}
