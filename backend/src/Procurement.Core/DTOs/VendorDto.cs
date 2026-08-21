namespace Procurement.Core.DTOs
{
    public class VendorDto
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string RegNo { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string ContactPerson { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Hp { get; set; } = string.Empty;
    }

    public class DuplicateCheckRequestDto
    {
        public string Name { get; set; } = string.Empty;
        public string RegNo { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
    }

    public class DuplicateCheckResponseDto
    {
        public bool IsDuplicate { get; set; }
        public VendorDto? MatchedVendor { get; set; }
        public string? MatchReason { get; set; }
    }
}
