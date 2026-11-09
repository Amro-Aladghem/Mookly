using Infrastructure.AI.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace Infrastructure.AI.Chat
{
    public class InterviewerAgentChat : IAgentChat
    {
        public Task<string?> Chat(Guid inventoryId, object? messagesContext)
        {
            throw new NotImplementedException();
        }
    }
}
