using Application.Dtos;
using Domain.Entities;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Application.Services
{
    public class JobLevelService
    {
        private readonly AppDbContext _context;

        public JobLevelService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<JobLevelDto>> GetJobLevels()
        {
            return await _context.JobLevels
                .Select(j => ToDto(j))
                .ToListAsync();
        }

        public async Task<JobLevelDto?> GetJobLevelById(int id)
        {
            return await _context.JobLevels
                .Where(j => j.Id == id)
                .Select(j => ToDto(j))
                .FirstOrDefaultAsync();
        }

        private static JobLevelDto ToDto(JobLevel j)
        {
            return new JobLevelDto
            {
                Id = j.Id,
                Name = j.Name
            };
        }
    }
}
