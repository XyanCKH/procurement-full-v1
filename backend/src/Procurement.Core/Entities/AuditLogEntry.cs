using System;

namespace Procurement.Core.Entities
{
    public class AuditLogEntry
    {
        public int Id { get; set; }
        public string RequestId { get; set; } = string.Empty;
        public string Action { get; set; } = string.Empty; // CREATED, DRAFT_SAVED, SUBMITTED, RETURNED_FOR_INFO, WITHDRAWN
        public string UserId { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public string? OldValues { get; set; } // JSON
        public string? NewValues { get; set; } // JSON
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }
}
