using Application.Dtos;
using Application.Services;
using Application.Tools.Interfaces;

namespace Application.Tools.JobLevels
{
    public class GetJobLevelsTool : BaseTool, IAgentTool
    {
        private readonly JobLevelService _jobLevelService;

        public GetJobLevelsTool(JobLevelService jobLevelService)
        {
            _jobLevelService = jobLevelService;
        }

        public string Name => "GetJobLevelsTool";
        public Type ArgType => typeof(GetJobLevelsToolArg);

        public async Task<ToolResponse> ExecuteAsync(object arg)
        {
            return await ExecuteTool<List<JobLevelDto>>(() =>
                _jobLevelService.GetJobLevels(), Name);
        }
    }

    public class GetJobLevelsToolArg()
    {
    }
}
