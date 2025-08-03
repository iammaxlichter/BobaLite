// ───── Framework Usings ─────────────────────────────
using System.Collections.Generic;

namespace BobaLite.Models
{
    /// <summary>
    /// Represents a product category in the BobaLite application.
    /// </summary>
    public class Category
    {
        public int Id { get; set; }
        public string Name { get; set; } = "";
        public string Slug { get; set; } = "";
        public int? ParentCategoryId { get; set; }
        public Category? Parent { get; set; }
        public ICollection<Category> Children { get; set; } = new List<Category>();
        public ICollection<ProductCategory> ProductCategories { get; set; } = new List<ProductCategory>();
    }
}
