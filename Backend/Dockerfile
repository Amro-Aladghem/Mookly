FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build

WORKDIR /src 

COPY . . 

RUN dotnet publish MooklyApi/MooklyApi.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:10.0

WORKDIR /app

COPY --from=build /app/publish .

ENV ASPNETCORE_ENVIRONMENT=Production
ENV ASPNETCORE_HTTP_PORTS=5141
ENV Whisper__Uri =http://localhost
ENV Whisper__Port=8081
ENV Whisper__TimeOut = 3
ENV Piper__Uri =http://localhost
ENV Piper__Port=8081
ENV Piper__TimeOut = 3
ENV aiRetryCount=2



EXPOSE 5141

CMD ["dotnet","MooklyApi.dll"]
 