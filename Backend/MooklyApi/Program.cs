using Infrastructure.ExternalServices.Interfaces;
using Infrastructure.ExternalServices.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddScoped<ISpeechToTextService, WhisperService>();
builder.Services.AddScoped<ITextToSpeechService,PiperService>();

builder.Services.AddHttpClient<WhisperService>(client =>
{
    client.BaseAddress = new Uri($"{builder.Configuration["Whisper:Uri"]}:{builder.Configuration["Whisper:Port"]}");
    client.Timeout = TimeSpan.FromMinutes(builder.Configuration.GetValue<int>("Whisper:TimeOut"));
});

builder.Services.AddHttpClient<PiperService>(client =>
{
    client.BaseAddress = new Uri($"{builder.Configuration["Piper:Uri"]}:{builder.Configuration["Piper:Port"]}");
    client.Timeout = TimeSpan.FromMinutes(builder.Configuration.GetValue<int>("Piper:TimeOut"));
});

var app = builder.Build();

//app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
