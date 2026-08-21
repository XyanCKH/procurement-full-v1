using System;
using Procurement.Core.Enums;

namespace Procurement.Core.Entities
{
    public class ProcurementRequest
    {
        public string Id { get; set; } = string.Empty; // varchar 20, PK
        public ProcurementCategory Category { get; set; }
        public string? QueryDetails { get; set; } // nvarchar 1000
        public RequestType RequestType { get; set; }
        public string? PreviousCmtId { get; set; } // varchar 50
        public string Description { get; set; } = string.Empty; // nvarchar 2000
        public bool IsOutsourcing { get; set; }
        public decimal? BudgetAmount { get; set; } // decimal 15,2
        public bool IsBudgetTbd { get; set; }
        public DateTime TargetEndDate { get; set; } // date
        public string RequesterId { get; set; } = string.Empty; // varchar 50
        public string RequesterName { get; set; } = string.Empty; // nvarchar 150
        public string RequesterDept { get; set; } = string.Empty; // nvarchar 100
        public string RequesterContact { get; set; } = string.Empty; // varchar 50
        public bool IsItRelated { get; set; }
        public string? ItUserId { get; set; } // varchar 50
        public string? ItUserName { get; set; } // nvarchar 150
        public string? ItUserDept { get; set; } // nvarchar 100
        public string? ItUserContact { get; set; } // varchar 50
        public bool IsVendorRegistered { get; set; }
        public string? VendorId { get; set; } // varchar 50
        public string VendorName { get; set; } = string.Empty; // nvarchar 200
        public string? VendorRegNo { get; set; } // varchar 50
        public string? VendorContactPerson { get; set; } // nvarchar 150
        public string? VendorEmail { get; set; } // nvarchar 150
        public string? VendorPhone { get; set; } // varchar 50
        public string? VendorHp { get; set; } // varchar 50
        public WorkflowStatus Status { get; set; } = WorkflowStatus.DRAFT;
        public string? PendingActionBy { get; set; } // varchar 100
        public bool DeclarationConfirmed { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
