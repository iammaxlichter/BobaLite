// Data/EfProductRepository.cs
using System.Linq;
using Microsoft.EntityFrameworkCore;
using BobaLite.Models;

namespace BobaLite.Data
{
    public class EfProductRepository : IProductRepository
    {
        private readonly AppDbContext _db;
        public EfProductRepository(AppDbContext db) => _db = db;

        public ProductVariant? GetVariant(int productId, string attribute)
        {
            return _db.Variants                           
                      .AsNoTracking()
                      .Where(v => v.ProductId == productId
                               && v.Attributes == attribute)
                      .FirstOrDefault();
        }
        
        public Product? GetProduct(int productId)
            => _db.Products
                   .FirstOrDefault(p => p.Id == productId);
    }
}
