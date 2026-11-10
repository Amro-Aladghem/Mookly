using Application.Dtos;
using Application.Services;
using Application.Tools.Interfaces;

namespace Application.Tools.MockInterviewResults
{
    public class CreateMockInterviewResultTool : BaseTool, IAgentTool
    {
        private readonly MockInterviewResultService _mockInterviewResultService;

        public CreateMockInterviewResultTool(MockInterviewResultService mockInterviewResultService)
        {
            _mockInterviewResultService = mockInterviewResultService;
        }

        public string Name => "CreateMockInterviewResultTool";
        public Type ArgType => typeof(CreateMockInterviewResultToolArg);

        public async Task<ToolResponse> ExecuteAsync(object arg)
        {
            CreateMockInterviewResultToolArg createMockInterviewResultToolArg = (CreateMockInterviewResultToolArg)arg;

            return await ExecuteTool<MockInterviewResultDto?>(() =>
                _mockInterviewResultService.CreateMockInterviewResult(createMockInterviewResultToolArg.mockInterviewResultDto, createMockInterviewResultToolArg.mockInterviewId), Name);
        }
    }

    public class CreateMockInterviewResultToolArg()
    {
        public MockInterviewResultDto mockInterviewResultDto { get; set; } = null!;
        public Guid mockInterviewId { get; set; }
    }
}
