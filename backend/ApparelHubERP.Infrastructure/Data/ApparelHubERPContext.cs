using Microsoft.EntityFrameworkCore;
using ApparelHubERP.Core.Entities;  // ✅ This is the correct namespace

namespace ApparelHubERP.Infrastructure.Data
{
    public class ApparelHubERPContext : DbContext
    {
        public ApparelHubERPContext(DbContextOptions<ApparelHubERPContext> options) : base(options)
        {
        }

        // ============================================================
        // EXISTING TABLES (Keep these)
        // ============================================================
        public DbSet<Employee> Employees { get; set; }
        public DbSet<User> Users { get; set; }

        // ============================================================
        // 🚀 PROCUREMENT TABLES (ADD THESE)
        // ============================================================
        public DbSet<Product> Products { get; set; }
        public DbSet<Supplier> Suppliers { get; set; }
        public DbSet<PurchaseOrder> PurchaseOrders { get; set; }
        public DbSet<PurchaseOrderItem> PurchaseOrderItems { get; set; }

        // ============================================================
        // RELATIONSHIPS (ADD THIS)
        // ============================================================
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Decimal Precision
            modelBuilder.Entity<PurchaseOrder>()
                .Property(p => p.TotalAmount)
                .HasPrecision(18, 2);

            modelBuilder.Entity<PurchaseOrderItem>()
                .Property(i => i.UnitCost)
                .HasPrecision(18, 2);

            // Supplier → PurchaseOrder
            modelBuilder.Entity<PurchaseOrder>()
                .HasOne(p => p.Supplier)
                .WithMany(s => s.PurchaseOrders)
                .HasForeignKey(p => p.SupplierId)
                .OnDelete(DeleteBehavior.Restrict);

            // PurchaseOrder → PurchaseOrderItem
            modelBuilder.Entity<PurchaseOrderItem>()
                .HasOne(i => i.PurchaseOrder)
                .WithMany(p => p.Items)
                .HasForeignKey(i => i.PurchaseOrderId)
                .OnDelete(DeleteBehavior.Cascade);

            // PurchaseOrderItem → Product
            modelBuilder.Entity<PurchaseOrderItem>()
                .HasOne(i => i.Product)
                .WithMany()
                .HasForeignKey(i => i.ProductId)
                .OnDelete(DeleteBehavior.Restrict);

            // Unique PONumber
            modelBuilder.Entity<PurchaseOrder>()
                .HasIndex(p => p.PONumber)
                .IsUnique();
        }
    }
}