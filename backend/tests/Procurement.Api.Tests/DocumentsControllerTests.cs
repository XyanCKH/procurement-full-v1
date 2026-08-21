using Microsoft.AspNetCore.Mvc.Testing;
using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using Xunit;

namespace Procurement.Api.Tests
{
    public class DocumentsControllerTests : IClassFixture<WebApplicationFactory<Program>>
    {
        private readonly WebApplicationFactory<Program> _factory;

        public DocumentsControllerTests(WebApplicationFactory<Program> factory)
        {
            _factory = factory;
        }

        [Fact]
        public async Task UploadDocument_ValidDocx_ReturnsCreatedWithCleanStatus()
        {
            var client = _factory.CreateClient();
            using var formData = new MultipartFormDataContent();

            // Simulate valid DOCX (PK ZIP magic bytes: 50 4B 03 04 followed by dummy bytes)
            byte[] fileBytes = new byte[] { 0x50, 0x4B, 0x03, 0x04, 0x0A, 0x00, 0x00, 0x00, 0x00, 0x00 };
            var fileContent = new ByteArrayContent(fileBytes);
            fileContent.Headers.ContentType = MediaTypeHeaderValue.Parse("application/vnd.openxmlformats-officedocument.wordprocessingml.document");

            formData.Add(fileContent, "file", "BusinessCase.docx");

            var response = await client.PostAsync("/api/v1/procurement/documents/upload", formData);

            Assert.Equal(HttpStatusCode.Created, response.StatusCode);

            var jsonResponse = await response.Content.ReadFromJsonAsync<JsonElement>();
            Assert.True(jsonResponse.TryGetProperty("id", out var idProp));
            Assert.False(string.IsNullOrEmpty(idProp.GetString()));

            Assert.Equal("BusinessCase.docx", jsonResponse.GetProperty("file_name").GetString());
            Assert.Equal("CLEAN", jsonResponse.GetProperty("virus_scan_status").GetString());
            Assert.Equal(fileBytes.Length, jsonResponse.GetProperty("file_size_bytes").GetInt64());
        }

        [Fact]
        public async Task UploadDocument_ExecutableRenamedToPdf_RejectedWithBadRequest()
        {
            var client = _factory.CreateClient();
            using var formData = new MultipartFormDataContent();

            // Simulate executable content (MZ header: 4D 5A) renamed to .pdf
            byte[] fileBytes = new byte[] { 0x4D, 0x5A, 0x90, 0x00, 0x03, 0x00, 0x00, 0x00 };
            var fileContent = new ByteArrayContent(fileBytes);
            fileContent.Headers.ContentType = MediaTypeHeaderValue.Parse("application/pdf");

            formData.Add(fileContent, "file", "malware.pdf");

            var response = await client.PostAsync("/api/v1/procurement/documents/upload", formData);

            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }

        [Fact]
        public async Task DeleteDocument_ExistingDocument_ReturnsNoContent()
        {
            var client = _factory.CreateClient();
            using var formData = new MultipartFormDataContent();

            byte[] fileBytes = new byte[] { 0x25, 0x50, 0x44, 0x46, 0x2D, 0x31, 0x2E, 0x35 }; // %PDF-1.5
            var fileContent = new ByteArrayContent(fileBytes);
            fileContent.Headers.ContentType = MediaTypeHeaderValue.Parse("application/pdf");

            formData.Add(fileContent, "file", "spec.pdf");

            var uploadResponse = await client.PostAsync("/api/v1/procurement/documents/upload", formData);
            Assert.Equal(HttpStatusCode.Created, uploadResponse.StatusCode);

            var jsonResponse = await uploadResponse.Content.ReadFromJsonAsync<JsonElement>();
            string docId = jsonResponse.GetProperty("id").GetString()!;

            var deleteResponse = await client.DeleteAsync($"/api/v1/procurement/documents/{docId}");
            Assert.Equal(HttpStatusCode.NoContent, deleteResponse.StatusCode);

            // Deleting again should return NotFound
            var deleteAgainResponse = await client.DeleteAsync($"/api/v1/procurement/documents/{docId}");
            Assert.Equal(HttpStatusCode.NotFound, deleteAgainResponse.StatusCode);
        }
    }
}
