using Application.Dtos;
using Domain.Entities;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Application.Services
{
    public class MockInterviewResultService
    {
        private readonly AppDbContext _context;

        public MockInterviewResultService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<MockInterviewResultDto?> CreateMockInterviewResult(MockInterviewResultDto dto, Guid mockInterviewId)
        {
            bool mockInterviewExists = await _context.MockInterviews
                .AnyAsync(m => m.Id == mockInterviewId);

            if (!mockInterviewExists)
                return null;

            var mockInterviewResult = new MockInterviewResult
            {
                Id = Guid.NewGuid(),
                MockInterviewId = mockInterviewId,
                OverallScore = dto.OverallScore,
                Summary = dto.Summary,
                Strengths = dto.Strengths,
                AreasForImprovement = dto.AreasForImprovement,
                Recommendations = dto.Recommendations,
                CreatedAt = DateTime.UtcNow
            };

            _context.MockInterviewResults.Add(mockInterviewResult);
            await _context.SaveChangesAsync();

            return ToDto(mockInterviewResult);
        }

        public async Task<MockInterviewResultDto?> GetMockInterviewResultByMockInterviewId(Guid userId, Guid mockInterviewId)
        {
            return await _context.MockInterviewResults
                .Where(r => r.MockInterviewId == mockInterviewId && r.MockInterview.UserId == userId)
                .Select(r => new MockInterviewResultDto
                {
                    Id = r.Id,
                    MockInterviewId = r.MockInterviewId,
                    OverallScore = r.OverallScore,
                    Summary = r.Summary,
                    Strengths = r.Strengths,
                    AreasForImprovement = r.AreasForImprovement,
                    Recommendations = r.Recommendations,
                    CreatedAt = r.CreatedAt
                })
                .FirstOrDefaultAsync();
        }

        private static MockInterviewResultDto ToDto(MockInterviewResult r)
        {
            return new MockInterviewResultDto
            {
                Id = r.Id,
                MockInterviewId = r.MockInterviewId,
                OverallScore = r.OverallScore,
                Summary = r.Summary,
                Strengths = r.Strengths,
                AreasForImprovement = r.AreasForImprovement,
                Recommendations = r.Recommendations,
                CreatedAt = r.CreatedAt
            };
        }
    }
}
