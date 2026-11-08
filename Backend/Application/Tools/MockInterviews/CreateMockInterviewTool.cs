using Application.Dtos;
using Application.Services;
using Application.Tools.Interfaces;

namespace Application.Tools.MockInterviews
{
    public class CreateMockInterviewTool : BaseTool, IAgentTool
    {
        private readonly MockInterviewService _mockInterviewService;

        public CreateMockInterviewTool(MockInterviewService mockInterviewService)
        {
            _mockInterviewService = mockInterviewService;
        }

        public string Name => "CreateMockInterviewTool";
        public Type ArgType => typeof(CreateMockInterviewToolArg);

        public async Task<ToolResponse> ExecuteAsync(object arg)
        {
            CreateMockInterviewToolArg createMockInterviewToolArg = (CreateMockInterviewToolArg)arg;

            return await ExecuteTool<MockInterviewDto?>(() =>
                _mockInterviewService.CreateMockInterview(createMockInterviewToolArg.userId, createMockInterviewToolArg.chatId, createMockInterviewToolArg.createMockInterviewDto), Name);
        }
    }

    public class CreateMockInterviewToolArg()
    {
        public Guid userId { get; set; }
        public Guid chatId { get; set; }
        public CreateMockInterviewDto createMockInterviewDto { get; set; } = null!;
    }
}
