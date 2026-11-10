using Application.Dtos;
using Domain.Entities;
using Domain.Enums;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Application.Services
{
    public class MockInterviewService
    {
        private readonly AppDbContext _context;

        public MockInterviewService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<MockInterviewDto?> CreateMockInterview(Guid userId, string chatSignture, CreateMockInterviewDto dto)
        {
            var mockInterview = new MockInterview
            {
                Id = Guid.NewGuid(),
                ChatSignture = chatSignture,
                UserId = userId,
                MockInterviewTypeId = dto.MockInterviewTypeId,
                eMockInterviewStatus = eMockInterviewStatus.Scheduled,
                JobTypeId = dto.JobTypeId,
                JobLevelId = dto.JobLevelId,
                About = dto.About,
                CreatedAt = DateTime.UtcNow
            };

            _context.MockInterviews.Add(mockInterview);
            await _context.SaveChangesAsync();

            return ToDto(mockInterview);
        }

        public async Task<MockInterviewDto?> UpdateMockInterviewStatus(Guid userId, Guid id, string status)
        {
            var mockInterview = await _context.MockInterviews
                .FirstOrDefaultAsync(m => m.Id == id && m.UserId == userId);

            if (mockInterview is null)
                return null;

            mockInterview.eMockInterviewStatus = Enum.Parse<eMockInterviewStatus>(status);

            await _context.SaveChangesAsync();

            return ToDto(mockInterview);
        }

        public async Task<GetMockInterviewDto?> GetMockInterviewByChatSignture(Guid userId, string chatSignture)
        {
            return await _context.MockInterviews
                .Where(m => m.UserId == userId && m.ChatSignture == chatSignture)
                .Select(m => new GetMockInterviewDto
                {
                    Id = m.Id,
                    ChatSignture = m.ChatSignture,
                    UserId = m.UserId,
                    MockInterviewType = m.MockInterviewType.Description == null || m.MockInterviewType.Description == ""
                        ? m.MockInterviewType.Title
                        : m.MockInterviewType.Title + " - " + m.MockInterviewType.Description,
                    Status = m.eMockInterviewStatus.ToString(),
                    JobType = m.JobType == null ? null : m.JobType.Name,
                    JobLevel = m.JobLevel == null ? null : m.JobLevel.Name,
                    About = m.About
                })
                .FirstOrDefaultAsync();
        }

        public async Task<List<GetMockInterviewDto>> GetAllMockInterviewsByUserId(Guid userId)
        {
            return await _context.MockInterviews
                .Where(m => m.UserId == userId)
                .Select(m => new GetMockInterviewDto
                {
                    Id = m.Id,
                    ChatSignture = m.ChatSignture,
                    UserId = m.UserId,
                    MockInterviewType = m.MockInterviewType.Description == null || m.MockInterviewType.Description == ""
                        ? m.MockInterviewType.Title
                        : m.MockInterviewType.Title + " - " + m.MockInterviewType.Description,
                    Status = m.eMockInterviewStatus.ToString(),
                    JobType = m.JobType == null ? null : m.JobType.Name,
                    JobLevel = m.JobLevel == null ? null : m.JobLevel.Name,
                    About = m.About
                })
                .ToListAsync();
        }

        public async Task<GetMockInterviewDto?> GetLastMockInterview(Guid userId)
        {
            return await _context.MockInterviews
                .Where(m => m.UserId == userId)
                .OrderByDescending(m => m.CreatedAt)
                .Select(m => new GetMockInterviewDto
                {
                    Id = m.Id,
                    ChatSignture = m.ChatSignture,
                    UserId = m.UserId,
                    MockInterviewType = m.MockInterviewType.Description == null || m.MockInterviewType.Description == ""
                        ? m.MockInterviewType.Title
                        : m.MockInterviewType.Title + " - " + m.MockInterviewType.Description,
                    Status = m.eMockInterviewStatus.ToString(),
                    JobType = m.JobType == null ? null : m.JobType.Name,
                    JobLevel = m.JobLevel == null ? null : m.JobLevel.Name,
                    About = m.About
                })
                .FirstOrDefaultAsync();
        }

        private static MockInterviewDto ToDto(MockInterview m)
        {
            return new MockInterviewDto
            {
                Id = m.Id,
                ChatSignture = m.ChatSignture,
                UserId = m.UserId,
                MockInterviewTypeId = m.MockInterviewTypeId,
                Status = m.eMockInterviewStatus.ToString(),
                JobTypeId = m.JobTypeId,
                JobLevelId = m.JobLevelId,
                About = m.About
            };
        }
    }
}
