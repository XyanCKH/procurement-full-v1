using Microsoft.AspNetCore.Mvc.Testing;
using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using Xunit;
using Procurement.Core.DTOs;
using Procurement.Core.Enums;

namespace Procurement.Api.Tests
{
    public class ProcurementRequestsControllerTests : IClassFixture<WebApplicationFactory<Program>>
    {
        private readonly WebApplicationFactory<Program> _factory;

        public ProcurementRequestsControllerTests(WebApplicationFactory<Program> factory)
        {
            _factory = factory;
        }

        [Fact]
        public async Task CreateDraft_ReturnsCreatedWithGeneratedId()
        {
            var client = _factory.CreateClient();
            var dto = new CreateDraftRequestDto
            {
                Category = ProcurementCategory.SOURCING_ONLY,
                Description = "Cloud infrastructure software licensing renewal and expansion.",
                RequesterId = "EMP12345",
                RequesterName = "Jane Doe",
                RequesterDept = "Information Technology",
                RequesterContact = "+60322334455",
                VendorName = "Cloud Tech Sdn Bhd",
                TargetEndDate = DateTime.UtcNow.AddMonths(6),
                DeclarationConfirmed = true
            };

            var response = await client.PostAsJsonAsync("/api/v1/procurement/requests", dto);

            Assert.Equal(HttpStatusCode.Created, response.StatusCode);

            var createdDto = await response.Content.ReadFromJsonAsync<ProcurementRequestResponseDto>();
            Assert.NotNull(createdDto);
            Assert.StartsWith("PR-", createdDto!.Id);
            Assert.Equal(WorkflowStatus.DRAFT, createdDto.Status);
            Assert.Equal("Jane Doe", createdDto.RequesterName);
            Assert.Equal("Cloud Tech Sdn Bhd", createdDto.VendorName);
        }

        [Fact]
        public async Task GetById_ReturnsCompleteRequestDto()
        {
            var client = _factory.CreateClient();
            var dto = new CreateDraftRequestDto
            {
                Category = ProcurementCategory.SOURCING_WITH_CONTRACT,
                Description = "Cybersecurity audit consulting services.",
                RequesterId = "EMP98765",
                RequesterName = "John Smith",
                RequesterDept = "Risk & Compliance",
                RequesterContact = "+60355667788",
                VendorName = "SecureNet Global",
                TargetEndDate = DateTime.UtcNow.AddMonths(3),
                DeclarationConfirmed = true
            };

            var postResponse = await client.PostAsJsonAsync("/api/v1/procurement/requests", dto);
            var createdDto = await postResponse.Content.ReadFromJsonAsync<ProcurementRequestResponseDto>();
            Assert.NotNull(createdDto);

            var getResponse = await client.GetAsync($"/api/v1/procurement/requests/{createdDto!.Id}");
            Assert.Equal(HttpStatusCode.OK, getResponse.StatusCode);

            var fetchedDto = await getResponse.Content.ReadFromJsonAsync<ProcurementRequestResponseDto>();
            Assert.NotNull(fetchedDto);
            Assert.Equal(createdDto.Id, fetchedDto!.Id);
            Assert.Equal("Cybersecurity audit consulting services.", fetchedDto.Description);
            Assert.Equal("Risk & Compliance", fetchedDto.RequesterDept);
        }

        [Fact]
        public async Task UpdateDraft_UpdatesExistingDraftFields()
        {
            var client = _factory.CreateClient();
            var dto = new CreateDraftRequestDto
            {
                Category = ProcurementCategory.CONTRACT_ONLY,
                Description = "Initial description",
                RequesterId = "EMP11111",
                RequesterName = "Alice",
                RequesterDept = "Finance",
                RequesterContact = "+60311112222",
                VendorName = "Vendor A",
                TargetEndDate = DateTime.UtcNow.AddMonths(1),
                DeclarationConfirmed = true
            };

            var postResponse = await client.PostAsJsonAsync("/api/v1/procurement/requests", dto);
            var createdDto = await postResponse.Content.ReadFromJsonAsync<ProcurementRequestResponseDto>();
            Assert.NotNull(createdDto);

            dto.Description = "Updated description for contract renewal";
            dto.BudgetAmount = 50000.00m;

            var putResponse = await client.PutAsJsonAsync($"/api/v1/procurement/requests/{createdDto!.Id}", dto);
            Assert.Equal(HttpStatusCode.OK, putResponse.StatusCode);

            var updatedDto = await putResponse.Content.ReadFromJsonAsync<ProcurementRequestResponseDto>();
            Assert.NotNull(updatedDto);
            Assert.Equal("Updated description for contract renewal", updatedDto!.Description);
            Assert.Equal(50000.00m, updatedDto.BudgetAmount);
        }
    }
}
