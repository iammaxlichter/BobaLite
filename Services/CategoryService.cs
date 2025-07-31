// ───── Framework Usings ─────────────────────────────
using Microsoft.EntityFrameworkCore;

// ───── Project Usings ───────────────────────────────
using BobaLite.Data;
using BobaLite.DTOs;

namespace BobaLite.Services
{
    /// <summary>
    /// Service for handling category-related logic, including building filter groups
    /// for product browsing.
    /// </summary>
    public class CategoryService : ICategoryService
    {
        private readonly AppDbContext _db;

        /// <summary>
        /// Initializes a new instance of the <see cref="CategoryService"/> class.
        /// </summary>
        /// <param name="db">The database context.</param>
        public CategoryService(AppDbContext db) => _db = db;

        /// <summary>
        /// Retrieves filter groups for categories, including their options and product counts.
        /// </summary>
        /// <returns>A collection of <see cref="FilterGroupDto"/> representing top-level categories with their options.</returns>
        public IEnumerable<FilterGroupDto> GetFilterGroups()
        {
            var groups = _db.Categories
                .Where(c => c.ParentCategoryId == null)
                .Include(c => c.Children)
                .OrderBy(c => c.Name)
                .ToList();

            var productCats = _db.ProductCategories
                .Include(pc => pc.Category)
                .Include(pc => pc.Product)
                .Where(pc => pc.Product.IsActive)
                .ToList();

            return groups
                .Select(g =>
                {
                    // Build the leaf options list
                    var opts = g.Children.Any()
                        ? g.Children
                            .OrderBy(ch => ch.Name)
                            .Select(ch =>
                            {
                                var count = productCats.Count(pc => pc.Category.Slug == ch.Slug);
                                return new FilterOptionDto(ch.Name, ch.Slug, count);
                            })
                            .ToList()
                        : new List<FilterOptionDto>
                        {
                            new FilterOptionDto(
                                g.Name,
                                g.Slug,
                                productCats.Count(pc => pc.Category.Slug == g.Slug)
                            )
                        };

                    return new FilterGroupDto(g.Name, g.Slug, opts);
                })
                .ToList();
        }
    }
}
