using Application.Dtos;
using Application.Services;
using Application.Tools.Interfaces;

namespace Application.Tools.MockInterviewTypes
{
    public class GetMockInterviewTypesTool : BaseTool, IAgentTool
    {
        private readonly MockInterviewTypeService _mockInterviewTypeService;

        public GetMockInterviewTypesTool(MockInterviewTypeService mockInterviewTypeService)
        {
            _mockInterviewTypeService = mockInterviewTypeService;
        }

        public string Name => "GetMockInterviewTypesTool";
        public Type ArgType => typeof(GetMockInterviewTypesToolArg);

        public async Task<ToolResponse> ExecuteAsync(object arg)
        {
            return await ExecuteTool<List<MockInterviewTypeDto>>(() =>
                _mockInterviewTypeService.GetMockInterviewTypes(), Name);
        }
    }

    public class GetMockInterviewTypesToolArg()
    {
    }
}
