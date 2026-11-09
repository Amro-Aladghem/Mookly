using System;
using System.Collections.Generic;
using System.Text;

namespace Infrastructure.ExternalServices.Interfaces
{
    public interface ITextToSpeechService
    {
        public Task<byte[]> ConvertTextToSpeech(string Text);
    }
}
