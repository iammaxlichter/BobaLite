// Data/AppDbContext.cs
using Microsoft.EntityFrameworkCore;
using BobaLite.Models;

namespace BobaLite.Data
{
    public class AppDbContext : DbContext
    {
        public DbSet<Product>          Products          { get; set; } = null!;
        public DbSet<ProductVariant>   Variants          { get; set; } = null!; 
        public DbSet<Category>         Categories        { get; set; } = null!;
        public DbSet<ProductCategory>  ProductCategories { get; set; } = null!;

        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        { }

        protected override void OnModelCreating(ModelBuilder mb)
        {
            // 1. Configure many-to-many
            mb.Entity<ProductCategory>()
              .HasKey(pc => new { pc.ProductId, pc.CategoryId });
            mb.Entity<ProductCategory>()
              .HasOne(pc => pc.Product)
              .WithMany(p => p.ProductCategories)
              .HasForeignKey(pc => pc.ProductId);
            mb.Entity<ProductCategory>()
              .HasOne(pc => pc.Category)
              .WithMany(c => c.ProductCategories)
              .HasForeignKey(pc => pc.CategoryId);

            // 2. Configure self‐reference
            mb.Entity<Category>()
              .HasOne(c => c.Parent)
              .WithMany(c => c.Children)
              .HasForeignKey(c => c.ParentCategoryId);
              
        }
    }
}
