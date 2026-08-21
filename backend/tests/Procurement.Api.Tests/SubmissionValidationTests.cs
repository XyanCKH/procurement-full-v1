using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using Xunit;
using Procurement.Core.Entities;
using Procurement.Core.Enums;
using Procurement.Infrastructure.Data;

namespace Procurement.Api.Tests
{
    public class SubmissionValidationTests : IClassFixture<WebApplicationFactory<Program>>
    {
        private readonly WebApplicationFactory<Program> _factory;

        public SubmissionValidationTests(WebApplicationFactory<Program> factory)
        {
            _factory = factory;
        }

        private ProcurementDbContext GetDbContext()
        {
            var scope = _factory.Services.CreateScope();
            return scope.ServiceProvider.GetRequiredService<ProcurementDbContext>();
        }

        [Fact]
        public async Task GivenValidDraftRequest_WhenSubmitIsCalled_ThenTransitionsToSubmittedAndReturns200()
        {
            var client = _factory.CreateClient();
            var db = GetDbContext();

            var requestId = $"PR-{DateTime.UtcNow.Year}-999999";
            var request = new ProcurementRequest
            {
                Id = requestId,
                Category = ProcurementCategory.SOURCING_ONLY,
                RequestType = RequestType.NEW,
                Description = "This is a valid test procurement request description with more than 20 characters.",
                IsOutsourcing = false,
                BudgetAmount = 10000.00m,
                IsBudgetTbd = false,
                TargetEndDate = DateTime.UtcNow.AddDays(10),
                RequesterId = "EMP001",
                RequesterName = "John Doe",
                RequesterDept = "IT",
                RequesterContact = "12345678",
                VendorName = "Test Vendor",
                Status = WorkflowStatus.DRAFT,
                DeclarationConfirmed = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            db.ProcurementRequests.Add(request);
            db.RequestDocuments.Add(new RequestDocument
            {
                RequestId = requestId,
                DocumentType = "BUSINESS_CASE",
                FileName = "business_case.pdf",
                VirusScanStatus = "CLEAN"
            });
            await db.SaveChangesAsync();

            var response = await client.PostAsync($"/api/v1/procurement/requests/{requestId}/submit", null);
            Assert.True(response.IsSuccessStatusCode);

            var updatedReq = await db.ProcurementRequests.FindAsync(requestId);
            Assert.NotNull(updatedReq);
            Assert.Equal(WorkflowStatus.SUBMITTED, updatedReq.Status);
            Assert.Equal("PROCUREMENT_TRIAGE_TEAM", updatedReq.PendingActionBy);
        }

        [Fact]
        public async Task GivenDraftMissingBusinessCase_WhenSubmitIsCalled_ThenReturns422UnprocessableEntity()
        {
            var client = _factory.CreateClient();
            var db = GetDbContext();

            var requestId = $"PR-{DateTime.UtcNow.Year}-999998";
            var request = new ProcurementRequest
            {
                Id = requestId,
                Category = ProcurementCategory.SOURCING_ONLY,
                RequestType = RequestType.NEW,
                Description = "This is a valid test procurement request description with more than 20 characters.",
                IsOutsourcing = false,
                BudgetAmount = 10000.00m,
                IsBudgetTbd = false,
                TargetEndDate = DateTime.UtcNow.AddDays(10),
                RequesterId = "EMP001",
                RequesterName = "John Doe",
                RequesterDept = "IT",
                RequesterContact = "12345678",
                VendorName = "Test Vendor",
                Status = WorkflowStatus.DRAFT,
                DeclarationConfirmed = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            db.ProcurementRequests.Add(request);
            await db.SaveChangesAsync();

            var response = await client.PostAsync($"/api/v1/procurement/requests/{requestId}/submit", null);
            Assert.Equal(System.Net.HttpStatusCode.UnprocessableEntity, response.StatusCode);
        }
    }
}
