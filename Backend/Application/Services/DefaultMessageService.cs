using Application.Dtos;
using Domain.Entities;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Application.Services
{
    public class DefaultMessageService
    {
        private readonly AppDbContext _context;

        public DefaultMessageService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<DefaultMessageDto>> GetDefaultMessages()
        {
            return await _context.DefaultMessages
                .Select(m => ToDto(m))
                .ToListAsync();
        }

        public async Task<DefaultMessageDto?> GetDefaultMessageById(Guid id)
        {
            return await _context.DefaultMessages
                .Where(m => m.Id == id)
                .Select(m => ToDto(m))
                .FirstOrDefaultAsync();
        }

        private static DefaultMessageDto ToDto(DefaultMessage m)
        {
            return new DefaultMessageDto
            {
                Id = m.Id,
                Text = m.Text,
                AudioUrl = m.AudioUrl
            };
        }
    }
}
