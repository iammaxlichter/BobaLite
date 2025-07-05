using System.Collections.Generic;
using System.Linq;
using System.ComponentModel.DataAnnotations.Schema;

namespace BobaLite.Models
{
    public class ProductVariant
    {
        public int Id { get; set; }
        public decimal Price { get; set; }
        public int Stock { get; set; }
        public string? Attributes { get; set; }  // e.g. "12-pack", "Size L / Red"

        // FK back to Product
        public int ProductId { get; set; }

        // legacy single-image column (we’ll phase this out later)
        public string ImageUrl { get; set; } = "";

        // navigation properties
        public Product Product { get; set; } = null!;
        public IList<ProductVariantImage> Images { get; set; } = new List<ProductVariantImage>();

        /// <summary>
        /// The URL of the first image (lowest SortOrder) in Images,
        /// or falls back to the legacy ImageUrl if Images is empty.
        /// </summary>
        [NotMapped]
        public string PrimaryImageUrl =>
            Images
                .OrderBy(img => img.SortOrder)
                .Select(img => img.Url)
                .FirstOrDefault()
            ?? ImageUrl;
    }
}
