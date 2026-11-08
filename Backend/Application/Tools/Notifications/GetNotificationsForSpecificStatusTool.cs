using Application.Dtos;
using Application.Services;
using Application.Tools.Interfaces;
using Domain.Enums;

namespace Application.Tools.Notifications
{
    public class GetNotificationsForSpecificStatusTool : BaseTool, IAgentTool
    {
        private readonly NotificationService _notificationService;

        public GetNotificationsForSpecificStatusTool(NotificationService notificationService)
        {
            _notificationService = notificationService;
        }

        public string Name => "GetNotificationsForSpecificStatusTool";
        public Type ArgType => typeof(GetNotificationsForSpecificStatusToolArg);

        public async Task<ToolResponse> ExecuteAsync(object arg)
        {
            GetNotificationsForSpecificStatusToolArg getNotificationsForSpecificStatusToolArg = (GetNotificationsForSpecificStatusToolArg)arg;

            return await ExecuteTool<List<NotificationDto>>(() =>
                _notificationService.GetNotificationsForSpecificStatus(getNotificationsForSpecificStatusToolArg.userId, getNotificationsForSpecificStatusToolArg.status), Name);
        }
    }

    public class GetNotificationsForSpecificStatusToolArg()
    {
        public Guid userId { get; set; }
        public eNotificationStatus status { get; set; }
    }
}
