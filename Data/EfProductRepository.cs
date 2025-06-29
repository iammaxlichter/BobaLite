using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using BobaLite.Models;

namespace BobaLite.Data
{
    public class EfProductRepository : IProductRepository
    {
        private readonly AppDbContext _db;
        public EfProductRepository(AppDbContext db) => _db = db;

        public IEnumerable<Product> GetAll()
        {
            return _db.Products
                      .Include(p => p.Variants)
                      .ToList();
        }

        public IEnumerable<Product> GetByCategorySlugs(IEnumerable<string> slugs)
        {
            return _db.Products
                      .Include(p => p.Variants)
                      .Where(p => p.ProductCategories
                                   .Any(pc => slugs.Contains(pc.Category.Slug)))
                      .ToList();
        }

        public Product? GetProduct(int productId)
        {
            return _db.Products
                      .Include(p => p.Variants)
                      .FirstOrDefault(p => p.Id == productId);
        }

        public ProductVariant? GetVariant(int productId, string attribute)
        {
            return _db.Variants
                      .AsNoTracking()
                      .FirstOrDefault(v =>
                          v.ProductId == productId &&
                          v.Attributes == attribute
                      );
        }
    }
}
