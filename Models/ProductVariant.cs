// ───── Framework Usings ─────────────────────────────
using System.Collections.Generic;
using System.Linq;
using System.ComponentModel.DataAnnotations.Schema;

namespace BobaLite.Models
{
    /// <summary>
    /// Represents a variant of a product in the BobaLite store.
    /// </summary>
    public class ProductVariant
    {
        public int Id { get; set; }
        public decimal Price { get; set; }
        public int Stock { get; set; }
        public string? Attributes { get; set; }
        public int ProductId { get; set; }
        public string ImageUrl { get; set; } = "";
        public Product Product { get; set; } = null!;
        public IList<ProductVariantImage> Images { get; set; } = new List<ProductVariantImage>();

        [NotMapped]
        public string PrimaryImageUrl =>
            Images
                .OrderBy(img => img.SortOrder)
                .Select(img => img.Url)
                .FirstOrDefault()
            ?? ImageUrl;
    }
}
