using System;
using System.Text.Json;
using System.Threading.Tasks;
using Procurement.Core.Entities;
using Procurement.Infrastructure.Data;

namespace Procurement.Infrastructure.Services
{
    public interface IAuditLogService
    {
        Task LogActionAsync(string requestId, string action, string userId, string userName, object? oldValues = null, object? newValues = null);
    }

    public class AuditLogService : IAuditLogService
    {
        private readonly ProcurementDbContext _context;

        public AuditLogService(ProcurementDbContext context)
        {
            _context = context;
        }

        public async Task LogActionAsync(string requestId, string action, string userId, string userName, object? oldValues = null, object? newValues = null)
        {
            var entry = new AuditLogEntry
            {
                RequestId = requestId,
                Action = action,
                UserId = userId,
                UserName = userName,
                OldValues = oldValues != null ? JsonSerializer.Serialize(oldValues) : null,
                NewValues = newValues != null ? JsonSerializer.Serialize(newValues) : null,
                Timestamp = DateTime.UtcNow
            };

            _context.Set<AuditLogEntry>().Add(entry);
            await _context.SaveChangesAsync();
        }
    }
}
