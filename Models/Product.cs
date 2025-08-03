namespace BobaLite.Models
{
    /// <summary>
    /// Represents a product in the BobaLite store.
    /// </summary>
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; } = "";
        public string? Description { get; set; }
        public string Type { get; set; } = "";
        public bool IsActive { get; set; } = true;
        public List<ProductVariant> Variants { get; set; } = new();
        public ICollection<ProductCategory> ProductCategories { get; set; } = new List<ProductCategory>();
    }
}
