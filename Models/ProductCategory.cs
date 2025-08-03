namespace BobaLite.Models
{
    /// <summary>
    /// Represents the many-to-many relationship between a product and a category.
    /// </summary>
    public class ProductCategory
    {
        public int ProductId { get; set; }
        public Product Product { get; set; } = null!;
        public int CategoryId { get; set; }
        public Category Category { get; set; } = null!;
    }
}
