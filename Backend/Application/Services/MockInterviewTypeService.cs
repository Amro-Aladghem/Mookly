using Application.Dtos;
using Domain.Entities;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Application.Services
{
    public class MockInterviewTypeService
    {
        private readonly AppDbContext _context;

        public MockInterviewTypeService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<MockInterviewTypeDto>> GetMockInterviewTypes()
        {
            return await _context.MockInterviewTypes
                .Select(t => ToDto(t))
                .ToListAsync();
        }

        public async Task<MockInterviewTypeDto?> GetMockInterviewTypeById(Guid id)
        {
            return await _context.MockInterviewTypes
                .Where(t => t.Id == id)
                .Select(t => ToDto(t))
                .FirstOrDefaultAsync();
        }

        private static MockInterviewTypeDto ToDto(MockInterviewType t)
        {
            return new MockInterviewTypeDto
            {
                Id = t.Id,
                Title = t.Title,
                Description = t.Description
            };
        }
    }
}
