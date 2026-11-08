using Application.Dtos;
using Domain.Entities;
using Domain.Enums;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Application.Services
{
    public class CanvaService
    {
        private readonly AppDbContext _context;

        public CanvaService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<CanvaDto?> AddCanva(Guid userId, Guid chatId, CanvaDto dto)
        {
            var canva = new Canva
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                ChatId = chatId,
                Content = dto.Content,
                IsSolved = dto.IsSolved,
                UserAnswer = dto.UserAnswer,
                CanvaType = string.IsNullOrWhiteSpace(dto.CanvaType)
                    ? eCanvaType.Markdown
                    : Enum.Parse<eCanvaType>(dto.CanvaType, true)
            };

            _context.Canvas.Add(canva);
            await _context.SaveChangesAsync();

            return ToDto(canva);
        }

        public async Task<CanvaDto?> UpdateCanvaStatus(Guid userId, Guid id, CanvaStatusDto dto)
        {
            var canva = await _context.Canvas
                .FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId);

            if (canva is null)
                return null;

            canva.IsSolved = dto.IsSolved;
            canva.UserAnswer = dto.UserAnswer;

            await _context.SaveChangesAsync();

            return ToDto(canva);
        }

        public async Task<bool> DeleteCanva(Guid userId, Guid id)
        {
            var canva = await _context.Canvas
                .FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId);

            if (canva is null)
                return false;

            _context.Canvas.Remove(canva);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<CanvaDto?> GetCanvaById(Guid userId, Guid id)
        {
            return await _context.Canvas
                .Where(c => c.Id == id && c.UserId == userId)
                .Select(c => ToDto(c))
                .FirstOrDefaultAsync();
        }

        public async Task<List<CanvaDto>> GetCanvasForChatId(Guid userId, Guid chatId)
        {
            return await _context.Canvas
                .Where(c => c.UserId == userId && c.ChatId == chatId)
                .Select(c => ToDto(c))
                .ToListAsync();
        }

        private static CanvaDto ToDto(Canva c)
        {
            return new CanvaDto
            {
                Id = c.Id,
                UserId = c.UserId,
                ChatId = c.ChatId,
                Content = c.Content,
                IsSolved = c.IsSolved,
                UserAnswer = c.UserAnswer,
                CanvaType = c.CanvaType.ToString()
            };
        }
    }
}
