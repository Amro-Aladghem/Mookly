using Application.Dtos;
using Domain.Entities;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Application.Services
{
    public class UserService
    {
        private readonly AppDbContext _context;

        public UserService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<UserDto?> CreateUser(UserDto dto)
        {
            var jobType = await _context.JobTypes
                .FirstOrDefaultAsync(j => j.Name == dto.JobType);

            if (jobType is null)
                return null;

            var jobLevel = await _context.JobLevels
                .FirstOrDefaultAsync(j => j.Name == dto.JobLevel);

            if (jobLevel is null)
                return null;

            var user = new User
            {
                Id = Guid.NewGuid(),
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                About = dto.About,
                JobTypeId = jobType.Id,
                JobLevelId = jobLevel.Id,
                CreatedDateTime = DateTime.UtcNow,
                JobType = jobType,
                JobLevel = jobLevel
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return ToDto(user);
        }

        public async Task<UserDto?> GetUserById(Guid id)
        {
            var user = await _context.Users
                .Include(u => u.JobType)
                .Include(u => u.JobLevel)
                .FirstOrDefaultAsync(u => u.Id == id);

            return user is null ? null : ToDto(user);
        }

        public async Task<UserDto?> UpdateUser(Guid id, UserDto dto)
        {
            var user = await _context.Users
                .Include(u => u.JobType)
                .Include(u => u.JobLevel)
                .FirstOrDefaultAsync(u => u.Id == id);

            if (user is null)
                return null;

            var jobType = await _context.JobTypes
                .FirstOrDefaultAsync(j => j.Name == dto.JobType);

            if (jobType is null)
                return null;

            var jobLevel = await _context.JobLevels
                .FirstOrDefaultAsync(j => j.Name == dto.JobLevel);

            if (jobLevel is null)
                return null;

            user.FirstName = dto.FirstName;
            user.LastName = dto.LastName;
            user.About = dto.About;
            user.JobTypeId = jobType.Id;
            user.JobLevelId = jobLevel.Id;
            user.JobType = jobType;
            user.JobLevel = jobLevel;

            await _context.SaveChangesAsync();

            return ToDto(user);
        }

        public async Task<bool> DeleteUser(Guid id)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == id);

            if (user is null)
                return false;

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return true;
        }

        private static UserDto ToDto(User u)
        {
            return new UserDto
            {
                Id = u.Id,
                FirstName = u.FirstName,
                LastName = u.LastName,
                About = u.About,
                JobType = u.JobType.Name,
                JobLevel = u.JobLevel.Name,
                CreatedDateTime = u.CreatedDateTime
            };
        }
    }
}
