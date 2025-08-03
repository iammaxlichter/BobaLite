// ───── Framework Usings ─────────────────────────────
using System.Collections.Generic;

// ───── Project Usings ───────────────────────────────
using BobaLite.Models;

namespace BobaLite.Data
{
    public interface IProductRepository
    {
        /// <summary>
        /// Get every product (including its Variants).
        /// </summary>
        IEnumerable<Product> GetAll();

        /// <summary>
        /// Get products whose leaf-category slug is in <paramref name="slugs"/>.
        /// </summary>
        IEnumerable<Product> GetByCategorySlugs(IEnumerable<string> slugs);

        /// <summary>
        /// Load the base Product by its ID (including Variants).
        /// </summary>
        Product? GetProduct(int productId);

        /// <summary>
        /// Load a specific variant by product ID & attribute.
        /// </summary>
        ProductVariant? GetVariant(int productId, string attribute);

        /// <summary>
        /// Get basic info (Id and Name) for all products.
        /// </summary>
        IEnumerable<Product> GetAllBasic();

        /// <summary>
        /// Get product search results including ID, name, and primary image URL.
        /// </summary>
        IEnumerable<object> GetSearchResults();
    }
}
