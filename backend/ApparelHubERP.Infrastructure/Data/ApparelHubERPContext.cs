using Microsoft.EntityFrameworkCore;
using ApparelHubERP.Core.Entities;
namespace ApparelHubERP.Infrastructure.Data
{
    public class ApparelHubERPContext : DbContext
    {
        public ApparelHubERPContext(DbContextOptions<ApparelHubERPContext> options) : base(options)
        {
        }
<<<<<<< HEAD

        // Employee table
        public DbSet<Employee> Employees { get; set; }

        // User table for authentication and authorization
        public DbSet<User> Users { get; set; }

        // Inventory products
        public DbSet<Product> Products { get; set; }
=======
        // මේකෙන් තමයි SQL Server වල Employees කියලා ටේබල් එකක් හැදෙන්නේ
        public DbSet<Employee> Employees { get; set; }
        // ✅ Login සඳහා Users ටේබල් එක add කරන්න
        public DbSet<User> Users { get; set; }
        // ✅ Employee status change history (Active/Suspended/Resigned/OnLeave)
        public DbSet<EmployeeStatusLog> EmployeeStatusLogs { get; set; }
>>>>>>> dev-kavishka
    }
}