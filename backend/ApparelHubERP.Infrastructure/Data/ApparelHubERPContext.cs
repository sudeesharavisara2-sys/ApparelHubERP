using Microsoft.EntityFrameworkCore;
using ApparelHubERP.Core.Entities;

namespace ApparelHubERP.Infrastructure.Data
{
    public class ApparelHubERPContext : DbContext
    {
        public ApparelHubERPContext(DbContextOptions<ApparelHubERPContext> options) : base(options)
        {
        }

        // මේකෙන් තමයි SQL Server වල Employees කියලා ටේබල් එකක් හැදෙන්නේ
        public DbSet<Employee> Employees { get; set; }

        // ✅ Login සඳහා Users ටේබල් එක add කරන්න
        public DbSet<User> Users { get; set; }

        // ============================================================
        // 🚀 PROCUREMENT TABLES (Member 05)
        // ============================================================
        public DbSet<Product> Products { get; set; }
        public DbSet<Supplier> Suppliers { get; set; }
        public DbSet<PurchaseOrder> PurchaseOrders { get; set; }
        public DbSet<PurchaseOrderItem> PurchaseOrderItems { get; set; }

        // ✅ NEW ENTITIES
        public DbSet<SupplierResponse> SupplierResponses { get; set; }
        public DbSet<SupplierPerformance> SupplierPerformances { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // ============================================================
            // DECIMAL PRECISION
            // ============================================================
            modelBuilder.Entity<PurchaseOrder>()
                .Property(p => p.TotalAmount)
                .HasPrecision(18, 2);

            modelBuilder.Entity<PurchaseOrder>()
                .Property(p => p.BudgetedAmount)
                .HasPrecision(18, 2);

            modelBuilder.Entity<PurchaseOrderItem>()
                .Property(i => i.UnitCost)
                .HasPrecision(18, 2);

            modelBuilder.Entity<PurchaseOrderItem>()
                .Property(i => i.PreviousSeasonUnitCost)
                .HasPrecision(18, 2);

            modelBuilder.Entity<SupplierResponse>()
                .Property(r => r.QuotedTotal)
                .HasPrecision(18, 2);

            modelBuilder.Entity<SupplierPerformance>()
                .Property(p => p.QualityScore)
                .HasPrecision(5, 2);

            modelBuilder.Entity<SupplierPerformance>()
                .Property(p => p.AverageResponseTimeHours)
                .HasPrecision(10, 2);

            modelBuilder.Entity<SupplierPerformance>()
                .Property(p => p.AverageDeliveryTimeDays)
                .HasPrecision(10, 2);

            // ============================================================
            // ✅ FIX: Decimal precision for Product & Supplier (Fixes warnings)
            // ============================================================
            modelBuilder.Entity<Product>()
                .Property(p => p.CostPrice)
                .HasPrecision(18, 2);

            modelBuilder.Entity<Product>()
                .Property(p => p.UnitPrice)
                .HasPrecision(18, 2);

            modelBuilder.Entity<Supplier>()
                .Property(s => s.MinimumOrderValue)
                .HasPrecision(18, 2);

            // ============================================================
            // RELATIONSHIPS
            // ============================================================

            // Supplier → PurchaseOrder (One to Many)
            modelBuilder.Entity<PurchaseOrder>()
                .HasOne(p => p.Supplier)
                .WithMany(s => s.PurchaseOrders)
                .HasForeignKey(p => p.SupplierId)
                .OnDelete(DeleteBehavior.Restrict);

            // PurchaseOrder → PurchaseOrderItem (One to Many)
            modelBuilder.Entity<PurchaseOrderItem>()
                .HasOne(i => i.PurchaseOrder)
                .WithMany(p => p.Items)
                .HasForeignKey(i => i.PurchaseOrderId)
                .OnDelete(DeleteBehavior.Cascade);

            // PurchaseOrderItem → Product (Many to One)
            modelBuilder.Entity<PurchaseOrderItem>()
                .HasOne(i => i.Product)
                .WithMany(p => p.PurchaseOrderItems)
                .HasForeignKey(i => i.ProductId)
                .OnDelete(DeleteBehavior.Restrict);

            // ✅ SupplierResponse → PurchaseOrder (One to One)
            modelBuilder.Entity<SupplierResponse>()
                .HasOne(r => r.PurchaseOrder)
                .WithOne(p => p.SupplierResponse)
                .HasForeignKey<SupplierResponse>(r => r.PurchaseOrderId)
                .OnDelete(DeleteBehavior.Cascade);

            // SupplierResponse → Supplier (Many to One)
            modelBuilder.Entity<SupplierResponse>()
                .HasOne(r => r.Supplier)
                .WithMany(s => s.SupplierResponses)
                .HasForeignKey(r => r.SupplierId)
                .OnDelete(DeleteBehavior.Restrict);

            // ✅ SupplierPerformance → Supplier (One to One)
            modelBuilder.Entity<SupplierPerformance>()
                .HasOne(p => p.Supplier)
                .WithOne(s => s.Performance)
                .HasForeignKey<SupplierPerformance>(p => p.SupplierId)
                .OnDelete(DeleteBehavior.Cascade);

            // ============================================================
            // UNIQUE CONSTRAINTS
            // ============================================================
            modelBuilder.Entity<PurchaseOrder>()
                .HasIndex(p => p.PONumber)
                .IsUnique();
        }
    }
}