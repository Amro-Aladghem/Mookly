using Application.Dtos;
using Application.Services;
using Application.Tools.Interfaces;

namespace Application.Tools.JobTypes
{
    public class GetJobTypeByIdTool : BaseTool, IAgentTool
    {
        private readonly JobTypeService _jobTypeService;

        public GetJobTypeByIdTool(JobTypeService jobTypeService)
        {
            _jobTypeService = jobTypeService;
        }

        public string Name => "GetJobTypeByIdTool";
        public Type ArgType => typeof(GetJobTypeByIdToolArg);

        public async Task<ToolResponse> ExecuteAsync(object arg)
        {
            GetJobTypeByIdToolArg getJobTypeByIdToolArg = (GetJobTypeByIdToolArg)arg;

            return await ExecuteTool<JobTypeDto?>(() =>
                _jobTypeService.GetJobTypeById(getJobTypeByIdToolArg.id), Name);
        }
    }

    public class GetJobTypeByIdToolArg()
    {
        public int id { get; set; }
    }
}
