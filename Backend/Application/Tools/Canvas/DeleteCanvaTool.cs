using Application.Services;
using Application.Tools.Interfaces;

namespace Application.Tools.Canvas
{
    public class DeleteCanvaTool : BaseTool, IAgentTool
    {
        private readonly CanvaService _canvaService;

        public DeleteCanvaTool(CanvaService canvaService)
        {
            _canvaService = canvaService;
        }

        public string Name => "DeleteCanvaTool";
        public Type ArgType => typeof(DeleteCanvaToolArg);

        public async Task<ToolResponse> ExecuteAsync(object arg)
        {
            DeleteCanvaToolArg deleteCanvaToolArg = (DeleteCanvaToolArg)arg;

            return await ExecuteTool<bool>(() =>
                _canvaService.DeleteCanva(deleteCanvaToolArg.userId, deleteCanvaToolArg.id), Name);
        }
    }

    public class DeleteCanvaToolArg()
    {
        public Guid userId { get; set; }
        public Guid id { get; set; }
    }
}
