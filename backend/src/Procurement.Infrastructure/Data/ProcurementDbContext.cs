using Microsoft.EntityFrameworkCore;
using Procurement.Core.Entities;
using Procurement.Infrastructure.Data.Configurations;

namespace Procurement.Infrastructure.Data
{
    public class ProcurementDbContext : DbContext
    {
        public DbSet<ProcurementRequest> ProcurementRequests => Set<ProcurementRequest>();
        public DbSet<RequestDocument> RequestDocuments => Set<RequestDocument>();

        public ProcurementDbContext(DbContextOptions<ProcurementDbContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.ApplyConfiguration(new ProcurementRequestConfiguration());
            modelBuilder.Entity<RequestDocument>().HasKey(d => d.Id);
            modelBuilder.Entity<RequestDocument>().Property(d => d.RequestId).IsRequired();
            modelBuilder.Entity<RequestDocument>().Property(d => d.DocumentType).IsRequired();
            modelBuilder.Entity<RequestDocument>().Property(d => d.VirusScanStatus).IsRequired();
        }
    }
}
