using Microsoft.EntityFrameworkCore;
using ApparelHubERP.Core.Entities;

namespace ApparelHubERP.Infrastructure.Data
{
    public class ApparelHubERPContext : DbContext
    {
        public ApparelHubERPContext(DbContextOptions<ApparelHubERPContext> options) : base(options)
        {
        }

        // Employee table
        public DbSet<Employee> Employees { get; set; }

        // User table for authentication and authorization
        public DbSet<User> Users { get; set; }

        public DbSet<Product> Products { get; set; } = null!;
        public DbSet<Sale> Sales { get; set; } = null!;
        public DbSet<SaleItem> SaleItems { get; set; } = null!;
    }
}