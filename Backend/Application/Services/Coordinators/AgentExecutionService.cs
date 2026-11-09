using Application.Agents;
using Application.Dtos;
using Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Services.Coordinators
{
    public class AgentExecutionService
    {
        private readonly InterviewerAgent _interviewerAgent;
        public AgentExecutionService(InterviewerAgent interviewerAgent)
        {
           _interviewerAgent = interviewerAgent;
        }

        public async Task<AgentRunResultDto> ExecutAgent(AgentRequestDto agentRequestDto,string agentType)
        {
            eAgentType type = Enum.Parse<eAgentType>(agentType);

            BaseAgent agent = type switch
            {
                eAgentType.InterviewerAgent => _interviewerAgent,
                _ => throw new ArgumentOutOfRangeException(nameof(agentType))
            };

            return await agent.RunAsync(agentRequestDto);
        }
    }
}
