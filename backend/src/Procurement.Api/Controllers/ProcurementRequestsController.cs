using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Procurement.Core.DTOs;
using Procurement.Core.Entities;
using Procurement.Core.Enums;
using Procurement.Infrastructure.Data;

namespace Procurement.Api.Controllers
{
    [ApiController]
    [Route("api/v1/procurement/requests")]
    public class ProcurementRequestsController : ControllerBase
    {
        private readonly ProcurementDbContext _context;

        public ProcurementRequestsController(ProcurementDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<ActionResult<ProcurementRequestResponseDto>> CreateDraft([FromBody] CreateDraftRequestDto dto)
        {
            var year = DateTime.UtcNow.Year;
            // Generate ID e.g. PR-2025-00001
            var count = await _context.ProcurementRequests.CountAsync(r => r.Id.StartsWith($"PR-{year}-")) + 1;
            var id = $"PR-{year}-{count:D5}";

            var request = new ProcurementRequest
            {
                Id = id,
                Category = dto.Category,
                QueryDetails = dto.QueryDetails,
                RequestType = dto.RequestType,
                PreviousCmtId = dto.PreviousCmtId,
                Description = dto.Description,
                IsOutsourcing = dto.IsOutsourcing,
                BudgetAmount = dto.BudgetAmount,
                IsBudgetTbd = dto.IsBudgetTbd,
                TargetEndDate = dto.TargetEndDate,
                RequesterId = dto.RequesterId,
                RequesterName = dto.RequesterName,
                RequesterDept = dto.RequesterDept,
                RequesterContact = dto.RequesterContact,
                IsItRelated = dto.IsItRelated,
                ItUserId = dto.ItUserId,
                ItUserName = dto.ItUserName,
                ItUserDept = dto.ItUserDept,
                ItUserContact = dto.ItUserContact,
                IsVendorRegistered = dto.IsVendorRegistered,
                VendorId = dto.VendorId,
                VendorName = dto.VendorName,
                VendorRegNo = dto.VendorRegNo,
                VendorContactPerson = dto.VendorContactPerson,
                VendorEmail = dto.VendorEmail,
                VendorPhone = dto.VendorPhone,
                VendorHp = dto.VendorHp,
                Status = WorkflowStatus.DRAFT,
                DeclarationConfirmed = dto.DeclarationConfirmed,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.ProcurementRequests.Add(request);
            await _context.SaveChangesAsync();

            var responseDto = ProcurementRequestResponseDto.FromEntity(request);
            return CreatedAtAction(nameof(GetById), new { id = request.Id }, responseDto);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProcurementRequestResponseDto>> GetById(string id)
        {
            var request = await _context.ProcurementRequests.FindAsync(id);
            if (request == null)
            {
                return NotFound();
            }

            return Ok(ProcurementRequestResponseDto.FromEntity(request));
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ProcurementRequestResponseDto>> UpdateDraft(string id, [FromBody] CreateDraftRequestDto dto)
        {
            var request = await _context.ProcurementRequests.FindAsync(id);
            if (request == null)
            {
                return NotFound();
            }

            request.Category = dto.Category;
            request.QueryDetails = dto.QueryDetails;
            request.RequestType = dto.RequestType;
            request.PreviousCmtId = dto.PreviousCmtId;
            request.Description = dto.Description;
            request.IsOutsourcing = dto.IsOutsourcing;
            request.BudgetAmount = dto.BudgetAmount;
            request.IsBudgetTbd = dto.IsBudgetTbd;
            request.TargetEndDate = dto.TargetEndDate;
            request.RequesterId = dto.RequesterId;
            request.RequesterName = dto.RequesterName;
            request.RequesterDept = dto.RequesterDept;
            request.RequesterContact = dto.RequesterContact;
            request.IsItRelated = dto.IsItRelated;
            request.ItUserId = dto.ItUserId;
            request.ItUserName = dto.ItUserName;
            request.ItUserDept = dto.ItUserDept;
            request.ItUserContact = dto.ItUserContact;
            request.IsVendorRegistered = dto.IsVendorRegistered;
            request.VendorId = dto.VendorId;
            request.VendorName = dto.VendorName;
            request.VendorRegNo = dto.VendorRegNo;
            request.VendorContactPerson = dto.VendorContactPerson;
            request.VendorEmail = dto.VendorEmail;
            request.VendorPhone = dto.VendorPhone;
            request.VendorHp = dto.VendorHp;
            request.DeclarationConfirmed = dto.DeclarationConfirmed;
            request.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(ProcurementRequestResponseDto.FromEntity(request));
        }
    }
}
