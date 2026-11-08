using Application.Dtos;
using Application.Services;
using Application.Tools.Interfaces;

namespace Application.Tools.MockInterviews
{
    public class GetAllMockInterviewsByUserIdTool : BaseTool, IAgentTool
    {
        private readonly MockInterviewService _mockInterviewService;

        public GetAllMockInterviewsByUserIdTool(MockInterviewService mockInterviewService)
        {
            _mockInterviewService = mockInterviewService;
        }

        public string Name => "GetAllMockInterviewsByUserIdTool";
        public Type ArgType => typeof(GetAllMockInterviewsByUserIdToolArg);

        public async Task<ToolResponse> ExecuteAsync(object arg)
        {
            GetAllMockInterviewsByUserIdToolArg getAllMockInterviewsByUserIdToolArg = (GetAllMockInterviewsByUserIdToolArg)arg;

            return await ExecuteTool<List<GetMockInterviewDto>>(() =>
                _mockInterviewService.GetAllMockInterviewsByUserId(getAllMockInterviewsByUserIdToolArg.userId), Name);
        }
    }

    public class GetAllMockInterviewsByUserIdToolArg()
    {
        public Guid userId { get; set; }
    }
}
