using Application.Dtos;
using Application.Services;
using Application.Tools.Interfaces;

namespace Application.Tools.MockInterviews
{
    public class UpdateMockInterviewStatusTool : BaseTool, IAgentTool
    {
        private readonly MockInterviewService _mockInterviewService;

        public UpdateMockInterviewStatusTool(MockInterviewService mockInterviewService)
        {
            _mockInterviewService = mockInterviewService;
        }

        public string Name => "UpdateMockInterviewStatusTool";
        public Type ArgType => typeof(UpdateMockInterviewStatusToolArg);

        public async Task<ToolResponse> ExecuteAsync(object arg)
        {
            UpdateMockInterviewStatusToolArg updateMockInterviewStatusToolArg = (UpdateMockInterviewStatusToolArg)arg;

            return await ExecuteTool<MockInterviewDto?>(() =>
                _mockInterviewService.UpdateMockInterviewStatus(updateMockInterviewStatusToolArg.userId, updateMockInterviewStatusToolArg.id, updateMockInterviewStatusToolArg.status), Name);
        }
    }

    public class UpdateMockInterviewStatusToolArg()
    {
        public Guid userId { get; set; }
        public Guid id { get; set; }
        public string status { get; set; } = null!;
    }
}
