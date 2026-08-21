using Microsoft.AspNetCore.Mvc.Testing;
using System.Net;
using System.Net.Http.Json;
using Xunit;
using Procurement.Core.Services;

namespace Procurement.Api.Tests
{
    public class UsersControllerTests : IClassFixture<WebApplicationFactory<Program>>
    {
        private readonly WebApplicationFactory<Program> _factory;

        public UsersControllerTests(WebApplicationFactory<Program> factory)
        {
            _factory = factory;
        }

        [Fact]
        public async Task Search_ReturnsEmployeesList()
        {
            var client = _factory.CreateClient();
            var response = await client.GetAsync("/api/v1/procurement/users/search?q=Ahmad");

            Assert.Equal(HttpStatusCode.OK, response.StatusCode);

            var employees = await response.Content.ReadFromJsonAsync<List<EmployeeDto>>();
            Assert.NotNull(employees);
            Assert.Single(employees!);
            Assert.Equal("Ahmad Zulkarnain", employees[0].Name);
            Assert.Equal("Information Technology", employees[0].Department);
        }

        [Fact]
        public async Task Search_WithoutQuery_ReturnsAllEmployees()
        {
            var client = _factory.CreateClient();
            var response = await client.GetAsync("/api/v1/procurement/users/search");

            Assert.Equal(HttpStatusCode.OK, response.StatusCode);

            var employees = await response.Content.ReadFromJsonAsync<List<EmployeeDto>>();
            Assert.NotNull(employees);
            Assert.True(employees!.Count >= 5);
        }
    }
}
