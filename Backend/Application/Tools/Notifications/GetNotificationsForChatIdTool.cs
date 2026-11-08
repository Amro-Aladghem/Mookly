using Application.Dtos;
using Application.Services;
using Application.Tools.Interfaces;

namespace Application.Tools.Notifications
{
    public class GetNotificationsForChatIdTool : BaseTool, IAgentTool
    {
        private readonly NotificationService _notificationService;

        public GetNotificationsForChatIdTool(NotificationService notificationService)
        {
            _notificationService = notificationService;
        }

        public string Name => "GetNotificationsForChatIdTool";
        public Type ArgType => typeof(GetNotificationsForChatIdToolArg);

        public async Task<ToolResponse> ExecuteAsync(object arg)
        {
            GetNotificationsForChatIdToolArg getNotificationsForChatIdToolArg = (GetNotificationsForChatIdToolArg)arg;

            return await ExecuteTool<List<NotificationDto>>(() =>
                _notificationService.GetNotificationsForChatId(getNotificationsForChatIdToolArg.userId, getNotificationsForChatIdToolArg.chatId), Name);
        }
    }

    public class GetNotificationsForChatIdToolArg()
    {
        public Guid userId { get; set; }
        public Guid chatId { get; set; }
    }
}
