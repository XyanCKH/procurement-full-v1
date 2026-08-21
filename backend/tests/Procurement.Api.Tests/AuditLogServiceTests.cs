using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Procurement.Core.Entities;
using Procurement.Infrastructure.Data;
using Procurement.Infrastructure.Services;
using Xunit;

namespace Procurement.Api.Tests
{
    public class AuditLogServiceTests
    {
        private ProcurementDbContext GetInMemoryDbContext()
        {
            var options = new DbContextOptionsBuilder<ProcurementDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            return new ProcurementDbContext(options);
        }

        [Fact]
        public async Task LogActionAsync_CreatesAndPersistsAuditLogEntry()
        {
            // Arrange
            using var context = GetInMemoryDbContext();
            var auditService = new AuditLogService(context);

            var requestId = "PR-2025-00001";
            var action = "SUBMITTED";
            var userId = "EMP001";
            var userName = "Ahmad Ali";
            var oldValues = new { status = "DRAFT" };
            var newValues = new { status = "SUBMITTED" };

            // Act
            await auditService.LogActionAsync(requestId, action, userId, userName, oldValues, newValues);

            // Assert
            var entry = await context.Set<AuditLogEntry>().FirstOrDefaultAsync();
            Assert.NotNull(entry);
            Assert.Equal(requestId, entry.RequestId);
            Assert.Equal(action, entry.Action);
            Assert.Equal(userId, entry.UserId);
            Assert.Equal(userName, entry.UserName);
            Assert.Contains("DRAFT", entry.OldValues);
            Assert.Contains("SUBMITTED", entry.NewValues);
            Assert.True(entry.Timestamp <= DateTime.UtcNow);
        }
    }
}
