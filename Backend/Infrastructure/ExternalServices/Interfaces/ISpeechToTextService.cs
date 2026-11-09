using System;
using System.Collections.Generic;
using System.Text;

namespace Infrastructure.ExternalServices.Interfaces
{
    public interface ISpeechToTextService
    {
        public Task<string> ConvertSpeechToText(Stream audio, string fileName, string language = "auto");
    }
}
