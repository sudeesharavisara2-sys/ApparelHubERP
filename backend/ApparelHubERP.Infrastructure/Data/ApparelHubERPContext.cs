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

        public DbSet<Product> Products { get; set; } = null!;
        public DbSet<Sale> Sales { get; set; } = null!;
        public DbSet<SaleItem> SaleItems { get; set; } = null!;
    }
}