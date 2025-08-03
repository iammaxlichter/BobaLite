// ───── Framework Usings ─────────────────────────────
using System.Collections.Generic;

// ───── Project Usings ───────────────────────────────
using BobaLite.DTOs;
using BobaLite.Models;

namespace BobaLite.ViewModels
{
    /// <summary>
    /// Represents the data for displaying the shop page, including filters, active categories, and products.
    /// </summary>
    public class ShopViewModel
    {
        /// <summary>
        /// Gets or sets the available filter groups for product categorization.
        /// </summary>
        public IEnumerable<FilterGroupDto> FilterGroups { get; set; } = null!;

        /// <summary>
        /// Gets or sets the currently selected category slugs.
        /// </summary>
        public IEnumerable<string> ActiveCategories { get; set; } = null!;

        /// <summary>
        /// Gets or sets the list of products to display on the shop page.
        /// </summary>
        public IEnumerable<Product> Products { get; set; } = null!;
    }
}
