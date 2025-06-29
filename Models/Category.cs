// Models/Category.cs
namespace BobaLite.Models
{
    public class Category
    {
        public int Id { get; set; }
        public string Name { get; set; } = "";
        public string Slug { get; set; } = "";
        public int? ParentCategoryId { get; set; }
        public Category? Parent { get; set; }
        public ICollection<Category> Children { get; set; } = new List<Category>();

        // Many‐to‐many link to Product
        public ICollection<ProductCategory> ProductCategories { get; set; }
            = new List<ProductCategory>();
    }
}
