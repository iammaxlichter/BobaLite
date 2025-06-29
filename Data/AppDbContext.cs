// Data/AppDbContext.cs
using Microsoft.EntityFrameworkCore;
using BobaLite.Models;

namespace BobaLite.Data
{
    public class AppDbContext : DbContext
    {
        public DbSet<Product>        Products { get; set; } = null!;
        public DbSet<ProductVariant> Variants { get; set; } = null!; 

        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        { }
    }
}
