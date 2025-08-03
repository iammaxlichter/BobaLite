// ───── Framework Usings ─────────────────────────────
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;

// ───── Project Usings ───────────────────────────────
using BobaLite.Models;

namespace BobaLite.Data
{
    /// <summary>
    /// Entity Framework implementation of <see cref="IProductRepository"/>.
    /// Handles database access for products, variants, and related entities.
    /// </summary>
    public class EfProductRepository : IProductRepository
    {
        private readonly AppDbContext _db;

        /// <summary>
        /// Initializes a new instance of the <see cref="EfProductRepository"/> class.
        /// </summary>
        /// <param name="db">The database context.</param>
        public EfProductRepository(AppDbContext db) => _db = db;

        /// <inheritdoc/>
        public IEnumerable<Product> GetAll()
        {
            return _db.Products
                .Where(p => p.IsActive)
                .Include(p => p.Variants)
                    .ThenInclude(v => v.Images)
                .ToList();
        }

        /// <inheritdoc/>
        public IEnumerable<Product> GetByCategorySlugs(IEnumerable<string> slugs)
        {
            return _db.Products
                .Where(p => p.IsActive &&
                            p.ProductCategories.Any(pc => slugs.Contains(pc.Category.Slug)))
                .Include(p => p.Variants)
                    .ThenInclude(v => v.Images)
                .ToList();
        }

        /// <inheritdoc/>
        public Product? GetProduct(int productId)
        {
            return _db.Products
                .Include(p => p.Variants)
                    .ThenInclude(v => v.Images)
                .Include(p => p.ProductCategories)
                    .ThenInclude(pc => pc.Category)
                .FirstOrDefault(p => p.Id == productId);
        }

        /// <inheritdoc/>
        public ProductVariant? GetVariant(int productId, string attribute)
        {
            return _db.Variants
                .Include(v => v.Images)
                .AsNoTracking()
                .FirstOrDefault(v =>
                    v.ProductId == productId &&
                    v.Attributes == attribute
                );
        }

        /// <inheritdoc/>
        public IEnumerable<Product> GetAllBasic()
        {
            return _db.Products
                .Select(p => new Product
                {
                    Id = p.Id,
                    Name = p.Name
                })
                .ToList();
        }

        /// <inheritdoc/>
        public IEnumerable<object> GetSearchResults()
        {
            return _db.Products
                .Include(p => p.Variants)
                    .ThenInclude(v => v.Images)
                .Select(p => new
                {
                    id = p.Id,
                    name = p.Name,
                    primaryImageUrl = p.Variants
                        .SelectMany(v => v.Images)
                        .OrderBy(img => img.SortOrder)
                        .Select(img => img.Url)
                        .FirstOrDefault()
                })
                .ToList();
        }
    }
}
