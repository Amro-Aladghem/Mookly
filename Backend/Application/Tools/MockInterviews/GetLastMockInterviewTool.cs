using Application.Dtos;
using Application.Services;
using Application.Tools.Interfaces;

namespace Application.Tools.MockInterviews
{
    public class GetLastMockInterviewTool : BaseTool, IAgentTool
    {
        private readonly MockInterviewService _mockInterviewService;

        public GetLastMockInterviewTool(MockInterviewService mockInterviewService)
        {
            _mockInterviewService = mockInterviewService;
        }

        public string Name => "GetLastMockInterviewTool";
        public Type ArgType => typeof(GetLastMockInterviewToolArg);

        public async Task<ToolResponse> ExecuteAsync(object arg)
        {
            GetLastMockInterviewToolArg getLastMockInterviewToolArg = (GetLastMockInterviewToolArg)arg;

            return await ExecuteTool<GetMockInterviewDto?>(() =>
                _mockInterviewService.GetLastMockInterview(getLastMockInterviewToolArg.userId), Name);
        }
    }

    public class GetLastMockInterviewToolArg()
    {
        public Guid userId { get; set; }
    }
}
