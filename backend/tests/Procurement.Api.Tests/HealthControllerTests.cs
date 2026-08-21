using Microsoft.AspNetCore.Mvc.Testing;
using System.Net;
using System.Text.Json;
using Xunit;

namespace Procurement.Api.Tests
{
    public class HealthControllerTests : IClassFixture<WebApplicationFactory<Program>>
    {
        private readonly WebApplicationFactory<Program> _factory;

        public HealthControllerTests(WebApplicationFactory<Program> factory)
        {
            _factory = factory;
        }

        [Fact]
        public async Task Get_ReturnsHealthyStatus()
        {
            // Arrange
            var client = _factory.CreateClient();

            // Act
            var response = await client.GetAsync("/api/v1/health");

            // Assert
            response.EnsureSuccessStatusCode(); // Status Code 200-299
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);

            var jsonString = await response.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(jsonString);
            var root = doc.RootElement;

            Assert.Equal("Healthy", root.GetProperty("status").GetString());
            Assert.Equal("ProcurementApi", root.GetProperty("service").GetString());
            Assert.Equal("1.0.0", root.GetProperty("version").GetString());
        }
    }
}
