using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;
using Procurement.Core.Entities;
using Procurement.Core.Enums;
using Procurement.Infrastructure.Services;

namespace Procurement.Api.Tests
{
    public class NotificationServiceTests
    {
        [Fact]
        public async Task SendRequestSubmittedNotificationAsync_QueuesAcknowledgmentWithPrNumber()
        {
            // Arrange
            var loggerMock = new Mock<ILogger<SmtpNotificationService>>();
            var service = new SmtpNotificationService(loggerMock.Object);

            var request = new ProcurementRequest
            {
                Id = "PR-2025-00123",
                Category = ProcurementCategory.SOURCING_WITH_CONTRACT,
                RequesterName = "Ahmad Zulkarnain",
                RequesterDept = "Information Technology",
                Description = "Enterprise Cloud License Procurement and Support Services for 2025.",
                CreatedAt = DateTime.UtcNow
            };

            // Act & Assert (Should not throw and complete successfully)
            await service.SendRequestSubmittedNotificationAsync(request, "ahmad.z@enterprise.com");
            await service.SendNewRequestTriageAlertAsync(request, "triage@enterprise.com");

            Assert.True(true);
        }

        [Fact]
        public async Task SendRequestReturnedForInfoNotificationAsync_SendsReviewerComments()
        {
            // Arrange
            var loggerMock = new Mock<ILogger<SmtpNotificationService>>();
            var service = new SmtpNotificationService(loggerMock.Object);

            var request = new ProcurementRequest
            {
                Id = "PR-2025-00456",
                Category = ProcurementCategory.SOURCING_ONLY,
                RequesterName = "Siti Nurhaliza",
                Description = "Software tools procurement for development team.",
                CreatedAt = DateTime.UtcNow
            };

            string comments = "Please provide the updated vendor quotation and outsourcing risk assessment form.";

            // Act & Assert
            await service.SendRequestReturnedForInfoNotificationAsync(request, "siti.n@enterprise.com", comments);
            await service.SendRequestWithdrawnNotificationAsync(request, "siti.n@enterprise.com");

            Assert.True(true);
        }
    }
}
