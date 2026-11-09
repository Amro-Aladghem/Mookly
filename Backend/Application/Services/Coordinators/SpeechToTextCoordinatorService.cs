using Infrastructure.ExternalServices.Interfaces;


namespace Application.Services.Coordinators
{
    public class SpeechToTextCoordinatorService
    {
        private readonly ISpeechToTextService _speechToTextService;
        private readonly AudioFileService _audioFileService;

        public SpeechToTextCoordinatorService(ISpeechToTextService speechToTextService,AudioFileService audioFileService)
        {
            _speechToTextService = speechToTextService;
            _audioFileService  = audioFileService;
        }

        public async Task<string> GetTextFromSpeechAfterProcessing(Stream audio,string fileName)
        {
            try
            {

                Stream convertedAudio = await _audioFileService.ConvertToWav(audio);

                return await _speechToTextService.ConvertSpeechToText(convertedAudio, fileName);
            }
            catch
            {
                throw new Exception($"Failed to convert speech to text at {this.GetType().Name}");
            }
        }
    }
}
