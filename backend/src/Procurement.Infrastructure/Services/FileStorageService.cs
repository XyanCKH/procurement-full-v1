using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace Procurement.Infrastructure.Services
{
    public interface IFileStorageService
    {
        Task<string> SaveFileAsync(IFormFile file, string documentId);
        Task DeleteFileAsync(string fileUrl);
        Task<Stream?> GetFileStreamAsync(string fileUrl);
    }

    public class FileStorageService : IFileStorageService
    {
        private readonly string _storageDirectory;

        public FileStorageService()
        {
            _storageDirectory = Path.Combine(Path.GetTempPath(), "ProcurementStorage");
            Directory.CreateDirectory(_storageDirectory);
        }

        public async Task<string> SaveFileAsync(IFormFile file, string documentId)
        {
            var extension = Path.GetExtension(file.FileName);
            var uniqueFileName = $"{documentId}_{Guid.NewGuid()}{extension}";
            var filePath = Path.Combine(_storageDirectory, uniqueFileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return filePath;
        }

        public Task DeleteFileAsync(string fileUrl)
        {
            if (!string.IsNullOrEmpty(fileUrl) && File.Exists(fileUrl))
            {
                File.Delete(fileUrl);
            }
            return Task.CompletedTask;
        }

        public Task<Stream?> GetFileStreamAsync(string fileUrl)
        {
            if (!string.IsNullOrEmpty(fileUrl) && File.Exists(fileUrl))
            {
                Stream stream = new FileStream(fileUrl, FileMode.Open, FileAccess.Read);
                return Task.FromResult<Stream?>(stream);
            }
            return Task.FromResult<Stream?>(null);
        }
    }
}
