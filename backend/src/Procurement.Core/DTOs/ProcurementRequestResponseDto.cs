using Procurement.Core.Enums;
using Procurement.Core.Entities;

namespace Procurement.Core.DTOs
{
    public class ProcurementRequestResponseDto
    {
        public string Id { get; set; } = string.Empty;
        public ProcurementCategory Category { get; set; }
        public string? QueryDetails { get; set; }
        public RequestType RequestType { get; set; }
        public string? PreviousCmtId { get; set; }
        public string Description { get; set; } = string.Empty;
        public bool IsOutsourcing { get; set; }
        public decimal? BudgetAmount { get; set; }
        public bool IsBudgetTbd { get; set; }
        public DateTime TargetEndDate { get; set; }
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
        public WorkflowStatus Status { get; set; }
        public string? PendingActionBy { get; set; }
        public bool DeclarationConfirmed { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        public static ProcurementRequestResponseDto FromEntity(ProcurementRequest entity)
        {
            return new ProcurementRequestResponseDto
            {
                Id = entity.Id,
                Category = entity.Category,
                QueryDetails = entity.QueryDetails,
                RequestType = entity.RequestType,
                PreviousCmtId = entity.PreviousCmtId,
                Description = entity.Description,
                IsOutsourcing = entity.IsOutsourcing,
                BudgetAmount = entity.BudgetAmount,
                IsBudgetTbd = entity.IsBudgetTbd,
                TargetEndDate = entity.TargetEndDate,
                RequesterId = entity.RequesterId,
                RequesterName = entity.RequesterName,
                RequesterDept = entity.RequesterDept,
                RequesterContact = entity.RequesterContact,
                IsItRelated = entity.IsItRelated,
                ItUserId = entity.ItUserId,
                ItUserName = entity.ItUserName,
                ItUserDept = entity.ItUserDept,
                ItUserContact = entity.ItUserContact,
                IsVendorRegistered = entity.IsVendorRegistered,
                VendorId = entity.VendorId,
                VendorName = entity.VendorName,
                VendorRegNo = entity.VendorRegNo,
                VendorContactPerson = entity.VendorContactPerson,
                VendorEmail = entity.VendorEmail,
                VendorPhone = entity.VendorPhone,
                VendorHp = entity.VendorHp,
                Status = entity.Status,
                PendingActionBy = entity.PendingActionBy,
                DeclarationConfirmed = entity.DeclarationConfirmed,
                CreatedAt = entity.CreatedAt,
                UpdatedAt = entity.UpdatedAt
            };
        }
    }
}

namespace Procurement.Core.DTOs
{
    public class ProcurementRequestSummaryDto
    {
        public string Id { get; set; } = string.Empty;
        public ProcurementCategory Category { get; set; }
        public RequestType RequestType { get; set; }
        public string Description { get; set; } = string.Empty;
        public decimal? BudgetAmount { get; set; }
        public bool IsBudgetTbd { get; set; }
        public DateTime TargetEndDate { get; set; }
        public string RequesterId { get; set; } = string.Empty;
        public string RequesterName { get; set; } = string.Empty;
        public string RequesterDept { get; set; } = string.Empty;
        public string VendorName { get; set; } = string.Empty;
        public WorkflowStatus Status { get; set; }
        public string? PendingActionBy { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
