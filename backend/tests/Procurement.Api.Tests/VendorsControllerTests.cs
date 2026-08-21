using Microsoft.AspNetCore.Mvc.Testing;
using System.Net;
using System.Net.Http.Json;
using Xunit;
using Procurement.Core.DTOs;

namespace Procurement.Api.Tests
{
    public class VendorsControllerTests : IClassFixture<WebApplicationFactory<Program>>
    {
        private readonly WebApplicationFactory<Program> _factory;

        public VendorsControllerTests(WebApplicationFactory<Program> factory)
        {
            _factory = factory;
        }

        [Fact]
        public async Task Search_ReturnsMatchingActiveVendors()
        {
            var client = _factory.CreateClient();
            var response = await client.GetAsync("/api/v1/procurement/vendors/search?q=ABC");

            Assert.Equal(HttpStatusCode.OK, response.StatusCode);

            var vendors = await response.Content.ReadFromJsonAsync<List<VendorDto>>();
            Assert.NotNull(vendors);
            Assert.Single(vendors!);
            Assert.Equal("ABC Technology Sdn Bhd", vendors[0].Name);
            Assert.Equal("202001012345", vendors[0].RegNo);
            Assert.Equal("ACTIVE", vendors[0].Status);
            Assert.NotNull(vendors[0].ContactPerson);
            Assert.NotNull(vendors[0].Email);
        }

        [Fact]
        public async Task CheckDuplicate_ExactRegNoMatch_ReturnsDuplicateTrue()
        {
            var client = _factory.CreateClient();
            var request = new DuplicateCheckRequestDto
            {
                Name = "Completely Different Name",
                RegNo = "202001012345",
                Email = "test@different.com"
            };

            var response = await client.PostAsJsonAsync("/api/v1/procurement/vendors/duplicate-check", request);
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);

            var result = await response.Content.ReadFromJsonAsync<DuplicateCheckResponseDto>();
            Assert.NotNull(result);
            Assert.True(result!.IsDuplicate);
            Assert.NotNull(result.MatchedVendor);
            Assert.Equal("V-10001", result.MatchedVendor!.Id);
        }

        [Fact]
        public async Task CheckDuplicate_NameLevenshteinMatch_ReturnsDuplicateTrue()
        {
            var client = _factory.CreateClient();
            var request = new DuplicateCheckRequestDto
            {
                Name = "ABC Technology Sdn Bhd.", // very close similarity (>85%)
                RegNo = "999999999999",
                Email = "info@abctech.com"
            };

            var response = await client.PostAsJsonAsync("/api/v1/procurement/vendors/duplicate-check", request);
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);

            var result = await response.Content.ReadFromJsonAsync<DuplicateCheckResponseDto>();
            Assert.NotNull(result);
            Assert.True(result!.IsDuplicate);
            Assert.NotNull(result.MatchedVendor);
            Assert.Equal("ABC Technology Sdn Bhd", result.MatchedVendor!.Name);
        }

        [Fact]
        public async Task CheckDuplicate_UniqueVendor_ReturnsDuplicateFalse()
        {
            var client = _factory.CreateClient();
            var request = new DuplicateCheckRequestDto
            {
                Name = "Brand New Supplier Corp",
                RegNo = "202301999999",
                Email = "contact@brandnewsupplier.com"
            };

            var response = await client.PostAsJsonAsync("/api/v1/procurement/vendors/duplicate-check", request);
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);

            var result = await response.Content.ReadFromJsonAsync<DuplicateCheckResponseDto>();
            Assert.NotNull(result);
            Assert.False(result!.IsDuplicate);
            Assert.Null(result.MatchedVendor);
        }
    }
}
