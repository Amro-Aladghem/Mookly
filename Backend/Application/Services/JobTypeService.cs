using Application.Dtos;
using Domain.Entities;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Application.Services
{
    public class JobTypeService
    {
        private readonly AppDbContext _context;

        public JobTypeService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<JobTypeDto>> GetJobTypes()
        {
            return await _context.JobTypes
                .Select(j => ToDto(j))
                .ToListAsync();
        }

        public async Task<JobTypeDto?> GetJobTypeById(int id)
        {
            return await _context.JobTypes
                .Where(j => j.Id == id)
                .Select(j => ToDto(j))
                .FirstOrDefaultAsync();
        }

        private static JobTypeDto ToDto(JobType j)
        {
            return new JobTypeDto
            {
                Id = j.Id,
                Name = j.Name
            };
        }
    }
}
