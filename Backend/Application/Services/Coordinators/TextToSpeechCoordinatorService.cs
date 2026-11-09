using Infrastructure.ExternalServices;
using Infrastructure.ExternalServices.Interfaces;
using System;
using System.Collections.Generic;
using System.IO.Enumeration;
using System.Text;

namespace Application.Services.Coordinators
{
    public class TextToSpeechCoordinatorService
    {
        private readonly BlobStorageUploadService _blobStorageUploadService;
        private readonly ITextToSpeechService _textToSpeechService;

        private const string audioDefaultFileName = "Agent_Audio";
        private const string audioDefaultType = "audio/wav";

        public TextToSpeechCoordinatorService(BlobStorageUploadService blobStorageUploadService, ITextToSpeechService textToSpeechService)
        {
            _blobStorageUploadService = blobStorageUploadService;
            _textToSpeechService = textToSpeechService;
        }
        public async Task<string> HandleConvertTextToSpeechAndUpload(string text)
        {
            try
            {
                byte[] audioBytes = await _textToSpeechService.ConvertTextToSpeech(text);

                using Stream audioStream = new MemoryStream(audioBytes);

                string Uri = await _blobStorageUploadService.UploadSpecificTypeAsync(audioStream, audioDefaultFileName, audioDefaultType);

                return Uri;
            }
            catch
            {
                throw new Exception($"Failed to convert text to speech using service: {this.GetType().Name}");
            }
        }
    }
}
