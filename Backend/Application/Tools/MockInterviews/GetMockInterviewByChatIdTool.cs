using Application.Dtos;
using Application.Services;
using Application.Tools.Interfaces;

namespace Application.Tools.MockInterviews
{
    public class GetMockInterviewByChatIdTool : BaseTool, IAgentTool
    {
        private readonly MockInterviewService _mockInterviewService;

        public GetMockInterviewByChatIdTool(MockInterviewService mockInterviewService)
        {
            _mockInterviewService = mockInterviewService;
        }

        public string Name => "GetMockInterviewByChatIdTool";
        public Type ArgType => typeof(GetMockInterviewByChatIdToolArg);

        public async Task<ToolResponse> ExecuteAsync(object arg)
        {
            GetMockInterviewByChatIdToolArg getMockInterviewByChatIdToolArg = (GetMockInterviewByChatIdToolArg)arg;

            return await ExecuteTool<GetMockInterviewDto?>(() =>
                _mockInterviewService.GetMockInterviewByChatId(getMockInterviewByChatIdToolArg.userId, getMockInterviewByChatIdToolArg.chatId), Name);
        }
    }

    public class GetMockInterviewByChatIdToolArg()
    {
        public Guid userId { get; set; }
        public Guid chatId { get; set; }
    }
}
