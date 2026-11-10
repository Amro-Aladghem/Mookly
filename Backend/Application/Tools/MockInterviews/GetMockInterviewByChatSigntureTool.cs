using Application.Dtos;
using Application.Services;
using Application.Tools.Interfaces;

namespace Application.Tools.MockInterviews
{
    public class GetMockInterviewByChatSigntureTool : BaseTool, IAgentTool
    {
        private readonly MockInterviewService _mockInterviewService;

        public GetMockInterviewByChatSigntureTool(MockInterviewService mockInterviewService)
        {
            _mockInterviewService = mockInterviewService;
        }

        public string Name => "GetMockInterviewByChatSigntureTool";
        public Type ArgType => typeof(GetMockInterviewByChatSigntureToolArg);

        public async Task<ToolResponse> ExecuteAsync(object arg)
        {
            GetMockInterviewByChatSigntureToolArg getMockInterviewByChatSigntureToolArg = (GetMockInterviewByChatSigntureToolArg)arg;

            return await ExecuteTool<GetMockInterviewDto?>(() =>
                _mockInterviewService.GetMockInterviewByChatSignture(getMockInterviewByChatSigntureToolArg.userId, getMockInterviewByChatSigntureToolArg.chatSignture), Name);
        }
    }

    public class GetMockInterviewByChatSigntureToolArg()
    {
        public Guid userId { get; set; }
        public string chatSignture { get; set; } = null!;
    }
}
