// ───── Framework Usings ─────────────────────────────
using Microsoft.EntityFrameworkCore;

// ───── Project Usings ───────────────────────────────
using BobaLite.Models;

namespace BobaLite.Data
{
    /// <summary>
    /// The application's Entity Framework database context.
    /// Defines the database sets and relationships for all entities.
    /// </summary>
    public class AppDbContext : DbContext
    {
        #region Constructor
        /// <summary>
        /// Initializes a new instance of the <see cref="AppDbContext"/> class.
        /// </summary>
        /// <param name="options">The database context options.</param>
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        #endregion

        #region DbSets
        /// <summary>Represents the products in the database.</summary>
        public DbSet<Product> Products { get; set; } = null!;

        /// <summary>Represents the product variants in the database.</summary>
        public DbSet<ProductVariant> Variants { get; set; } = null!;

        /// <summary>Represents the product variant images in the database.</summary>
        public DbSet<ProductVariantImage> ProductVariantImages { get; set; } = null!;

        /// <summary>Represents the product categories in the database.</summary>
        public DbSet<Category> Categories { get; set; } = null!;

        /// <summary>Represents the product-category relationships in the database.</summary>
        public DbSet<ProductCategory> ProductCategories { get; set; } = null!;

        /// <summary>Represents the admin users in the database.</summary>
        public DbSet<AdminUser> AdminUsers { get; set; } = null!;
        #endregion

        #region Fluent API Configuration
        /// <summary>
        /// Configures entity relationships and database mappings.
        /// </summary>
        /// <param name="mb">The model builder instance.</param>
        protected override void OnModelCreating(ModelBuilder mb)
        {
            base.OnModelCreating(mb);

            // Many-to-Many: Products ↔ Categories (bridge table: ProductCategory)
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

            // One-to-Many: Variants → VariantImages
            mb.Entity<ProductVariantImage>()
                .HasOne(img => img.Variant)
                .WithMany(v => v.Images)
                .HasForeignKey(img => img.VariantId)
                .OnDelete(DeleteBehavior.Cascade);

            // Self-Reference: Category tree (Parent ↔ Children)
            mb.Entity<Category>()
                .HasOne(c => c.Parent)
                .WithMany(c => c.Children)
                .HasForeignKey(c => c.ParentCategoryId);
        }
        #endregion
    }
}
