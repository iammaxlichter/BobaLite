// Services/CategoryService.cs
using Microsoft.EntityFrameworkCore;
using BobaLite.Data;
using BobaLite.DTOs;

namespace BobaLite.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly AppDbContext _db;
        public CategoryService(AppDbContext db) => _db = db;

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
                  // build the leaf‐options list
                  var opts = g.Children.Any()
                            ? g.Children
                               .OrderBy(ch => ch.Name)
                               .Select(ch =>
                               {
                                   var count = productCats.Count(pc => pc.Category.Slug == ch.Slug);
                                   return new FilterOptionDto(ch.Name, ch.Slug, count);
                               })
                               .ToList()
                            : new List<FilterOptionDto> {
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
