using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Procurement.Core.Services;
using Procurement.Infrastructure.Data;

namespace Procurement.Infrastructure.Services
{
    public class SequentialRequestIdGenerator : IRequestIdGenerator
    {
        private readonly ProcurementDbContext _context;

        public SequentialRequestIdGenerator(ProcurementDbContext context)
        {
            _context = context;
        }

        public async Task<string> GenerateIdAsync()
        {
            var year = DateTime.UtcNow.Year;
            var prefix = $"PR-{year}-";
            
            // Find max existing ID for current year or count
            var requests = await _context.ProcurementRequests
                .Where(r => r.Id.StartsWith(prefix))
                .ToListAsync();

            int nextNum = 1;
            if (requests.Count > 0)
            {
                int maxSeq = 0;
                foreach (var req in requests)
                {
                    if (req.Id.Length >= prefix.Length + 5 && 
                        int.TryParse(req.Id.Substring(prefix.Length), out int seq))
                    {
                        if (seq > maxSeq) maxSeq = seq;
                    }
                }
                nextNum = maxSeq + 1;
            }

            return $"PR-{year}-{nextNum:D6}";
        }
    }
}
