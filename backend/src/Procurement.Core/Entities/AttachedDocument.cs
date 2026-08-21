using System;

namespace Procurement.Core.Entities
{
    public class AttachedDocument
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string FileName { get; set; } = string.Empty;
        public string FileUrl { get; set; } = string.Empty;
        public long FileSizeBytes { get; set; }
        public string MimeType { get; set; } = string.Empty;
        public string VirusScanStatus { get; set; } = "CLEAN";
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
