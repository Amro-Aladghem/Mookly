using Application.Dtos;
using Application.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Presentation
{
    [Route("api/v1/lookups")]
    [ApiController]
    public class LookupController : ControllerBase
    {
        private readonly JobTypeService _jobTypeService;
        private readonly JobLevelService _jobLevelService;
        private readonly MockInterviewTypeService _mockInterviewTypeService;

        public LookupController(
            JobTypeService jobTypeService,
            JobLevelService jobLevelService,
            MockInterviewTypeService mockInterviewTypeService)
        {
            _jobTypeService = jobTypeService;
            _jobLevelService = jobLevelService;
            _mockInterviewTypeService = mockInterviewTypeService;
        }

        [HttpGet("job-types")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<List<JobTypeDto>>> GetJobTypes()
        {
            var result = await _jobTypeService.GetJobTypes();

            return Ok(result);
        }

        [HttpGet("job-levels")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<List<JobLevelDto>>> GetJobLevels()
        {
            var result = await _jobLevelService.GetJobLevels();

            return Ok(result);
        }

        [HttpGet("mock-interview-types")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<List<MockInterviewTypeDto>>> GetMockInterviewTypes()
        {
            var result = await _mockInterviewTypeService.GetMockInterviewTypes();

            return Ok(result);
        }
    }
}
