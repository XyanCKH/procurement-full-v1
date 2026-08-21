namespace Procurement.Core.Entities
{
    public class VendorRecord
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string RegNo { get; set; } = string.Empty;
        public string Status { get; set; } = "ACTIVE"; // ACTIVE, INACTIVE, BLACKLISTED
        public string ContactPerson { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Hp { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
