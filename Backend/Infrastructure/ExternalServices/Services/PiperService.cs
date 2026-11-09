using Infrastructure.ExternalServices.Interfaces;
using System;
using System.Collections.Generic;
using System.Net.Http.Json;
using System.Runtime.CompilerServices;
using System.Text;
using static System.Net.Mime.MediaTypeNames;

namespace Infrastructure.ExternalServices.Services
{
    public class PiperService : ITextToSpeechService
    {
        private readonly HttpClient _httpClient;
        public PiperService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<byte[]> ConvertTextToSpeech(string text)
        {

            var response = await _httpClient.PostAsJsonAsync("/synthesize", new { text });

            response.EnsureSuccessStatusCode();

            return await response.Content.ReadAsByteArrayAsync();
        }
    }
}
