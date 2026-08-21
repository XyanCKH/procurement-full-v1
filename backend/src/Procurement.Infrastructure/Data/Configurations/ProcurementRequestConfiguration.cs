using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Procurement.Core.Entities;

namespace Procurement.Infrastructure.Data.Configurations
{
    public class ProcurementRequestConfiguration : IEntityTypeConfiguration<ProcurementRequest>
    {
        public void Configure(EntityTypeBuilder<ProcurementRequest> builder)
        {
            builder.HasKey(e => e.Id);
            builder.Property(e => e.Id).HasColumnType("varchar(20)").IsRequired();

            builder.Property(e => e.Category).HasConversion<string>().HasMaxLength(50).IsRequired();
            builder.Property(e => e.QueryDetails).HasColumnType("nvarchar(1000)");
            builder.Property(e => e.RequestType).HasConversion<string>().HasMaxLength(20).IsRequired();
            builder.Property(e => e.PreviousCmtId).HasColumnType("varchar(50)");
            builder.Property(e => e.Description).HasColumnType("nvarchar(2000)").IsRequired();
            builder.Property(e => e.IsOutsourcing).IsRequired();
            builder.Property(e => e.BudgetAmount).HasColumnType("decimal(15,2)");
            builder.Property(e => e.IsBudgetTbd).IsRequired();
            builder.Property(e => e.TargetEndDate).HasColumnType("date").IsRequired();

            builder.Property(e => e.RequesterId).HasColumnType("varchar(50)").IsRequired();
            builder.Property(e => e.RequesterName).HasColumnType("nvarchar(150)").IsRequired();
            builder.Property(e => e.RequesterDept).HasColumnType("nvarchar(100)").IsRequired();
            builder.Property(e => e.RequesterContact).HasColumnType("varchar(50)").IsRequired();

            builder.Property(e => e.IsItRelated).IsRequired();
            builder.Property(e => e.ItUserId).HasColumnType("varchar(50)");
            builder.Property(e => e.ItUserName).HasColumnType("nvarchar(150)");
            builder.Property(e => e.ItUserDept).HasColumnType("nvarchar(100)");
            builder.Property(e => e.ItUserContact).HasColumnType("varchar(50)");

            builder.Property(e => e.IsVendorRegistered).IsRequired();
            builder.Property(e => e.VendorId).HasColumnType("varchar(50)");
            builder.Property(e => e.VendorName).HasColumnType("nvarchar(200)").IsRequired();
            builder.Property(e => e.VendorRegNo).HasColumnType("varchar(50)");
            builder.Property(e => e.VendorContactPerson).HasColumnType("nvarchar(150)");
            builder.Property(e => e.VendorEmail).HasColumnType("nvarchar(150)");
            builder.Property(e => e.VendorPhone).HasColumnType("varchar(50)");
            builder.Property(e => e.VendorHp).HasColumnType("varchar(50)");

            builder.Property(e => e.Status).HasConversion<string>().HasMaxLength(50).IsRequired();
            builder.Property(e => e.PendingActionBy).HasColumnType("varchar(100)");
            builder.Property(e => e.DeclarationConfirmed).IsRequired();
            builder.Property(e => e.CreatedAt).HasColumnType("datetime2").IsRequired();
            builder.Property(e => e.UpdatedAt).HasColumnType("datetime2").IsRequired();
        }
    }
}
