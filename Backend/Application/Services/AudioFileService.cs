using FFMpegCore;
using FFMpegCore.Enums;
using FFMpegCore.Pipes;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Services
{
    public class AudioFileService
    {
        public async Task<Stream> ConvertToWav(Stream audio)
        {
            using var output = new MemoryStream();

            await FFMpegArguments
                .FromPipeInput(new StreamPipeSource(audio))
                .OutputToPipe(
                    new StreamPipeSink(output),
                    options => options
                        .ForceFormat("wav")
                        .WithAudioCodec(AudioCodec.PcmS16Le)
                        .WithAudioSamplingRate(16000)
                        .WithAudioChannels(1))
                .ProcessAsynchronously();

            output.Position = 0;

            return output;
        }
    }
}
