using Microsoft.EntityFrameworkCore;
using Procurement.Core.DTOs;
using Procurement.Core.Entities;
using Procurement.Core.Services;
using Procurement.Infrastructure.Data;

namespace Procurement.Infrastructure.Services
{
    public class SupplierMasterService : ISupplierMasterService
    {
        private readonly ProcurementDbContext _context;

        public SupplierMasterService(ProcurementDbContext context)
        {
            _context = context;
            SeedDefaultVendors();
        }

        private void SeedDefaultVendors()
        {
            if (!_context.Set<VendorRecord>().Any())
            {
                _context.Set<VendorRecord>().AddRange(
                    new VendorRecord
                    {
                        Id = "V-10001",
                        Name = "ABC Technology Sdn Bhd",
                        RegNo = "202001012345",
                        Status = "ACTIVE",
                        ContactPerson = "John Tan",
                        Email = "john@abctech.com",
                        Phone = "+60312345678",
                        Hp = "+60123456789"
                    },
                    new VendorRecord
                    {
                        Id = "V-10002",
                        Name = "XYZ Solutions Global",
                        RegNo = "201901098765",
                        Status = "ACTIVE",
                        ContactPerson = "Alice Wong",
                        Email = "alice@xyzsolutions.com",
                        Phone = "+60398765432",
                        Hp = "+60198765432"
                    },
                    new VendorRecord
                    {
                        Id = "V-10003",
                        Name = "Global Logistics Enterprise",
                        RegNo = "201801112233",
                        Status = "ACTIVE",
                        ContactPerson = "David Lee",
                        Email = "david@globallogistics.com",
                        Phone = "+60355556666",
                        Hp = "+60185556666"
                    }
                );
                _context.SaveChanges();
            }
        }

        public async Task<IEnumerable<VendorDto>> SearchVendorsAsync(string query)
        {
            var queryLower = (query ?? string.Empty).Trim().ToLowerInvariant();

            var vendorsQuery = _context.Set<VendorRecord>().AsQueryable();

            if (!string.IsNullOrEmpty(queryLower))
            {
                vendorsQuery = vendorsQuery.Where(v =>
                    v.Name.ToLower().Contains(queryLower) ||
                    v.RegNo.ToLower().Contains(queryLower));
            }

            var results = await vendorsQuery
                .Where(v => v.Status == "ACTIVE")
                .Take(10)
                .Select(v => new VendorDto
                {
                    Id = v.Id,
                    Name = v.Name,
                    RegNo = v.RegNo,
                    Status = v.Status,
                    ContactPerson = v.ContactPerson,
                    Email = v.Email,
                    Phone = v.Phone,
                    Hp = v.Hp
                })
                .ToListAsync();

            return results;
        }

        public async Task<DuplicateCheckResponseDto> CheckDuplicateVendorAsync(DuplicateCheckRequestDto request)
        {
            var allVendors = await _context.Set<VendorRecord>().ToListAsync();

            var incomingRegNo = (request.RegNo ?? string.Empty).Trim();
            var incomingName = (request.Name ?? string.Empty).Trim();
            var incomingEmailDomain = DuplicateVendorDetector.ExtractEmailDomain(request.Email);

            // 1. Check exact RegNo match
            if (!string.IsNullOrEmpty(incomingRegNo))
            {
                var matchByRegNo = allVendors.FirstOrDefault(v => string.Equals(v.RegNo.Trim(), incomingRegNo, StringComparison.OrdinalIgnoreCase));
                if (matchByRegNo != null)
                {
                    return new DuplicateCheckResponseDto
                    {
                        IsDuplicate = true,
                        MatchReason = "Exact registration number match",
                        MatchedVendor = MapToDto(matchByRegNo)
                    };
                }
            }

            // 2. Check Levenshtein distance on Name (>85%)
            if (!string.IsNullOrEmpty(incomingName))
            {
                foreach (var vendor in allVendors)
                {
                    double similarity = DuplicateVendorDetector.CalculateLevenshteinSimilarity(vendor.Name, incomingName);
                    if (similarity > 0.85)
                    {
                        return new DuplicateCheckResponseDto
                        {
                            IsDuplicate = true,
                            MatchReason = $"Vendor name similarity > 85% ({Math.Round(similarity * 100, 1)}%)",
                            MatchedVendor = MapToDto(vendor)
                        };
                    }
                }
            }

            // 3. Check corporate email domain match (ignore common public domains like gmail, yahoo, hotmail)
            if (!string.IsNullOrEmpty(incomingEmailDomain))
            {
                var publicDomains = new[] { "gmail.com", "yahoo.com", "hotmail.com", "outlook.com" };
                if (!publicDomains.Contains(incomingEmailDomain))
                {
                    foreach (var vendor in allVendors)
                    {
                        var vendorEmailDomain = DuplicateVendorDetector.ExtractEmailDomain(vendor.Email);
                        if (!string.IsNullOrEmpty(vendorEmailDomain) && string.Equals(vendorEmailDomain, incomingEmailDomain, StringComparison.OrdinalIgnoreCase))
                        {
                            return new DuplicateCheckResponseDto
                            {
                                IsDuplicate = true,
                                MatchReason = $"Corporate email domain match ({incomingEmailDomain})",
                                MatchedVendor = MapToDto(vendor)
                            };
                        }
                    }
                }
            }

            return new DuplicateCheckResponseDto
            {
                IsDuplicate = false,
                MatchReason = null,
                MatchedVendor = null
            };
        }

        public async Task<VendorDto?> GetVendorByIdAsync(string id)
        {
            var v = await _context.Set<VendorRecord>().FirstOrDefaultAsync(x => x.Id == id);
            return v != null ? MapToDto(v) : null;
        }

        private static VendorDto MapToDto(VendorRecord v)
        {
            return new VendorDto
            {
                Id = v.Id,
                Name = v.Name,
                RegNo = v.RegNo,
                Status = v.Status,
                ContactPerson = v.ContactPerson,
                Email = v.Email,
                Phone = v.Phone,
                Hp = v.Hp
            };
        }
    }
}
