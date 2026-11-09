using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;

namespace Infrastructure.ExternalServices
{
    public class BlobStorageUploadService
    {
        private readonly IConfiguration _configuration;
        public BlobStorageUploadService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public bool CheckIfFileTypeIsPdf(string ContentType, string FileName)
        {
            var extension = Path.GetExtension(FileName).ToLowerInvariant();
            if (extension != ".pdf")
            {
                return false;
            }

            if (ContentType != "application/pdf")
            {
                return false;
            }

            return true;
        }

        public async Task<string> UploadSpecificTypeAsync(Stream stream, string fileName, string contentType)
        {
            Guid id = Guid.NewGuid();

            BlobClient blobClient = GetBlobClient($"{id}_{Guid.NewGuid()}_{fileName}");

            var blobHttpHeader = new BlobHttpHeaders
            {
                ContentType = contentType
            };

            await blobClient.UploadAsync(stream, new BlobUploadOptions
            {
                HttpHeaders = blobHttpHeader
            });


            return FilterFileUrl(blobClient.Uri.ToString());
        }

        private string FilterFileUrl(string FileUrl)
        {
            string? FileCdn = _configuration.GetSection("File_Cdn").Value;
            string? FileHost = _configuration.GetSection("File_Host").Value;

            if (FileCdn is null || FileHost is null)
                throw new Exception("File_Cnd or File_Host Env is not exist");

            return FileUrl.Replace(FileHost, FileCdn);
        }

        public async Task<string> UploadAsync(Stream stream, string fileName, Guid Id)
        {

            BlobClient blobClient = GetBlobClient($"{Id}_{Guid.NewGuid()}_{fileName}");

            await blobClient.UploadAsync(stream);

            return FilterFileUrl(blobClient.Uri.ToString());

        }

        private BlobClient GetBlobClient(string fileName)
        {
            string? connectionString = _configuration.GetSection("blobconnectionstring").Value;
            string? containerName = _configuration.GetSection("File_Container").Value;

            if (connectionString is null || containerName is null)
                throw new Exception("blobconnectionstring or File_Container not exist");

            var blobServiceClient = new BlobServiceClient(connectionString);
            var containerClient = blobServiceClient.GetBlobContainerClient(containerName);

            return containerClient.GetBlobClient(fileName);
        }

    }
}
