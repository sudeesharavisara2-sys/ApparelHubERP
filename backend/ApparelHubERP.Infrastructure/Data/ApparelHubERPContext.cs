using Microsoft.EntityFrameworkCore;
using ApparelHubERP.Core.Entities;

namespace ApparelHubERP.Infrastructure.Data
{
    public class ApparelHubERPContext : DbContext
    {
        public ApparelHubERPContext(DbContextOptions<ApparelHubERPContext> options)
            : base(options)
        {
        }

        // Employee table
        public DbSet<Employee> Employees { get; set; }

        // User table for authentication and authorization
        public DbSet<User> Users { get; set; }

<<<<<<< HEAD
        // Inventory products
        public DbSet<Product> Products { get; set; }

        // Employee status change history
=======
        // Employee status change history (Active / Suspended / Resigned / OnLeave)
>>>>>>> dev-kavishka
        public DbSet<EmployeeStatusLog> EmployeeStatusLogs { get; set; }
    }
}