using Application.Dtos;
using Application.Services;
using Application.Tools.Interfaces;

namespace Application.Tools.JobTypes
{
    public class GetJobTypesTool : BaseTool, IAgentTool
    {
        private readonly JobTypeService _jobTypeService;

        public GetJobTypesTool(JobTypeService jobTypeService)
        {
            _jobTypeService = jobTypeService;
        }

        public string Name => "GetJobTypesTool";
        public Type ArgType => typeof(GetJobTypesToolArg);

        public async Task<ToolResponse> ExecuteAsync(object arg)
        {
            return await ExecuteTool<List<JobTypeDto>>(() =>
                _jobTypeService.GetJobTypes(), Name);
        }
    }

    public class GetJobTypesToolArg()
    {
    }
}
