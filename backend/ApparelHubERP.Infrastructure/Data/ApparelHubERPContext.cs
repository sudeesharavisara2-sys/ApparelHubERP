using Microsoft.EntityFrameworkCore;
using ApparelHubERP.Core.Entities;

namespace ApparelHubERP.Infrastructure.Data
{
    public class ApparelHubERPContext : DbContext
    {
        public ApparelHubERPContext(DbContextOptions<ApparelHubERPContext> options) : base(options)
        {
        }

        public DbSet<Employee> Employees { get; set; }

        // Login users
        public DbSet<User> Users { get; set; }

        // Inventory products
        public DbSet<Product> Products { get; set; }
    }
}