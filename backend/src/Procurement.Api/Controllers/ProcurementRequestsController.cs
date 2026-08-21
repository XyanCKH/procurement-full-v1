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
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Procurement.Core.DTOs;
using Procurement.Core.Entities;
using Procurement.Core.Enums;
using Procurement.Core.Services;
using Procurement.Core.Validators;
using Procurement.Infrastructure.Data;
using Procurement.Infrastructure.Services;

namespace Procurement.Api.Controllers
{
    [ApiController]
    [Route("api/v1/procurement/requests")]
    public class ProcurementRequestsController : ControllerBase
    {
        private readonly ProcurementDbContext _context;
        private readonly IRequestIdGenerator _idGenerator;
        private readonly IAuditLogService _auditLogService;

        public ProcurementRequestsController(ProcurementDbContext context, IRequestIdGenerator idGenerator, IAuditLogService auditLogService)
        {
            _context = context;
            _idGenerator = idGenerator;
            _auditLogService = auditLogService;
        }

        [HttpGet]
        public async Task<ActionResult<object>> GetRequests(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] WorkflowStatus? status = null,
            [FromQuery] ProcurementCategory? category = null,
            [FromQuery] string? search = null,
            [FromQuery] string? sortBy = "createdAt")
        {
            if (page < 1) page = 1;
            if (pageSize < 1) pageSize = 10;
            if (pageSize > 100) pageSize = 100;

            var query = _context.ProcurementRequests.AsQueryable();

            if (status.HasValue)
            {
                query = query.Where(r => r.Status == status.Value);
            }

            if (category.HasValue)
            {
                query = query.Where(r => r.Category == category.Value);
            }

            if (!string.IsNullOrWhiteSpace(search))
            {
                var lowerSearch = search.ToLower();
                query = query.Where(r => 
                    r.Id.ToLower().Contains(lowerSearch) ||
                    r.Description.ToLower().Contains(lowerSearch) ||
                    r.VendorName.ToLower().Contains(lowerSearch) ||
                    r.RequesterName.ToLower().Contains(lowerSearch));
            }

            // Sorting
            query = sortBy?.ToLower() switch
            {
                "status" => query.OrderBy(r => r.Status),
                "status_desc" => query.OrderByDescending(r => r.Status),
                "category" => query.OrderBy(r => r.Category),
                "category_desc" => query.OrderByDescending(r => r.Category),
                "budget" => query.OrderBy(r => r.BudgetAmount),
                "budget_desc" => query.OrderByDescending(r => r.BudgetAmount),
                "updatedat" => query.OrderByDescending(r => r.UpdatedAt),
                "createdat_asc" => query.OrderBy(r => r.CreatedAt),
                _ => query.OrderByDescending(r => r.CreatedAt)
            };

            var totalCount = await query.CountAsync();
            var items = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(r => new ProcurementRequestSummaryDto
                {
                    Id = r.Id,
                    Category = r.Category,
                    RequestType = r.RequestType,
                    Description = r.Description,
                    BudgetAmount = r.BudgetAmount,
                    IsBudgetTbd = r.IsBudgetTbd,
                    TargetEndDate = r.TargetEndDate,
                    RequesterId = r.RequesterId,
                    RequesterName = r.RequesterName,
                    RequesterDept = r.RequesterDept,
                    VendorName = r.VendorName,
                    Status = r.Status,
                    PendingActionBy = r.PendingActionBy,
                    CreatedAt = r.CreatedAt,
                    UpdatedAt = r.UpdatedAt
                })
                .ToListAsync();

            var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

            return Ok(new
            {
                Items = items,
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize,
                TotalPages = totalPages,
                HasPreviousPage = page > 1,
                HasNextPage = page < totalPages
            });
        }

        [HttpPost("{id}/withdraw")]
        public async Task<IActionResult> WithdrawRequest(string id, [FromQuery] string? userId = null, [FromQuery] string? userName = null)
        {
            var request = await _context.ProcurementRequests.FindAsync(id);
            if (request == null)
            {
                return NotFound(new { message = $"Procurement request {id} not found." });
            }

            // Optional ownership check if userId header or query param is provided
            if (!string.IsNullOrEmpty(userId) && request.RequesterId != userId)
            {
                return BadRequest(new { message = "Request is not owned by user." });
            }

            // Specification: Status in [SUBMITTED, PENDING_REVIEW] can be withdrawn.
            // If request is under assessment or other stages:
            if (request.Status != WorkflowStatus.SUBMITTED && request.Status != WorkflowStatus.PENDING_REVIEW)
            {
                return BadRequest(new { message = "Request cannot be withdrawn after procurement assessment commences." });
            }

            var oldStatus = request.Status;
            request.Status = WorkflowStatus.WITHDRAWN;
            request.PendingActionBy = string.Empty;
            request.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            await _auditLogService.LogActionAsync(
                request.Id,
                "WITHDRAWN",
                userId ?? request.RequesterId,
                userName ?? request.RequesterName,
                new { status = oldStatus.ToString() },
                new { status = request.Status.ToString() }
            );

            return Ok(new
            {
                id = request.Id,
                status = request.Status.ToString(),
                updatedAt = request.UpdatedAt,
                message = "Request withdrawn successfully."
            });
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
