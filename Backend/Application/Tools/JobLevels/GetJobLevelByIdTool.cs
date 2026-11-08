using Application.Dtos;
using Application.Services;
using Application.Tools.Interfaces;

namespace Application.Tools.JobLevels
{
    public class GetJobLevelByIdTool : BaseTool, IAgentTool
    {
        private readonly JobLevelService _jobLevelService;

        public GetJobLevelByIdTool(JobLevelService jobLevelService)
        {
            _jobLevelService = jobLevelService;
        }

        public string Name => "GetJobLevelByIdTool";
        public Type ArgType => typeof(GetJobLevelByIdToolArg);

        public async Task<ToolResponse> ExecuteAsync(object arg)
        {
            GetJobLevelByIdToolArg getJobLevelByIdToolArg = (GetJobLevelByIdToolArg)arg;

            return await ExecuteTool<JobLevelDto?>(() =>
                _jobLevelService.GetJobLevelById(getJobLevelByIdToolArg.id), Name);
        }
    }

    public class GetJobLevelByIdToolArg()
    {
        public int id { get; set; }
    }
}
