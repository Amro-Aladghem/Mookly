using Application.Services;
using Application.Services.Coordinators;
using Application.Tools.Coordinator;
using Domain.Enums;
using Infrastructure.AI.Chat;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Agents
{
    public class InterviewerAgent : BaseAgent, IAgent
    {
        public InterviewerAgent(AgentChatCoordinator agentChatCoordinator, ToolChatCoordinator toolChatCoordinator, IConfiguration configuration
            , InterviewerAgentChat interviewerAgentChat, NotificationService notificationService)
            : base(agentChatCoordinator, toolChatCoordinator, configuration, interviewerAgentChat, notificationService) { }
        protected override eAgentType _AgentType =>  eAgentType.InterviewerAgent;
    }
}
