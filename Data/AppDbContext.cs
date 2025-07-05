using Microsoft.EntityFrameworkCore;
using BobaLite.Models;

namespace BobaLite.Data
{
    public class AppDbContext : DbContext
    {
        // 1) Constructor – pass in your configured options (connection string, provider, etc.)
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        { }

        // 2) DbSets → these become your tables in the database
        public DbSet<Product>               Products               { get; set; } = null!;
        public DbSet<ProductVariant>        Variants               { get; set; } = null!;
        public DbSet<ProductVariantImage>   ProductVariantImages   { get; set; } = null!;
        public DbSet<Category>              Categories             { get; set; } = null!;
        public DbSet<ProductCategory>       ProductCategories      { get; set; } = null!;

        // 3) Fluent API configuration
        protected override void OnModelCreating(ModelBuilder mb)
        {
            base.OnModelCreating(mb);

            // ────────────────────────────────────────────────────────────────
            // A) Many-to-Many: Products ↔ Categories
            //    - Bridge table: ProductCategory
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

            // ────────────────────────────────────────────────────────────────
            // B) One-to-Many: Variants → VariantImages
            //    - _Each_ ProductVariant can have many ProductVariantImage entries
            mb.Entity<ProductVariantImage>()
                .HasOne(img => img.Variant)
                .WithMany(v => v.Images)
                .HasForeignKey(img => img.VariantId)
                .OnDelete(DeleteBehavior.Cascade);

            // ────────────────────────────────────────────────────────────────
            // C) Self-Reference: Category tree (Parent ↔ Children)
            mb.Entity<Category>()
                .HasOne(c => c.Parent)
                .WithMany(c => c.Children)
                .HasForeignKey(c => c.ParentCategoryId);
        }
    }
}
