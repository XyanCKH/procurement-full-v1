using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Procurement.Core.DTOs;
using Procurement.Core.Entities;
using Procurement.Core.Enums;
using Procurement.Core.Services;
using Procurement.Core.Validators;
using Procurement.Infrastructure.Data;

namespace Procurement.Api.Controllers
{
    [ApiController]
    [Route("api/v1/procurement/requests")]
    public class ProcurementRequestsController : ControllerBase
    {
        private readonly ProcurementDbContext _context;
        private readonly IRequestIdGenerator _idGenerator;

        public ProcurementRequestsController(ProcurementDbContext context, IRequestIdGenerator idGenerator)
        {
            _context = context;
            _idGenerator = idGenerator;
        }

        [HttpPost]
        public async Task<ActionResult<ProcurementRequestResponseDto>> CreateDraft([FromBody] CreateDraftRequestDto dto)
        {
            var id = await _idGenerator.GenerateIdAsync();

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

        [HttpPost("{id}/submit")]
        public async Task<IActionResult> SubmitRequest(string id)
        {
            var request = await _context.ProcurementRequests.FindAsync(id);
            if (request == null)
            {
                return NotFound(new { message = $"Procurement request {id} not found." });
            }

            var documents = await _context.RequestDocuments
                .Where(d => d.RequestId == id)
                .ToListAsync();

            var validationResult = FinalSubmissionValidator.Validate(request, documents);
            if (!validationResult.IsValid)
            {
                return UnprocessableEntity(new
                {
                    message = "Validation failed for request submission.",
                    errors = validationResult.Errors
                });
            }

            request.Status = WorkflowStatus.SUBMITTED;
            request.PendingActionBy = "PROCUREMENT_TRIAGE_TEAM";
            request.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            // Dispatch domain event or log audit history as required
            return Ok(new
            {
                id = request.Id,
                status = request.Status.ToString(),
                pendingActionBy = request.PendingActionBy,
                updatedAt = request.UpdatedAt,
                message = "Request submitted successfully."
            });
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
