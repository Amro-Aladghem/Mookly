using Application.Dtos;
using Application.Services;
using Application.Tools.Interfaces;

namespace Application.Tools.Notifications
{
    public class GetNotificationsForUserIdTool : BaseTool, IAgentTool
    {
        private readonly NotificationService _notificationService;

        public GetNotificationsForUserIdTool(NotificationService notificationService)
        {
            _notificationService = notificationService;
        }

        public string Name => "GetNotificationsForUserIdTool";
        public Type ArgType => typeof(GetNotificationsForUserIdToolArg);

        public async Task<ToolResponse> ExecuteAsync(object arg)
        {
            GetNotificationsForUserIdToolArg getNotificationsForUserIdToolArg = (GetNotificationsForUserIdToolArg)arg;

            return await ExecuteTool<List<NotificationDto>>(() =>
                _notificationService.GetNotificationsForUserId(getNotificationsForUserIdToolArg.userId), Name);
        }
    }

    public class GetNotificationsForUserIdToolArg()
    {
        public Guid userId { get; set; }
    }
}
