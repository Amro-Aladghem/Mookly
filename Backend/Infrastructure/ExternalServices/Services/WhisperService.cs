using Infrastructure.ExternalServices.Interfaces;
using System;
using System.Collections.Generic;
using System.Net.Http.Headers;
using System.Reflection.Metadata;
using System.Text;
using System.Text.Json;

namespace Infrastructure.ExternalServices.Services
{
    public class WhisperService : ISpeechToTextService
    {
        private readonly HttpClient _httpClient;

        public WhisperService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<string> ConvertSpeechToText(Stream audio, string fileName, string language = "auto")
        {
            using var content = new MultipartFormDataContent();

            var audioContent = new StreamContent(audio);

            audioContent.Headers.ContentType =
                new MediaTypeHeaderValue("audio/wav");

            content.Add(audioContent, "file", fileName);
            content.Add(new StringContent(language), "language");
            content.Add(new StringContent("json"), "response_format");

            var response = await _httpClient.PostAsync("/inference", content);

            response.EnsureSuccessStatusCode();

            var json = await response.Content.ReadAsStringAsync();
            using var document = JsonDocument.Parse(json);

            return document.RootElement.GetProperty("text").GetString() ?? "";
        }
    }
}
