using Application.Dtos;
using Application.Services;
using Application.Tools.Interfaces;

namespace Application.Tools.Notifications
{
    public class CreateNotificationTool : BaseTool, IAgentTool
    {
        private readonly NotificationService _notificationService;

        public CreateNotificationTool(NotificationService notificationService)
        {
            _notificationService = notificationService;
        }

        public string Name => "CreateNotificationTool";
        public Type ArgType => typeof(CreateNotificationToolArg);

        public async Task<ToolResponse> ExecuteAsync(object arg)
        {
            CreateNotificationToolArg createNotificationToolArg = (CreateNotificationToolArg)arg;

            return await ExecuteTool<NotificationDto>(() =>
                _notificationService.CreateNotification(createNotificationToolArg.userId, createNotificationToolArg.notificationDto), Name);
        }
    }

    public class CreateNotificationToolArg()
    {
        public Guid userId { get; set; }
        public NotificationDto notificationDto { get; set; } = null!;
    }
}
