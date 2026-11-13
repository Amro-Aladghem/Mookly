using Application.Dtos;
using Application.Services;
using Application.Services.Coordinators;
using Domain.Enums;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Channels;

namespace Presentation
{
    [Route("api/v1/users")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly ChatService _chatService;
        private readonly NotificationService _notificationService;
        private readonly UserService _userService;
        private readonly MockInterviewService _mockInterviewService;
        private readonly MockInterviewResultService _mockInterviewResultService;
        private readonly CanvaService _canvaService;
        private readonly Channel<AgentRequestDto> _channel;

        public UserController(
            ChatService chatService,
            NotificationService notificationService,
            UserService userService,
            MockInterviewService mockInterviewService,
            MockInterviewResultService mockInterviewResultService,
            CanvaService canvaService,
            Channel<AgentRequestDto> channel)
        {
            _chatService = chatService;
            _notificationService = notificationService;
            _userService = userService;
            _mockInterviewService = mockInterviewService;
            _mockInterviewResultService = mockInterviewResultService;
            _canvaService = canvaService;
            _channel = channel;
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<UserDto>> CreateUser(UserDto userDto)
        {
            var result = await _userService.CreateUser(userDto);

            if (result is null)
                return BadRequest("Job type or job level was not found");

            return Ok(result);
        }

        [HttpGet("{userId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<UserDto>> GetUserInfo(Guid userId)
        {
            var result = await _userService.GetUserById(userId);

            if (result is null)
                return NotFound();

            return Ok(result);
        }

        [HttpPost("{userId}/chats")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ChatDto>> CreateChat(Guid userId, ChatDto chatDto)
        {
            var result = await _chatService.CreateChat(userId, chatDto);

            return Ok(result);
        }

        [HttpGet("{userId}/chats/{chatSignature}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<List<ChatDto>>> GetChatHistory(Guid userId, Guid chatSignature)
        {
            var result = await _chatService.GetChatsForChatId(userId, chatSignature);

            return Ok(result);
        }

        [HttpGet("{userId}/chats/{chatSignature}/notifications")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<List<NotificationDto>>> GetNotifications(Guid userId, Guid chatSignature)
        {
            var result = await _notificationService.GetNotificationsForChatId(userId, chatSignature);

            return Ok(result);
        }

        [HttpPost("{userId}/chats/{chatSignature}/agent")]
        [ProducesResponseType(StatusCodes.Status202Accepted)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<string>> ChatWithAgent(AgentRequestDto agentRequestDto, Guid userId, Guid chatSignature)
        {
            return await HandleChatWithAgent(agentRequestDto, userId, chatSignature);
        }

        [HttpPost("{userId}/chats/{chatSignature}/mock-interviews")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<MockInterviewDto>> CreateMockInterview(Guid userId, string chatSignature, CreateMockInterviewDto dto)
        {
            var result = await _mockInterviewService.CreateMockInterview(userId, chatSignature, dto);

            if (result is null)
                return BadRequest();

            return Ok(result);
        }

        [HttpGet("{userId}/chats/{chatSignature}/mock-interviews")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<GetMockInterviewDto>> GetMockInterview(Guid userId, string chatSignature)
        {
            var result = await _mockInterviewService.GetMockInterviewByChatSignture(userId, chatSignature);

            if (result is null)
                return NotFound();

            return Ok(result);
        }

        [HttpGet("{userId}/mock-interviews")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<List<GetMockInterviewDto>>> GetMockInterviewsForUser(Guid userId)
        {
            var result = await _mockInterviewService.GetAllMockInterviewsByUserId(userId);

            return Ok(result);
        }

        [HttpGet("{userId}/mock-interviews/last")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<GetMockInterviewDto>> GetLastMockInterview(Guid userId)
        {
            var result = await _mockInterviewService.GetLastMockInterview(userId);

            if (result is null)
                return NotFound();

            return Ok(result);
        }

        [HttpGet("{userId}/mock-interviews/{mockInterviewId}/result")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<MockInterviewResultDto>> GetMockInterviewResult(Guid userId, Guid mockInterviewId)
        {
            var result = await _mockInterviewResultService.GetMockInterviewResultByMockInterviewId(userId, mockInterviewId);

            if (result is null)
                return NotFound();

            return Ok(result);
        }

        [HttpGet("{userId}/chats/{chatSignature}/canvas")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<List<CanvaDto>>> GetCanvasForChat(Guid userId, string chatSignature)
        {
            var result = await _canvaService.GetCanvasForChatSignture(userId, chatSignature);

            return Ok(result);
        }

        [HttpGet("{userId}/canvas/{canvaId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<CanvaDto>> GetCanvasById(Guid userId, Guid canvaId)
        {
            var result = await _canvaService.GetCanvaById(userId, canvaId);

            if (result is null)
                return NotFound();

            return Ok(result);
        }

        private async Task<ActionResult<string>> HandleChatWithAgent(AgentRequestDto agentRequestDto, Guid userId, Guid chatSignature)
        {
            string agentType = eAgentType.InterviewerAgent.ToString();

            await _chatService.CreateChat(userId, new ChatDto()
            {
                ChatSignature = chatSignature,
                UserId = userId,
                ChatRoleId = (int)eChatRole.User,
                Message = agentRequestDto.Message,
                ImageUrl = agentRequestDto.ImageUri,
                AgentType = agentType,
                ShowMessage = true,
                CreationTime = DateTime.UtcNow
            });

            await _notificationService.CreateNotification(userId, new NotificationDto()
            {
                UserId = userId,
                ChatId = chatSignature,
                AgentType = agentType
            });

            agentRequestDto.AgentType = agentType;
            agentRequestDto.UserId = userId;
            agentRequestDto.ChatSignture = chatSignature;

            await _channel.Writer.WriteAsync(agentRequestDto);

            return Accepted(agentType);
        }
    }
}
