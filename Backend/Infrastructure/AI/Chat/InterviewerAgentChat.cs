using Infrastructure.AI.Interfaces;
using Mscc.GenerativeAI;
using Mscc.GenerativeAI.Types;
using System;
using System.Collections.Generic;
using System.Reflection.Metadata;
using System.Text;
using System.Text.Json;

namespace Infrastructure.AI.Chat
{
    public class InterviewerAgentChat : IAgentChat
    {
        private readonly GoogleAI _googleAI;
        private GenerativeModel _model;
        private readonly GenerationConfig _generationConfiq;

        public InterviewerAgentChat(GoogleAI googleAI, GenerationConfig generationConfig)
        {
            _googleAI = googleAI;
            _generationConfiq = generationConfig;

            _model = _googleAI.GenerativeModel(model: Model.Gemini25Flash);
        }

        private readonly static Content InterviewerAgentSysPrompt = new Content(File.ReadAllText(
             Path.Combine(AppContext.BaseDirectory, "Resources", "InterviewerAgentSysPrompt.txt")
        )); 

        public async Task<string?> Chat(Guid inventoryId, object? messagesContext)
        {
            string prompt = CreateFormatedPrompt(messagesContext, inventoryId);

            var request = new GenerateContentRequest(prompt, generationConfig: _generationConfiq, systemInstruction: InterviewerAgentSysPrompt);

            var response = await _model.GenerateContent(request);

            return response.Text;
        }

        private string CreateFormatedPrompt(object? messagesContext, Guid userId) 
        {
            string messagesContextAsString = "There is no previous context yet";

            if (messagesContext is not null)
                messagesContextAsString = "The Chat Context:" + JsonSerializer.Serialize(messagesContext);

            string prompt = $"The UserId={userId},{messagesContextAsString}";

            return prompt;
        }
    }
}
