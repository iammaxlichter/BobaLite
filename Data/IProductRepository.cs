using System.Collections.Generic;
using BobaLite.Models;

namespace BobaLite.Data
{
    public interface IProductRepository
    {
        /// <summary>Get every product (including its Variants).</summary>
        IEnumerable<Product> GetAll();

        /// <summary>Get products whose leaf-category slug is in <paramref name="slugs"/>.</summary>
        IEnumerable<Product> GetByCategorySlugs(IEnumerable<string> slugs);

        /// <summary>Load the base Product by its ID (including Variants).</summary>
        Product? GetProduct(int productId);

        /// <summary>Load a specific variant by product ID & attribute.</summary>
        ProductVariant? GetVariant(int productId, string attribute);
    }
}
