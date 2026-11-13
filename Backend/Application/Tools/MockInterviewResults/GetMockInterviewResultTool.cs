using Application.Dtos;
using Application.Services;
using Application.Tools.Interfaces;

namespace Application.Tools.MockInterviewResults
{
    public class GetMockInterviewResultTool : BaseTool, IAgentTool
    {
        private readonly MockInterviewResultService _mockInterviewResultService;

        public GetMockInterviewResultTool(MockInterviewResultService mockInterviewResultService)
        {
            _mockInterviewResultService = mockInterviewResultService;
        }

        public string Name => "GetMockInterviewResultTool";
        public Type ArgType => typeof(GetMockInterviewResultToolArg);

        public async Task<ToolResponse> ExecuteAsync(object arg)
        {
            GetMockInterviewResultToolArg getMockInterviewResultToolArg = (GetMockInterviewResultToolArg)arg;

            return await ExecuteTool<MockInterviewResultDto?>(() =>
                _mockInterviewResultService.GetMockInterviewResultByMockInterviewId(getMockInterviewResultToolArg.userId, getMockInterviewResultToolArg.mockInterviewId), Name);
        }
    }

    public class GetMockInterviewResultToolArg()
    {
        public Guid userId { get; set; }
        public Guid mockInterviewId { get; set; }
    }
}
