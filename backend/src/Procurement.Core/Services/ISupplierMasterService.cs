using Procurement.Core.DTOs;

namespace Procurement.Core.Services
{
    public interface ISupplierMasterService
    {
        Task<IEnumerable<VendorDto>> SearchVendorsAsync(string query);
        Task<DuplicateCheckResponseDto> CheckDuplicateVendorAsync(DuplicateCheckRequestDto request);
        Task<VendorDto?> GetVendorByIdAsync(string id);
    }
}
