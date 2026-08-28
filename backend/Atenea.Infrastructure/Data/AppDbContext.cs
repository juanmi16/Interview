using Atenea.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Atenea.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    // Each DbSet = a table. The property name = the table name.
    public DbSet<User> Users => Set<User>();
    public DbSet<Role> Roles => Set<Role>();

    // Extra model configuration (rules EF applies when creating the tables).
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Email must be unique.
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        // Seed the 3 fixed roles (created automatically by the migration).
        modelBuilder.Entity<Role>().HasData(
            new Role { Id = 1, Name = "Admin" },
            new Role { Id = 2, Name = "Viewer" },
            new Role { Id = 3, Name = "User" }
        );
    }
}
