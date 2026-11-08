using Application.Dtos;
using Domain.Entities;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Application.Services
{
    public class ChatRoleService
    {
        private readonly AppDbContext _context;

        public ChatRoleService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<ChatRoleDto>> GetChatRoles()
        {
            return await _context.ChatRoles
                .Select(r => ToDto(r))
                .ToListAsync();
        }

        public async Task<ChatRoleDto?> GetChatRoleById(int id)
        {
            return await _context.ChatRoles
                .Where(r => r.Id == id)
                .Select(r => ToDto(r))
                .FirstOrDefaultAsync();
        }

        private static ChatRoleDto ToDto(ChatRole r)
        {
            return new ChatRoleDto
            {
                Id = r.Id,
                Name = r.Name
            };
        }
    }
}
