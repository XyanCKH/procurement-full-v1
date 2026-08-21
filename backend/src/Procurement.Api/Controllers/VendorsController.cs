using Microsoft.AspNetCore.Mvc;
using Procurement.Core.DTOs;
using Procurement.Core.Services;

namespace Procurement.Api.Controllers
{
    [ApiController]
    [Route("api/v1/procurement/vendors")]
    public class VendorsController : ControllerBase
    {
        private readonly ISupplierMasterService _supplierMasterService;

        public VendorsController(ISupplierMasterService supplierMasterService)
        {
            _supplierMasterService = supplierMasterService;
        }

        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<VendorDto>>> Search([FromQuery] string? q)
        {
            var results = await _supplierMasterService.SearchVendorsAsync(q ?? string.Empty);
            return Ok(results);
        }

        [HttpPost("duplicate-check")]
        public async Task<ActionResult<DuplicateCheckResponseDto>> CheckDuplicate([FromBody] DuplicateCheckRequestDto request)
        {
            var result = await _supplierMasterService.CheckDuplicateVendorAsync(request);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<VendorDto>> GetById(string id)
        {
            var vendor = await _supplierMasterService.GetVendorByIdAsync(id);
            if (vendor == null)
            {
                return NotFound();
            }
            return Ok(vendor);
        }
    }
}
