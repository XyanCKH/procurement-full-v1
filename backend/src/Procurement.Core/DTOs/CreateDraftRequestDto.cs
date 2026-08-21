using Procurement.Core.Enums;

namespace Procurement.Core.DTOs
{
    public class CreateDraftRequestDto
    {
        public ProcurementCategory Category { get; set; } = ProcurementCategory.SOURCING_ONLY;
        public string? QueryDetails { get; set; }
        public RequestType RequestType { get; set; } = RequestType.NEW;
        public string? PreviousCmtId { get; set; }
        public string Description { get; set; } = string.Empty;
        public bool IsOutsourcing { get; set; }
        public decimal? BudgetAmount { get; set; }
        public bool IsBudgetTbd { get; set; }
        public DateTime TargetEndDate { get; set; } = DateTime.UtcNow.AddMonths(3);
        public string RequesterId { get; set; } = string.Empty;
        public string RequesterName { get; set; } = string.Empty;
        public string RequesterDept { get; set; } = string.Empty;
        public string RequesterContact { get; set; } = string.Empty;
        public bool IsItRelated { get; set; }
        public string? ItUserId { get; set; }
        public string? ItUserName { get; set; }
        public string? ItUserDept { get; set; }
        public string? ItUserContact { get; set; }
        public bool IsVendorRegistered { get; set; }
        public string? VendorId { get; set; }
        public string VendorName { get; set; } = string.Empty;
        public string? VendorRegNo { get; set; }
        public string? VendorContactPerson { get; set; }
        public string? VendorEmail { get; set; }
        public string? VendorPhone { get; set; }
        public string? VendorHp { get; set; }
        public bool DeclarationConfirmed { get; set; }
    }
}
