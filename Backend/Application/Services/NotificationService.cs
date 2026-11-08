using Application.Dtos;
using Domain.Entities;
using Domain.Enums;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Application.Services
{
    public class NotificationService
    {
        private readonly AppDbContext _context;

        public NotificationService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<NotificationDto> CreateNotification(Guid userId, NotificationDto dto)
        {
            var notification = new Notification
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                ChatSignture = dto.ChatId,
                Text = dto.Text,
                NotficationStatus = Enum.Parse<eNotificationStatus>(dto.NotificationStatus, true),
                AgentType = Enum.Parse<eAgentType>(dto.AgentType, true),
                Data = dto.Data,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();

            return ToDto(notification);
        }

        public async Task<List<NotificationDto>> GetNotificationsForChatId(Guid userId, Guid chatId)
        {
            return await _context.Notifications
                .Where(n => n.UserId == userId && n.ChatSignture == chatId)
                .OrderBy(n => n.UpdatedAt)
                .Select(n => ToDto(n))
                .ToListAsync();
        }

        public async Task<List<NotificationDto>> GetNotificationsForUserId(Guid userId)
        {
            return await _context.Notifications
                .Where(n => n.UserId == userId)
                .OrderBy(n => n.UpdatedAt)
                .Select(n => ToDto(n))
                .ToListAsync();
        }

        public async Task<List<NotificationDto>> GetNotificationsForSpecificStatus(Guid userId, eNotificationStatus status)
        {
            return await _context.Notifications
                .Where(n => n.UserId == userId && n.NotficationStatus == status)
                .Select(n => ToDto(n))
                .ToListAsync();
        }

        private static NotificationDto ToDto(Notification n)
        {
            return new NotificationDto
            {
                Id = n.Id,
                UserId = n.UserId,
                ChatId = n.ChatSignture,
                Text = n.Text,
                NotificationStatus = n.NotficationStatus.ToString(),
                AgentType = n.AgentType.ToString(),
                Data = n.Data,
                UpdatedAt = n.UpdatedAt
            };
        }
    }
}
