using Microsoft.EntityFrameworkCore;

namespace Procurement.Infrastructure.Data
{
    public class ProcurementDbContext : DbContext
    {
        public ProcurementDbContext(DbContextOptions<ProcurementDbContext> options)
            : base(options)
        {
        }
    }
}
