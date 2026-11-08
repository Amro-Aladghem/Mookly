using Application.Dtos;
using Application.Services;
using Application.Tools.Interfaces;

namespace Application.Tools.MockInterviewTypes
{
    public class GetMockInterviewTypeByIdTool : BaseTool, IAgentTool
    {
        private readonly MockInterviewTypeService _mockInterviewTypeService;

        public GetMockInterviewTypeByIdTool(MockInterviewTypeService mockInterviewTypeService)
        {
            _mockInterviewTypeService = mockInterviewTypeService;
        }

        public string Name => "GetMockInterviewTypeByIdTool";
        public Type ArgType => typeof(GetMockInterviewTypeByIdToolArg);

        public async Task<ToolResponse> ExecuteAsync(object arg)
        {
            GetMockInterviewTypeByIdToolArg getMockInterviewTypeByIdToolArg = (GetMockInterviewTypeByIdToolArg)arg;

            return await ExecuteTool<MockInterviewTypeDto?>(() =>
                _mockInterviewTypeService.GetMockInterviewTypeById(getMockInterviewTypeByIdToolArg.id), Name);
        }
    }

    public class GetMockInterviewTypeByIdToolArg()
    {
        public Guid id { get; set; }
    }
}
