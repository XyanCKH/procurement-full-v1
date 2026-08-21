using Microsoft.EntityFrameworkCore;
using Procurement.Core.Entities;
using Procurement.Infrastructure.Data.Configurations;

namespace Procurement.Infrastructure.Data
{
    public class ProcurementDbContext : DbContext
    {
        public DbSet<ProcurementRequest> ProcurementRequests => Set<ProcurementRequest>();

        public ProcurementDbContext(DbContextOptions<ProcurementDbContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.ApplyConfiguration(new ProcurementRequestConfiguration());
        }
    }
}
